import { auth } from "@/lib/auth/server";
import type { NextRequest } from "next/server";

const handleAuth = auth.middleware({
  loginUrl: "/sign-in",
});

export default async function proxy(request: NextRequest) {
  const response = await handleAuth(request);

  if (process.env.NODE_ENV === "development") {
    const location = response.headers.get("location");
    const redirectPath = location ? new URL(location, request.url).pathname : null;

    console.info("[auth.proxy] Request checked.", {
      path: request.nextUrl.pathname,
      hasOAuthVerifier: request.nextUrl.searchParams.has(
        "neon_auth_session_verifier",
      ),
      hasSessionChallengeCookie:
        request.cookies.has("__Secure-neon-auth.session_challenge") ||
        request.cookies.has("__Secure-neon-auth.session_challange"),
      hasSessionTokenCookie: request.cookies.has(
        "__Secure-neon-auth.session_token",
      ),
      status: response.status,
      redirectPath,
    });
  }

  return response;
}

export const config = {
  matcher: ["/candidate-dashboard/:path*"],
};
