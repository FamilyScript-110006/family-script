import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import {
  updateOrganizationProfileSchema,
  treeIdSchema,
  nodeIdSchema,
} from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

type RouteParams = { params: Promise<{ treeId: string; nodeId: string }> };

/**
 * GET /api/trees/[treeId]/nodes/[nodeId]/organization-profile
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

    const profile = await treeService.getOrganizationProfile(
      treeId,
      session.user.id,
      nodeId
    );

    return successResponse(profile, "Organization profile fetched successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/trees/[treeId]/nodes/[nodeId]/organization-profile
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
    const data = updateOrganizationProfileSchema.parse(body);

    const profile = await treeService.updateOrganizationProfile(
      treeId,
      session.user.id,
      nodeId,
      data
    );

    return successResponse(profile, "Organization profile updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}