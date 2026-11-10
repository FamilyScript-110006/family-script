import { NextResponse } from "next/server";

import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validators";
import { resendVerificationSchema, verifyEmailSchema } from "./auth.validators";
import { forgotPasswordSchema, resetPasswordSchema } from "./auth.validators";
import { getSession } from "@/lib/auth/session";
import {
  FORGOT_PASSWORD_LIMIT,
  LOGIN_FAILURE_LIMIT,
  RESEND_LIMIT,
  getClientIp,
  hitRateLimit,
  peekRateLimit,
  rateLimitedResponse,
  resetRateLimit,
} from "@/lib/rate-limit";

export const authController = {
  async register(request: Request) {
    let body: unknown;

    // Parse JSON body
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    // Validate payload shape
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid registration payload.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    try {
      const result = await authService.registerUser(parsed.data);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message:
              result.message === "EMAIL_TAKEN"
                ? "This email address is already registered."
                : result.message,
            code: result.message === "EMAIL_TAKEN" ? "EMAIL_TAKEN" : undefined,
          },
          { status: result.status },
        );
      }

      // Neon Auth sent the verification email during registration.
      return NextResponse.json(
        {
          success: true,
          message: "Registration successful. Please verify your email address.",
          data: {
            id: result.userId,
            email: result.email,
          },
        },
        { status: 201 },
      );
    } catch (error) {
      // Unexpected/server errors
      console.error("[auth.register] Unexpected error:", error);

      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  },

  async login(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid login payload.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Failed attempts are counted per email + IP, so someone else can't
    // lock a victim out of their own account from a different address.
    const loginKey = `login:${parsed.data.email}:${getClientIp(request)}`;
    const current = peekRateLimit(loginKey, LOGIN_FAILURE_LIMIT.limit);

    if (current.limited) {
      return rateLimitedResponse(current.retryAfterSeconds);
    }

    try {
      const result = await authService.loginUser(parsed.data);

      if (!result.success) {
        // Only wrong credentials count; unverified email (403) does not.
        if (result.status === 401) {
          const after = hitRateLimit(
            loginKey,
            LOGIN_FAILURE_LIMIT.limit,
            LOGIN_FAILURE_LIMIT.windowSeconds,
          );

          if (after.limited) {
            return rateLimitedResponse(after.retryAfterSeconds);
          }
        }

        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      resetRateLimit(loginKey);

      resetRateLimit(loginKey);

      return NextResponse.json(
        {
          success: true,
          message: "Login successful.",
          data: { id: result.userId, email: result.email },
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("[auth.login] Unexpected error:", error);

      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  },

  async getCurrentUser() {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          emailVerified: session.user.emailVerified,
        },
      },
      { status: 200 },
    );
  },

  async verifyEmail(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const parsed = verifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    try {
      const result = await authService.verifyEmail(parsed.data);

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      return NextResponse.json(
        { success: true, message: "Email verified successfully." },
        { status: 200 },
      );
    } catch (error) {
      console.error("[auth.verifyEmail] Unexpected error:", error);

      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  },

  async resendVerification(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const parsed = resendVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const resendKey = `resend:${parsed.data.email}`;
    const resendLimit = peekRateLimit(resendKey, RESEND_LIMIT.limit);

    if (resendLimit.limited) {
      return rateLimitedResponse(resendLimit.retryAfterSeconds);
    }

    hitRateLimit(resendKey, RESEND_LIMIT.limit, RESEND_LIMIT.windowSeconds);

    try {
      const result = await authService.resendVerification(parsed.data);

      // Always answer with a generic success for client errors (unknown
      // email, already verified) so this endpoint can't be used to find
      // out which emails are registered.
      if (!result.success && result.status >= 500) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      return NextResponse.json(
        { success: true, message: "If this email needs verifying, a new link has been sent." },
        { status: 200 },
      );
    } catch (error) {
      console.error("[auth.resendVerification] Unexpected error:", error);

      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  },

  async forgotPassword(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const forgotKey = `forgot:${parsed.data.email}:${getClientIp(request)}`;
    const forgotLimit = peekRateLimit(forgotKey, FORGOT_PASSWORD_LIMIT.limit);

    if (forgotLimit.limited) {
      return rateLimitedResponse(forgotLimit.retryAfterSeconds);
    }

    hitRateLimit(
      forgotKey,
      FORGOT_PASSWORD_LIMIT.limit,
      FORGOT_PASSWORD_LIMIT.windowSeconds,
    );

    try {
      const result = await authService.forgotPassword(parsed.data);

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists for this email, a password reset link has been sent.",
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("[auth.forgotPassword] Unexpected error:", error);

      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  },

  async resetPassword(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    try {
      const result = await authService.resetPassword(parsed.data);

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      return NextResponse.json(
        { success: true, message: "Password reset successfully." },
        { status: 200 },
      );
    } catch (error) {
      console.error("[auth.resetPassword] Unexpected error:", error);

      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  },

  async googleSignIn() {
    const url = await authService.getGoogleSignInUrl();
    return NextResponse.redirect(url);
  },
};
