import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import { invitationTokenSchema } from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

/**
 * POST /api/trees/invitations/[token]/accept
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { token } = invitationTokenSchema.parse(await params);

    const member = await treeService.acceptInvitation(token, session.user.id);

    return successResponse(member, "Invitation accepted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}