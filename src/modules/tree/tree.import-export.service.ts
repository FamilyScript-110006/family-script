import { PrismaClient, TreeType, TreeVisibility } from "@prisma/client";
import PDFDocument from "pdfkit";

interface ExportOptions {
  format: "JSON" | "CSV" | "PDF";
}

interface ImportOptions {
  treeType: TreeType;
}

interface ImportNode {
  id?: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  maidenName?: string | null;
  displayName?: string | null;
  nickname?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  birthPlace?: string | null;
  deathDate?: string | null;
  deathPlace?: string | null;
  isLiving?: boolean | null;
  bio?: string | null;
  avatarUrl?: string | null;
  linkedUserId?: string | null;
  occupation?: string | null;
  bloodGroup?: string | null;
  metadata?: unknown;
}

interface ImportRelationship {
  id?: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: string;
  parentKind?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
}

interface TreeExport {
  version: 1;
  exportedAt: string;
  tree: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    visibility: string;
    coverImageUrl: string | null;
    defaultLanguage: string | null;
  };
  nodes: ImportNode[];
  relationships: ImportRelationship[];
  profiles: {
    family: unknown[];
    organization: unknown[];
    tribe: unknown[];
  };
}

export class TreeImportExportService {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Export an entire tree.
   *
   * JSON = full backup
   * CSV  = flat member list
   * PDF  = human-readable tree report
   */
  async exportTree(
    treeId: string,
    userId: string,
    format: ExportOptions["format"],
  ) {
    const tree = await this.db.tree.findUnique({
      where: { id: treeId },
    });

    if (!tree) {
      throw new Error("Tree not found.");
    }

    const nodes = await this.db.treeNode.findMany({
      where: {
        treeId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const relationships = await this.db.relationship.findMany({
      where: {
        treeId,
      },
    });

    const nodeIds = nodes.map((node) => node.id);

    const [familyProfiles, organizationProfiles, tribeProfiles] =
      await Promise.all([
        this.db.familyProfile.findMany({
          where: {
            nodeId: {
              in: nodeIds,
            },
          },
        }),

        this.db.organizationProfile.findMany({
          where: {
            nodeId: {
              in: nodeIds,
            },
          },
        }),

        this.db.tribeProfile.findMany({
          where: {
            nodeId: {
              in: nodeIds,
            },
          },
        }),
      ]);

    const exportData: TreeExport = {
      version: 1,
      exportedAt: new Date().toISOString(),

      tree: {
        id: tree.id,
        name: tree.name,
        description: tree.description,
        type: tree.type,
        visibility: tree.visibility,
        coverImageUrl: tree.coverImageUrl,
        defaultLanguage: tree.defaultLanguage,
      },

      nodes: nodes.map((node) => ({
        id: node.id,
        firstName: node.firstName,
        middleName: node.middleName,
        lastName: node.lastName,
        maidenName: node.maidenName,
        displayName: node.displayName,
        nickname: node.nickname,
        gender: node.gender,
        birthDate: node.birthDate?.toISOString() ?? null,
        birthPlace: node.birthPlace,
        deathDate: node.deathDate?.toISOString() ?? null,
        deathPlace: node.deathPlace,
        isLiving: node.isLiving,
        bio: node.bio,
        avatarUrl: node.avatarUrl,
        linkedUserId: node.linkedUserId,
        occupation: node.occupation,
        bloodGroup: node.bloodGroup,
        metadata: node.metadata,
      })),

      relationships: relationships.map((relationship) => ({
        id: relationship.id,
        sourceNodeId: relationship.sourceNodeId,
        targetNodeId: relationship.targetNodeId,
        type: relationship.type,
        parentKind: relationship.parentKind,
        status: relationship.status,
        startDate: relationship.startDate?.toISOString() ?? null,
        endDate: relationship.endDate?.toISOString() ?? null,
        notes: relationship.notes,
      })),

      profiles: {
        family: familyProfiles,
        organization: organizationProfiles,
        tribe: tribeProfiles,
      },
    };

    switch (format) {
      case "JSON":
        return this.createJsonExport(exportData, tree.name);

      case "CSV":
        return this.createCsvExport(exportData, tree.name);

      case "PDF":
        return this.createPdfExport(exportData);

      default:
        throw new Error("Unsupported export format.");
    }
  }

  /**
   * Import a JSON or CSV tree.
   */
  async importTree(
    fileBuffer: Buffer,
    fileName: string,
    userId: string,
    options: ImportOptions,
  ) {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (extension === "json") {
      return this.importJson(
        fileBuffer.toString("utf-8"),
        userId,
        options.treeType,
      );
    }

    if (extension === "csv") {
      return this.importCsv(
        fileBuffer.toString("utf-8"),
        userId,
        options.treeType,
      );
    }

    throw new Error("Only JSON and CSV files can be imported.");
  }

  private createJsonExport(data: TreeExport, treeName: string) {
    const body = JSON.stringify(data, null, 2);

    return {
      buffer: Buffer.from(body, "utf-8"),
      contentType: "application/json",
      fileName: `${this.safeFileName(treeName)}.json`,
    };
  }

  /**
   * CSV is intentionally a flat member export.
   * JSON should be used when relationships/profiles need to be
   * preserved exactly.
   */
  private createCsvExport(data: TreeExport, treeName: string) {
    const headers = [
      "id",
      "firstName",
      "middleName",
      "lastName",
      "maidenName",
      "displayName",
      "nickname",
      "gender",
      "birthDate",
      "birthPlace",
      "deathDate",
      "deathPlace",
      "isLiving",
      "bio",
      "avatarUrl",
      "linkedUserId",
      "occupation",
      "bloodGroup",
    ];

    const rows = data.nodes.map((node) =>
      headers.map((header) =>
        this.csvEscape(
          (node as unknown as Record<string, unknown>)[header],
        ),
      ).join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");

    return {
      buffer: Buffer.from(csv, "utf-8"),
      contentType: "text/csv",
      fileName: `${this.safeFileName(treeName)}.csv`,
    };
  }

  /**
   * Generates a simple readable PDF report.
   */
  private createPdfExport(data: TreeExport) {
    const doc = new PDFDocument({
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    doc.fontSize(22).text(data.tree.name);

    doc.moveDown();

    doc
      .fontSize(11)
      .text(`Tree Type: ${data.tree.type}`)
      .text(`Visibility: ${data.tree.visibility}`)
      .text(`Members: ${data.nodes.length}`)
      .text(`Relationships: ${data.relationships.length}`)
      .text(`Exported: ${data.exportedAt}`);

    doc.moveDown();

    doc.fontSize(16).text("Members");

    doc.moveDown();

    for (const node of data.nodes) {
      const name =
        node.displayName ??
        `${node.firstName} ${node.lastName}`.trim();

      doc
        .fontSize(12)
        .text(name, {
          underline: true,
        });

      const details = [
        node.gender ? `Gender: ${node.gender}` : null,
        node.birthDate
          ? `Born: ${node.birthDate.substring(0, 10)}`
          : null,
        node.birthPlace
          ? `Birthplace: ${node.birthPlace}`
          : null,
        node.deathDate
          ? `Died: ${node.deathDate.substring(0, 10)}`
          : null,
        node.occupation
          ? `Occupation: ${node.occupation}`
          : null,
      ].filter(Boolean);

      if (details.length > 0) {
        doc.fontSize(9).text(details.join(" | "));
      }

      doc.moveDown();
    }

    doc.moveDown();

    doc.fontSize(16).text("Relationships");

    doc.moveDown();

    const nodeNames = new Map(
      data.nodes.map((node) => [
        node.id,
        node.displayName ??
          `${node.firstName} ${node.lastName}`.trim(),
      ]),
    );

    for (const relationship of data.relationships) {
      const source =
        nodeNames.get(relationship.sourceNodeId) ??
        relationship.sourceNodeId;

      const target =
        nodeNames.get(relationship.targetNodeId) ??
        relationship.targetNodeId;

      doc
        .fontSize(9)
        .text(`${source} → ${relationship.type} → ${target}`);
    }

    doc.end();

    return {
      buffer: new Promise<Buffer>((resolve) => {
        doc.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
      }),
      contentType: "application/pdf",
      fileName: `${this.safeFileName(data.tree.name)}.pdf`,
    };
  }

  private async importJson(
    jsonString: string,
    userId: string,
    treeType: TreeType,
  ) {
    let data: TreeExport;

    try {
      data = JSON.parse(jsonString);
    } catch {
      throw new Error("Invalid JSON file.");
    }

    if (!data.tree || !Array.isArray(data.nodes)) {
      throw new Error(
        "Invalid tree export. Expected tree and nodes fields.",
      );
    }

    return this.createImportedTree(
      data.tree.name,
      data.tree.description,
      data.tree.visibility as TreeVisibility,
      treeType,
      data.tree.coverImageUrl,
      data.tree.defaultLanguage,
      data.nodes,
      data.relationships ?? [],
      data.profiles,
      userId,
    );
  }

  private async importCsv(
    csvString: string,
    userId: string,
    treeType: TreeType,
  ) {
    const rows = this.parseCsv(csvString);

    if (rows.length === 0) {
      throw new Error("CSV file is empty.");
    }

    const required = ["firstName", "lastName"];

    for (const field of required) {
      if (!(field in rows[0])) {
        throw new Error(
          `CSV is missing required column: ${field}`,
        );
      }
    }

    const nodes: ImportNode[] = rows.map((row) => ({
      id: row.id || undefined,
      firstName: row.firstName,
      middleName: row.middleName || null,
      lastName: row.lastName,
      maidenName: row.maidenName || null,
      displayName: row.displayName || null,
      nickname: row.nickname || null,
      gender: row.gender || null,
      birthDate: row.birthDate || null,
      birthPlace: row.birthPlace || null,
      deathDate: row.deathDate || null,
      deathPlace: row.deathPlace || null,
      isLiving:
        row.isLiving === ""
          ? null
          : row.isLiving?.toLowerCase() === "true",
      bio: row.bio || null,
      avatarUrl: row.avatarUrl || null,
      linkedUserId: row.linkedUserId || null,
      occupation: row.occupation || null,
      bloodGroup: row.bloodGroup || null,
    }));

    return this.createImportedTree(
      "Imported Tree",
      "Imported from CSV",
      TreeVisibility.PRIVATE,
      treeType,
      null,
      "en",
      nodes,
      [],
      undefined,
      userId,
    );
  }

  private async createImportedTree(
    name: string,
    description: string | null | undefined,
    visibility: TreeVisibility,
    treeType: TreeType,
    coverImageUrl: string | null | undefined,
    defaultLanguage: string | null | undefined,
    nodes: ImportNode[],
    relationships: ImportRelationship[],
    profiles: TreeExport["profiles"] | undefined,
    userId: string,
  ) {
    return this.db.$transaction(
  async (tx) => {
      const baseSlug =
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        "imported-tree";

      let slug = baseSlug;
      let counter = 1;

      while (
        await tx.tree.findUnique({
          where: { slug },
          select: { id: true },
        })
      ) {
        slug = `${baseSlug}-${counter++}`;
      }

      const tree = await tx.tree.create({
        data: {
          name,
          description: description ?? undefined,
          type: treeType,
          visibility,
          coverImageUrl: coverImageUrl ?? undefined,
          defaultLanguage: defaultLanguage ?? "en",
          slug,
          owner: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await tx.treeMember.create({
        data: {
          tree: {
            connect: {
              id: tree.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          role: "OWNER",
        },
      });

      const nodeIdMap = new Map<string, string>();

      for (const node of nodes) {
        const created = await tx.treeNode.create({
          data: {
            treeId: tree.id,

            firstName: node.firstName,
            middleName: node.middleName ?? undefined,
            lastName: node.lastName,
            maidenName: node.maidenName ?? undefined,
            displayName: node.displayName ?? undefined,
            nickname: node.nickname ?? undefined,
            gender: node.gender as any,
            birthDate: node.birthDate
              ? new Date(node.birthDate)
              : undefined,
            birthPlace: node.birthPlace ?? undefined,
            deathDate: node.deathDate
              ? new Date(node.deathDate)
              : undefined,
            deathPlace: node.deathPlace ?? undefined,
            isLiving: node.isLiving ?? undefined,
            bio: node.bio ?? undefined,
            avatarUrl: node.avatarUrl ?? undefined,
            linkedUserId: node.linkedUserId ?? undefined,
            occupation: node.occupation ?? undefined,
            bloodGroup: node.bloodGroup ?? undefined,
            metadata: node.metadata ?? undefined,
          },
        });

        if (node.id) {
          nodeIdMap.set(node.id, created.id);
        }
      }

      for (const relationship of relationships) {
        const sourceNodeId = nodeIdMap.get(
          relationship.sourceNodeId,
        );

        const targetNodeId = nodeIdMap.get(
          relationship.targetNodeId,
        );

        if (!sourceNodeId || !targetNodeId) {
          continue;
        }

        await tx.relationship.create({
          data: {
            tree: {
              connect: {
                id: tree.id,
              },
            },

            sourceNode: {
              connect: {
                id: sourceNodeId,
              },
            },

            targetNode: {
              connect: {
                id: targetNodeId,
              },
            },

            createdBy: {
              connect: {
                id: userId,
              },
            },

            type: relationship.type as any,
            parentKind: relationship.parentKind as any,
            status: relationship.status as any,
            startDate: relationship.startDate
              ? new Date(relationship.startDate)
              : undefined,
            endDate: relationship.endDate
              ? new Date(relationship.endDate)
              : undefined,
            notes: relationship.notes ?? undefined,
          },
        });
      }

      if (profiles) {
        for (const profile of profiles.family ?? []) {
          const oldNodeId = (profile as { nodeId?: string }).nodeId;
          const newNodeId = oldNodeId
            ? nodeIdMap.get(oldNodeId)
            : undefined;

          if (!newNodeId) continue;

          const { nodeId: _, id: __, ...profileData } =
            profile as Record<string, unknown>;

          await tx.familyProfile.create({
            data: {
              ...(profileData as any),
              nodeId: newNodeId,
            },
          });
        }

        for (const profile of profiles.organization ?? []) {
          const oldNodeId = (profile as { nodeId?: string }).nodeId;
          const newNodeId = oldNodeId
            ? nodeIdMap.get(oldNodeId)
            : undefined;

          if (!newNodeId) continue;

          const { nodeId: _, id: __, ...profileData } =
            profile as Record<string, unknown>;

          await tx.organizationProfile.create({
            data: {
              ...(profileData as any),
              nodeId: newNodeId,
            },
          });
        }

        for (const profile of profiles.tribe ?? []) {
          const oldNodeId = (profile as { nodeId?: string }).nodeId;
          const newNodeId = oldNodeId
            ? nodeIdMap.get(oldNodeId)
            : undefined;

          if (!newNodeId) continue;

          const { nodeId: _, id: __, ...profileData } =
            profile as Record<string, unknown>;

          await tx.tribeProfile.create({
            data: {
              ...(profileData as any),
              nodeId: newNodeId,
            },
          });
        }
      }

    return {
      treeId: tree.id,
      name: tree.name,
      treeType: tree.type,
      memberCount: nodes.length,
      relationshipCount: relationships.length,
    };
  },
  {
    timeout: 15000,
  },
);
  }

  private csvEscape(value: unknown): string {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  private parseCsv(csv: string): Record<string, string>[] {
    const lines = csv
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      return [];
    }

    const headers = this.parseCsvLine(lines[0]);

    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line);

      return Object.fromEntries(
        headers.map((header, index) => [
          header,
          values[index] ?? "",
        ]),
      );
    });
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);

    return result;
  }

  private safeFileName(name: string) {
    return (
      name
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim()
        .replace(/\s+/g, "-") || "tree"
    );
  }
}