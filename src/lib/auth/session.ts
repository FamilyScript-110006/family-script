import { auth } from "./server";
import { prisma } from "@/config/database";

export async function getSession() {
  try {
    const { data, error } = await auth.getSession();

    if (error) {
      console.error(
        `[auth.session] Neon Auth session lookup failed (${error.status} ${error.code}).`,
      );
      return null;
    }

    if (!data?.user || !data.session) {
      return null;
    }

    if (!data.user.emailVerified) {
      return null;
    }

    // Managed Auth IDs differ from legacy app IDs, so link only verified identities by email.
    const appEmail = data.user.email.toLowerCase();
    const appUsers = await prisma.user.findMany({
      where: { email: { equals: appEmail, mode: "insensitive" } },
      select: {
        id: true,
        role: true,
        status: true,
        deletedAt: true,
        emailVerified: true,
      },
      take: 2,
    });

    if (appUsers.length > 1) {
      console.error(
        "[auth.session] Multiple app users match a verified Neon Auth email.",
      );
      return null;
    }

    let appUser = appUsers[0];

    if (!appUser) {
      appUser = await prisma.user.upsert({
        where: { email: appEmail },
        update: {},
        create: {
          id: data.user.id,
          email: appEmail,
          emailVerified: data.user.emailVerified,
          name: data.user.name,
          avatarUrl: data.user.image,
        },
        select: {
          id: true,
          role: true,
          status: true,
          deletedAt: true,
          emailVerified: true,
        },
      });
    } else if (!appUser.emailVerified) {
      appUser = await prisma.user.update({
        where: { id: appUser.id },
        data: { emailVerified: true },
        select: {
          id: true,
          role: true,
          status: true,
          deletedAt: true,
          emailVerified: true,
        },
      });
    }

    if (appUser.deletedAt || appUser.status !== "ACTIVE") {
      return null;
    }

    return {
      ...data,
      user: {
        ...data.user,
        id: appUser.id,
        role: appUser.role,
      },
    };
  } catch (error) {
    console.error("Failed to retrieve auth session:", error);
    return null;
  }
}