import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";

import { TreeRepository } from "@/modules/tree/tree.repository";
import { TreeService } from "@/modules/tree/tree.service";
import {
  createRelationshipSchema,
  relationshipQuerySchema,
  treeIdSchema,
} from "@/modules/tree/tree.validator";

import { prisma } from "@/config/database";

const treeRepository = new TreeRepository(prisma);
const treeService = new TreeService(treeRepository);

/**
 * GET /api/trees/[treeId]/relationships
 * Optional ?nodeId=... to filter to one node's relationships
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
    const { nodeId } = relationshipQuerySchema.parse({
      nodeId: searchParams.get("nodeId") ?? undefined,
    });

    const relationships = await treeService.getTreeRelationships(
      treeId,
      session.user.id,
      nodeId
    );

    return successResponse(relationships, "Relationships fetched successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/trees/[treeId]/relationships
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
    const data = createRelationshipSchema.parse(body);

    const relationship = await treeService.createRelationship(
      treeId,
      session.user.id,
      data
    );

    return successResponse(relationship, "Relationship created successfully.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}