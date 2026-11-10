import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import {
  createTreeNodeSchema,
  treeIdSchema,
} from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

/**
 * GET /api/trees/[treeId]/nodes
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ treeId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { treeId } = treeIdSchema.parse(await params);

    const nodes = await treeService.getTreeNodes(treeId, session.user.id);

    return successResponse(nodes, "Tree nodes fetched successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/trees/[treeId]/nodes
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ treeId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { treeId } = treeIdSchema.parse(await params);

    const body = await request.json();
    const data = createTreeNodeSchema.parse(body);

    const node = await treeService.addTreeNode(treeId, session.user.id, data);

    return successResponse(node, "Tree node created successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}