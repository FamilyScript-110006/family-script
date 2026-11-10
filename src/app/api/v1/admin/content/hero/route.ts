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

    const hero = await prisma.heroContent.findFirst();

    if (!hero) {
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
        id: hero.id,
        heading: hero.heading,
        subheading: hero.subheading,
        ctaText: hero.ctaText,
        ctaUrl: hero.ctaUrl,
        updatedAt: hero.updatedAt,
        updatedBy: hero.updatedBy,
      },
    });
  } catch (error) {
    console.error("[ADMIN_CONTENT_HERO_GET]", error);

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
    const { heading, subheading, ctaText, ctaUrl } = body;

    // Validate heading
    if (
      !heading ||
      typeof heading !== "string" ||
      heading.trim().length < 3 ||
      heading.trim().length > 150
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation Error: heading is required and must be 3-150 characters",
        },
        { status: 400 },
      );
    }

    // Validate subheading
    if (
      subheading !== undefined &&
      (typeof subheading !== "string" || subheading.length > 300)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation Error: subheading must be max 300 characters",
        },
        { status: 400 },
      );
    }

    // Validate CTA text
    if (
      ctaText !== undefined &&
      (typeof ctaText !== "string" || ctaText.length > 50)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation Error: ctaText must be max 50 characters",
        },
        { status: 400 },
      );
    }

    // Validate CTA URL
    if (ctaUrl !== undefined) {
      if (typeof ctaUrl !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Validation Error: ctaUrl must be a string",
          },
          { status: 400 },
        );
      }

      const isValidUrl =
        ctaUrl.startsWith("/") ||
        ctaUrl.startsWith("http://") ||
        ctaUrl.startsWith("https://");

      if (!isValidUrl) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Validation Error: ctaUrl must be a valid relative or absolute URL",
          },
          { status: 400 },
        );
      }
    }

    const existing = await prisma.heroContent.findFirst();

    await prisma.$transaction(async (tx) => {
      await tx.heroContent.upsert({
        where: {
          id: existing?.id ?? "hero_1",
        },
        update: {
          heading: heading.trim(),
          ...(subheading !== undefined && {
            subheading: subheading.trim(),
          }),
          ...(ctaText !== undefined && {
            ctaText: ctaText.trim(),
          }),
          ...(ctaUrl !== undefined && {
            ctaUrl: ctaUrl.trim(),
          }),
          updatedBy: session.userId,
        },
        create: {
          id: "hero_1",
          heading: heading.trim(),
          subheading: subheading?.trim() ?? "",
          ctaText: ctaText?.trim() ?? "Get Started",
          ctaUrl: ctaUrl?.trim() ?? "/register",
          updatedBy: session.userId,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "UPDATE_HERO_CONTENT",
          entityType: "HeroContent",
          entityId: existing?.id ?? "hero_1",
          metadata: {
            heading,
            subheading,
            ctaText,
            ctaUrl,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Hero section updated",
    });
  } catch (error) {
    console.error("[ADMIN_CONTENT_HERO_PATCH]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}