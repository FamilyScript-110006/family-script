"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { isAuthApiError } from "@neon/auth";
import { authClient } from "@/lib/auth/client";

import RateLimitNotice from "../shared/RateLimitNotice";
import { formatCountdown, useCountdown } from "../shared/useCountdown";

type SocialProvider = "google";

const SOCIAL_OPTIONS: Array<{
  provider: SocialProvider;
  label: string;
}> = [{ provider: "google", label: "Continue with Google" }];

const SIGN_IN_MESSAGES = [
  "Hang tight while we fetch your deepest memories...",
  "Gathering your family tree...",
  "Getting your stories ready...",
  "Making scenes...",
];

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="currentColor"
        d="m3.27 2.56 18.17 18.17-1.41 1.41-3.1-3.1A10.7 10.7 0 0 1 12 20C6.5 20 2.02 16.58.5 12a12.6 12.6 0 0 1 4.1-5.67L1.86 3.97l1.41-1.41ZM12 5c5.5 0 9.98 3.42 11.5 7a12.6 12.6 0 0 1-3.87 5.5l-2.21-2.21A6 6 0 0 0 8.71 7.6L6.03 4.92A12.6 12.6 0 0 1 12 5Zm0 3a4 4 0 0 1 4 4c0 .52-.1 1.02-.28 1.47l-5.2-5.2A4 4 0 0 1 12 8Zm-3.72 1.53 5.2 5.2A4 4 0 0 1 8 12c0-.9.3-1.77.82-2.47Z"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="currentColor"
        d="M12 5c5.5 0 9.98 3.42 11.5 7-1.52 3.58-6 7-11.5 7S2.02 15.58.5 12C2.02 8.42 6.5 5 12 5Zm0 2C8.03 7 4.55 9.2 2.7 12 4.55 14.8 8.03 17 12 17s7.45-2.2 9.3-5C19.45 9.2 15.97 7 12 7Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
      />
    </svg>
  );
}

function SocialIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "google") {
    return <span className="futura-medium text-[18px] font-bold text-[#ffffff]">G</span>;
  }

  return null;
}

export default function SignInForm({ reason }: { reason?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [lockSeconds, setLockSeconds] = useCountdown(0);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [progressMessageIndex, setProgressMessageIndex] = useState(0);
  const isSigningIn = submitting || socialLoading !== null;

  useEffect(() => {
    if (!isSigningIn) return;

    const intervalId = window.setInterval(() => {
      setProgressMessageIndex((current) => (current + 1) % SIGN_IN_MESSAGES.length);
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [isSigningIn]);

  function validate() {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setEmailError(validEmail ? "" : "Enter a valid email address.");
    setPasswordError(password ? "" : "Password is required.");
    return validEmail && Boolean(password);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");
    setShowSignUpPrompt(false);
    setNeedsVerification(false);

    if (lockSeconds > 0 || !validate()) return;

    setSubmitting(true);

    try {
      if (process.env.NODE_ENV === "development") {
        console.info("[auth.sign-in] Email sign-in started.");
      }

      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/candidate-dashboard",
      });

      if (result.error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[auth.sign-in] Email sign-in failed.", {
            status: result.error.status,
            code: result.error.code,
          });
        }

        if (result.error.status === 429) {
          setLockSeconds(60);
        }

        setShowSignUpPrompt(result.error.status === 401);
        setNeedsVerification(result.error.status === 403);
        setFormError(
          result.error.status === 401
            ? "We couldn't sign you in. Check your email and password."
            : result.error.message ?? "Unable to log in. Please try again.",
        );
        return;
      }

      if (process.env.NODE_ENV === "development") {
        console.info("[auth.sign-in] Email sign-in succeeded.", {
          hasUser: Boolean(result.data?.user),
        });
      }

      window.location.assign("/candidate-dashboard");
    } catch (error) {
      if (isAuthApiError(error)) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[auth.sign-in] Email sign-in failed.", {
            status: error.status,
            code: error.code,
          });
        }

        if (error.status === 429) {
          setLockSeconds(60);
        }

        setShowSignUpPrompt(error.status === 401);
        setNeedsVerification(error.status === 403);
        setFormError(
          error.status === 401
            ? "We couldn't sign you in. Check your email and password."
            : error.status === 403
              ? "Please verify your email before signing in."
              : "Unable to log in. Please try again.",
        );
        return;
      }

      if (process.env.NODE_ENV === "development") {
        console.error("[auth.sign-in] Email sign-in request threw.", {
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
      }
      setFormError("Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function startSocialLogin(provider: SocialProvider) {
  setFormError("");
  setSocialLoading(provider);

  try {
    if (process.env.NODE_ENV === "development") {
      console.info("[auth.sign-in] Social sign-in started.", { provider });
    }

    const result = await authClient.signIn.social({
      provider,
      callbackURL: "/candidate-dashboard",
    });

    if (result.error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[auth.sign-in] Social sign-in failed.", {
          provider,
          status: result.error.status,
          code: result.error.code,
        });
      }
      setFormError(
        result.error.message ?? "Social login failed."
      );
      setSocialLoading(null);
      return;
    }

    const redirectUrl = result.data?.url;
    if (!redirectUrl) {
      if (process.env.NODE_ENV === "development") {
        console.error("[auth.sign-in] Social sign-in returned no redirect URL.", {
          provider,
        });
      }
      setFormError("Google sign-in did not return a redirect URL.");
      setSocialLoading(null);
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.info("[auth.sign-in] Navigating to the OAuth provider.", {
        provider,
        sdkRedirectFlag: result.data.redirect,
      });
    }
    window.location.assign(redirectUrl);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[auth.sign-in] Social sign-in request threw.", {
        provider,
        errorType: error instanceof Error ? error.name : "UnknownError",
      });
    }
    setFormError("Unable to start social login.");
    setSocialLoading(null);
  }
}

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-[13px]"
    >
      {reason === "session-expired" && (
        <p
          role="status"
          className="futura-light mb-1 rounded-3xl border border-antique-gold/50 bg-soft-ivory/10 px-5 py-3 text-center text-[14px] leading-5 text-soft-ivory"
        >
          Your session has expired. Please log in again to continue.
        </p>
      )}
      <p className="futura-light mb-1 text-center text-[16px] text-antique-gold">
        Log in to your account
      </p>
      <p className="futura-light mb-1 text-center text-[14px] text-antique-gold">
        <Link href="/sign-up" className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold">
          Don&apos;t have an account? Sign up
        </Link>
      </p>
      {isSigningIn && (
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="futura-light min-h-6 text-center text-[14px] text-soft-ivory"
        >
          {SIGN_IN_MESSAGES[progressMessageIndex]}
        </p>
      )}

      <label className="relative block">
        <span className="sr-only">Email</span>
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError("");
            setFormError("");
            setShowSignUpPrompt(false);
          }}
          aria-invalid={Boolean(emailError)}
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${
            emailError ? "border-[#ffb4b4]" : "border-soft-ivory/45"
          }`}
        />
        {emailError && <span className="futura-light mt-1 block px-5 text-[14px] leading-5 text-[#ffb4b4]">{emailError}</span>}
      </label>

      <label className="relative block">
        <span className="sr-only">Password</span>
        <input
          id="login-password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError("");
            setFormError("");
            setShowSignUpPrompt(false);
          }}
          aria-invalid={Boolean(passwordError)}
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 pr-12 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${
            passwordError ? "border-[#ffb4b4]" : "border-soft-ivory/45"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-soft-ivory/70 hover:text-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold"
        >
          <EyeIcon hidden={!showPassword} />
        </button>
        {passwordError && <span className="futura-light mt-1 block px-5 text-[14px] leading-5 text-[#ffb4b4]">{passwordError}</span>}
      </label>

      <div className="flex justify-end">
        <Link href="/forgot-password" className="futura-light text-[14px] text-antique-gold underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold">
          Forgot password?
        </Link>
      </div>

      {lockSeconds > 0 && <RateLimitNotice seconds={lockSeconds} />}

      {formError && lockSeconds === 0 && (
        <p role="alert" className="futura-light text-center text-[14px] text-[#ffb4b4]">
          {formError}
          {needsVerification && (
            <>
              {" "}
              <Link
                href={`/verify-email/pending?email=${encodeURIComponent(email.trim())}`}
                className="text-antique-gold underline underline-offset-2 hover:opacity-70"
              >
                Resend verification email
              </Link>
            </>
          )}
          {showSignUpPrompt && (
            <>
              {" "}
              New to Family Script?{" "}
              <Link
                href="/sign-up"
                className="text-antique-gold underline underline-offset-2 hover:opacity-70"
              >
                Create an account
              </Link>
              .
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || socialLoading !== null || lockSeconds > 0}
        className="futura-light mt-1 h-12 rounded-full bg-soft-ivory text-[16px] text-dark-burgundy hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-burgundy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "LOGGING IN..."
          : lockSeconds > 0
            ? `TRY AGAIN IN ${formatCountdown(lockSeconds)}`
            : "LOG IN"}
      </button>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-soft-ivory/25" />
        <span className="futura-light text-[14px] text-soft-ivory/80">or</span>
        <span className="h-px flex-1 bg-soft-ivory/25" />
      </div>

      <div className="flex items-center justify-center gap-4">
        {SOCIAL_OPTIONS.map(({ provider, label }) => (
          <button
            key={provider}
            type="button"
            disabled={submitting || socialLoading !== null}
            onClick={() => startSocialLogin(provider)}
            aria-label={socialLoading === provider ? "Redirecting..." : label}
            title={label}
            className="flex size-12 items-center justify-center rounded-full border border-soft-ivory/35 bg-soft-ivory/15 text-soft-ivory hover:bg-soft-ivory/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SocialIcon provider={provider} />
          </button>
        ))}
      </div>
    </form>
  );
}
