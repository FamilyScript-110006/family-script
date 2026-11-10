import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import {
  updateRelationshipSchema,
  treeIdSchema,
  relationshipIdSchema,
} from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

type RouteParams = { params: Promise<{ treeId: string; relationshipId: string }> };

/**
 * GET /api/trees/[treeId]/relationships/[relationshipId]
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
    const { relationshipId } = relationshipIdSchema.parse(resolved);

    const relationship = await treeService.getRelationshipById(treeId, relationshipId);

    return successResponse(relationship, "Relationship fetched successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/trees/[treeId]/relationships/[relationshipId]
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
    const { relationshipId } = relationshipIdSchema.parse(resolved);

    const body = await request.json();
    const data = updateRelationshipSchema.parse(body);

    const relationship = await treeService.updateRelationship(
      treeId,
      relationshipId,
      data
    );

    return successResponse(relationship, "Relationship updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/trees/[treeId]/relationships/[relationshipId]
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
    const { relationshipId } = relationshipIdSchema.parse(resolved);

    await treeService.deleteRelationship(treeId, relationshipId);

    return successResponse(null, "Relationship deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}