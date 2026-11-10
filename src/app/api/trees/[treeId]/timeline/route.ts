import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import { timelineQuerySchema, treeIdSchema } from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

/**
 * GET /api/trees/[treeId]/timeline
 * Optional ?from=YYYY-MM-DD&to=YYYY-MM-DD
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

    const { searchParams } = new URL(request.url);
    const range = timelineQuerySchema.parse({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    });

    const events = await treeService.getTreeTimeline(treeId, session.user.id, range);

    return successResponse({ events }, "Timeline fetched successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}