"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import RateLimitNotice from "../shared/RateLimitNotice";
import { formatCountdown, useCountdown } from "../shared/useCountdown";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lockSeconds, setLockSeconds] = useCountdown(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (lockSeconds > 0) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.status === 429) {
        const data = (await response.json()) as { retryAfterSeconds?: number };
        setLockSeconds(data.retryAfterSeconds ?? 60);
        return;
      }

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "Unable to request a password reset.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Unable to request a password reset. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-5 text-center">
        <h2 className="futura-light text-[22px] text-soft-ivory">Check your email</h2>
        <p className="futura-light text-[16px] leading-6 text-soft-ivory/85">
          If an account exists for {email.trim()}, we sent a password reset link.
        </p>
        <Link
          href="/sign-in"
          className="futura-light flex h-12 items-center justify-center rounded-full bg-soft-ivory text-[16px] text-dark-burgundy hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold"
        >
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-4"
    >
      <h2 className="futura-light text-center text-[22px] text-soft-ivory">
        Forgot your password?
      </h2>
      <p className="futura-light text-center text-[16px] leading-6 text-soft-ivory/85">
        Enter your email and we&apos;ll send you a secure reset link.
      </p>
      <label className="relative block">
        <span className="sr-only">Email</span>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          aria-invalid={Boolean(error)}
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus-visible:ring-2 focus-visible:ring-antique-gold ${
            error ? "border-[#ffb4b4]" : "border-soft-ivory/45"
          }`}
        />
        {error && <span className="futura-light mt-1 block px-5 text-[14px] leading-5 text-[#ffb4b4]">{error}</span>}
      </label>
      {lockSeconds > 0 && (
        <RateLimitNotice
          seconds={lockSeconds}
          title="Too many requests"
          message="Please wait before requesting another reset link."
        />
      )}
      <button
        type="submit"
        disabled={submitting || lockSeconds > 0}
        className="futura-light h-12 rounded-full bg-soft-ivory text-[16px] text-dark-burgundy hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold disabled:opacity-60"
      >
        {submitting
          ? "SENDING..."
          : lockSeconds > 0
            ? `TRY AGAIN IN ${formatCountdown(lockSeconds)}`
            : "SEND RESET LINK"}
      </button>
      <Link href="/sign-in" className="futura-light text-center text-[14px] text-antique-gold underline underline-offset-2 hover:opacity-70">
        Return to login
      </Link>
    </form>
  );
}
