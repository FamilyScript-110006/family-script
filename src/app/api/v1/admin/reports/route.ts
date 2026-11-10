// src/app/api/v1/admin/reports/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getReportsQuerySchema } from "@/lib/validations/report";

export async function GET(request: NextRequest) {
  try {
    // 1. Get the current session from Neon Managed Auth.
    const session = await getSession();

    // User is not logged in.
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // Fetch the app role from the Prisma User table.
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    // User does not exist or is not a SUPER_ADMIN.
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient role",
        },
        { status: 403 },
      );
    }

    // 3. Parse and validate query parameters.
    const { searchParams } = new URL(request.url);

    const parsed = getReportsQuerySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      entityType: searchParams.get("entityType") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Query Params",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { page, limit, status, entityType } = parsed.data;

    // 4. Build the Prisma where clause dynamically.
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    // 5. Fetch reports and total count in parallel.
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.report.count({
        where,
      }),
    ]);

    // 6. Return the response.
    return NextResponse.json({
      success: true,
      data: {
        reports: reports.map((report) => ({
          id: report.id,
          reportedBy: report.reportedById,
          entityType: report.entityType,
          entityId: report.entityId,
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt.toISOString(),
        })),

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error(
      "GET /api/v1/admin/reports error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}