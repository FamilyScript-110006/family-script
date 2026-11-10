import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import {
  updateTreeNodeSchema,
  treeIdSchema,
  nodeIdSchema,
} from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

type RouteParams = { params: Promise<{ treeId: string; nodeId: string }> };

/**
 * GET /api/trees/[treeId]/nodes/[nodeId]
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

    const node = await treeService.getTreeNodeById(treeId, nodeId);

    return successResponse(node, "Tree node fetched successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/trees/[treeId]/nodes/[nodeId]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const body = await request.json();
    const data = updateTreeNodeSchema.parse(body);

    const node = await treeService.updateTreeNode(treeId, nodeId, data);

    return successResponse(node, "Tree node updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/trees/[treeId]/nodes/[nodeId]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    await treeService.deleteTreeNode(treeId, nodeId);

    return successResponse(null, "Tree node deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}