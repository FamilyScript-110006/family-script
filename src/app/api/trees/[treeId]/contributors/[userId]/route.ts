import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import {
  updateContributorRoleSchema,
  treeIdSchema,
  contributorUserIdSchema,
} from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

type RouteParams = { params: Promise<{ treeId: string; userId: string }> };

/**
 * PATCH /api/trees/[treeId]/contributors/[userId]
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
    const { userId } = contributorUserIdSchema.parse(resolved);

    const body = await request.json();
    const data = updateContributorRoleSchema.parse(body);

    const member = await treeService.updateContributorRole(
      treeId,
      session.user.id,
      userId,
      data
    );

    return successResponse(member, "Contributor role updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/trees/[treeId]/contributors/[userId]
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
    const { userId } = contributorUserIdSchema.parse(resolved);

    await treeService.removeContributor(treeId, session.user.id, userId);

    return successResponse(null, "Contributor removed successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}