"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import RateLimitNotice from "../shared/RateLimitNotice";
import { formatCountdown, useCountdown } from "../shared/useCountdown";

type SocialProvider = "google" | "apple" | "github";

const SOCIAL_OPTIONS: Array<{
  provider: SocialProvider;
  label: string;
}> = [
  { provider: "google", label: "Continue with Google" },
  { provider: "apple", label: "Continue with Apple" },
  { provider: "github", label: "Continue with GitHub" },
];

type LoginResponse = {
  message?: string;
  retryAfterSeconds?: number;
  errors?: Record<string, string[] | undefined>;
};

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
    return <span className="futura-medium text-[18px] font-bold text-[#4285f4]">G</span>;
  }

  if (provider === "apple") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.1.8 1.21-.25 2.37-.93 3.66-.84 1.55.13 2.72.74 3.48 1.87-3.2 1.92-2.44 6.14.49 7.32-.59 1.55-1.36 3.09-2.73 3.82ZM12.05 7.25C11.9 4.94 13.77 3.05 15.92 2.87c.3 2.67-2.42 4.65-3.87 4.38Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function SignInForm({ reason }: { reason?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [lockSeconds, setLockSeconds] = useCountdown(0);
  const [needsVerification, setNeedsVerification] = useState(false);

  function validate() {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setEmailError(validEmail ? "" : "Enter a valid email address.");
    setPasswordError(password ? "" : "Password is required.");
    return validEmail && Boolean(password);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNeedsVerification(false);
    if (lockSeconds > 0 || !validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await response.json()) as LoginResponse;

      if (response.status === 429) {
        setLockSeconds(data.retryAfterSeconds ?? 60);
        return;
      }

      if (!response.ok) {
        setNeedsVerification(response.status === 403);
        setFormError(data.message ?? "Invalid email or password.");
        return;
      }

      window.location.assign("/candidate-dashboard");
    } catch {
      setFormError("Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startSocialLogin(provider: SocialProvider) {
    setFormError("");
    setSocialLoading(provider);
    window.location.assign(`/auth/oauth/${provider}`);
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
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold">
          Sign up
        </Link>
      </p>

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

      <div className="flex flex-col gap-2">
        {SOCIAL_OPTIONS.map(({ provider, label }) => (
          <button
            key={provider}
            type="button"
            disabled={submitting || socialLoading !== null}
            onClick={() => startSocialLogin(provider)}
            className="futura-light flex h-12 items-center justify-center gap-3 rounded-full border border-soft-ivory/35 bg-soft-ivory/15 text-[15px] text-soft-ivory hover:bg-soft-ivory/25 focus-visible:ring-2 focus-visible:ring-antique-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SocialIcon provider={provider} />
            {socialLoading === provider ? "Redirecting..." : label}
          </button>
        ))}
      </div>
    </form>
  );
}
