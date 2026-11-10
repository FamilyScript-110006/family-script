import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/config/database";
import { handleApiError } from "@/lib/api-error";

import { TreeImportExportService } from "@/modules/tree/tree.import-export.service";
import { treeIdSchema } from "@/modules/tree/tree.validator";

const treeImportExportService =
  new TreeImportExportService(prisma);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ treeId: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { treeId } = treeIdSchema.parse(await params);

    const body = await request.json();

    const format = String(body.format ?? "JSON").toUpperCase();

    if (!["JSON", "CSV", "PDF"].includes(format)) {
      return Response.json(
        {
          success: false,
          message: "Format must be JSON, CSV or PDF.",
        },
        { status: 400 },
      );
    }

    const result =
      await treeImportExportService.exportTree(
        treeId,
        session.user.id,
        format as "JSON" | "CSV" | "PDF",
      );

    const buffer =
      result.buffer instanceof Promise
        ? await result.buffer
        : result.buffer;

    return new Response(new Uint8Array(buffer), {
  status: 200,
  headers: {
    "Content-Type": result.contentType,
    "Content-Disposition": `attachment; filename="${result.fileName}"`,
        },
    });
  } catch (error) {
    return handleApiError(error);
  }
}