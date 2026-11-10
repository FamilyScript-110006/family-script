import { NextRequest, NextResponse } from "next/server";

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

    const about = await prisma.aboutContent.findFirst();

    if (!about) {
      return NextResponse.json(
        {
          success: false,
          message: "Content Not Found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: about.id,
        title: about.title,
        body: about.body,
        updatedAt: about.updatedAt,
        updatedBy: about.updatedBy,
      },
    });
  } catch (error) {
    console.error("[ADMIN_CONTENT_ABOUT_GET]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    const body = await req.json();
    const { title, body: bodyText } = body;

    // Validate title
    if (
      !title ||
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.trim().length > 150
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation Error: title is required and must be 3-150 characters",
        },
        { status: 400 },
      );
    }

    // Validate body
    if (
      !bodyText ||
      typeof bodyText !== "string" ||
      bodyText.trim().length < 10 ||
      bodyText.trim().length > 5000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation Error: body is required and must be 10-5000 characters",
        },
        { status: 400 },
      );
    }

    const existing = await prisma.aboutContent.findFirst();

    await prisma.$transaction(async (tx) => {
      await tx.aboutContent.upsert({
        where: {
          id: existing?.id ?? "about_1",
        },
        update: {
          title: title.trim(),
          body: bodyText.trim(),
          updatedBy: session.userId,
        },
        create: {
          id: "about_1",
          title: title.trim(),
          body: bodyText.trim(),
          updatedBy: session.userId,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "UPDATE_ABOUT_CONTENT",
          entityType: "AboutContent",
          entityId: existing?.id ?? "about_1",
          metadata: {
            title,
            body: bodyText,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "About section updated",
    });
  } catch (error) {
    console.error("[ADMIN_CONTENT_ABOUT_PATCH]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}