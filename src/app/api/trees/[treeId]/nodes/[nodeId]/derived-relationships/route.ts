import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import { treeIdSchema, nodeIdSchema } from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

type RouteParams = { params: Promise<{ treeId: string; nodeId: string }> };

/**
 * GET /api/trees/[treeId]/nodes/[nodeId]/derived-relationships
 *
 * Returns computed genealogical labels (grandmother, cousin, aunt/
 * uncle, in-law, ...) from this node to every other node in the
 * tree. FAMILY trees only.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const resolved = await params;
    const { treeId } = treeIdSchema.parse(resolved);
    const { nodeId } = nodeIdSchema.parse(resolved);

    const relationships = await treeService.getDerivedRelationships(
      treeId,
      session.user.id,
      nodeId
    );

    return successResponse(
      { relationships },
      "Derived relationships computed successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}