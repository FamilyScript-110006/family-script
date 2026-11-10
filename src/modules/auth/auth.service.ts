import { auth } from "@/lib/auth/server";
import type {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validators";
import type { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

type ServiceFailure = {
  success: false;
  status: number;
  message: string;
};

function failure(
  error: { status: number; message?: string },
  fallbackMessage: string,
): ServiceFailure {
  return {
    success: false,
    status: error.status,
    message: error.message ?? fallbackMessage,
  };
}

function appUrl(path: string): string {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `http://localhost:${process.env.PORT ?? "3000"}`;
  return new URL(path, origin).toString();
}

export const authService = {
  async registerUser(input: RegisterInput) {
    const { data, error } = await auth.signUp.email({
      name: input.name,
      email: input.email,
      password: input.password,
      callbackURL: appUrl("/verify-email?verified=1"),
    });

    if (error) {
      const emailAlreadyExists =
        error.status === 409 ||
        error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
        (error.message?.toLowerCase().includes("already exists") ?? false);

      return {
        success: false as const,
        status: emailAlreadyExists ? 409 : error.status,
        message: emailAlreadyExists ? "EMAIL_TAKEN" : error.message ?? "Sign up failed.",
      };
    }

    if (!data?.user) {
      throw new Error("Neon Auth sign-up returned no user.");
    }

    return {
      success: true as const,
      userId: data.user.id,
      email: data.user.email,
    };
  },

  async loginUser(input: LoginInput) {
    const { data, error } = await auth.signIn.email({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return failure(error, "Login failed.");
    }

    if (!data?.user) {
      throw new Error("Neon Auth sign-in returned no user.");
    }

    return {
      success: true as const,
      userId: data.user.id,
      email: data.user.email,
    };
  },

  async verifyEmail(input: z.infer<typeof verifyEmailSchema>) {
    const { error } = await auth.verifyEmail({
      query: { token: input.token },
    });

    return error
      ? failure(error, "Email verification failed.")
      : { success: true as const };
  },

  async resendVerification(
    input: z.infer<typeof resendVerificationSchema>,
  ) {
    const { error } = await auth.sendVerificationEmail({
      email: input.email,
      callbackURL: appUrl("/verify-email?verified=1"),
    });

    return error
      ? failure(error, "Could not resend verification email.")
      : { success: true as const };
  },

  async forgotPassword(input: z.infer<typeof forgotPasswordSchema>) {
    const { error } = await auth.requestPasswordReset({
      email: input.email,
      redirectTo: appUrl("/reset-password"),
    });

    return error
      ? failure(error, "Could not send password reset email.")
      : { success: true as const };
  },

  async resetPassword(input: z.infer<typeof resetPasswordSchema>) {
    const { error } = await auth.resetPassword({
      token: input.token,
      newPassword: input.password,
    });

    return error
      ? failure(error, "Password reset failed.")
      : { success: true as const };
  },

  async getGoogleSignInUrl() {
    const { data, error } = await auth.signIn.social({
      provider: "google",
      callbackURL: appUrl("/candidate-dashboard"),
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.url) {
      throw new Error("Neon Auth did not return a Google sign-in URL.");
    }

    return data.url;
  },
};
