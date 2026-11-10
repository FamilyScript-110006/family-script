import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/config/database";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeImportExportService } from "@/modules/tree/tree.import-export.service";

import { TreeType } from "@prisma/client";

const treeImportExportService =
  new TreeImportExportService(prisma);

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();

    const file = formData.get("file");
    const treeType = formData.get("treeType");

    if (!(file instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "A file is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof treeType !== "string" ||
      !Object.values(TreeType).includes(
        treeType as TreeType,
      )
    ) {
      return Response.json(
        {
          success: false,
          message:
            "treeType must be FAMILY, ORGANIZATION or TRIBE.",
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const result =
      await treeImportExportService.importTree(
        Buffer.from(arrayBuffer),
        file.name,
        session.user.id,
        {
          treeType: treeType as TreeType,
        },
      );

    return successResponse(
      result,
      "Tree imported successfully.",
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}