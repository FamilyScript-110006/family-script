import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import {
  inviteContributorSchema,
  treeIdSchema,
} from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

/**
 * POST /api/trees/[treeId]/invitations
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
    const data = inviteContributorSchema.parse(body);

    const invitation = await treeService.inviteContributor(
      treeId,
      session.user.id,
      data
    );

    return successResponse(invitation, "Invitation sent successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}