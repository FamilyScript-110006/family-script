import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";

type AuthSession = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export type AuthenticatedUser = AuthSession["user"];

export type AuthenticatedRequest = NextRequest & {
  user: AuthenticatedUser;
  session: AuthSession["session"];
};

const unauthorizedResponse = () =>
  NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 },
  );

export async function authenticate(
  request: NextRequest,
): Promise<NextResponse | null> {
  const session = await getSession();

  if (!session?.user || !session.session) {
    return unauthorizedResponse();
  }

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = session.user;
  authenticatedRequest.session = session.session;

  return null;
}
