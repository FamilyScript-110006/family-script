import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/config/database";

async function requireAdmin() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return null;
  }

  return {
    userId: user.id,
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { searchParams } = req.nextUrl;

    const pageRaw = searchParams.get("page") ?? "1";
    const limitRaw = searchParams.get("limit") ?? "20";
    const status = searchParams.get("status") ?? undefined;

    const page = parseInt(pageRaw, 10);
    const limit = parseInt(limitRaw, 10);

    if (
      isNaN(page) ||
      page < 1 ||
      isNaN(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Query Params",
        },
        { status: 400 },
      );
    }

    const validStatuses = ["ACTIVE", "DRAFT", "EXPIRED"] as const;

    if (
      status &&
      !validStatuses.includes(
        status as (typeof validStatuses)[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Query Params: status must be ACTIVE, DRAFT or EXPIRED",
        },
        { status: 400 },
      );
    }

    const where: Prisma.AnnouncementWhereInput = {};

    if (status) {
      where.status =
        status as Prisma.AnnouncementWhereInput["status"];
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          body: true,
          status: true,
          publishedAt: true,
          expiresAt: true,
          createdBy: true,
          createdAt: true,
        },
      }),

      prisma.announcement.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        announcements,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENTS_GET]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}