"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import RateLimitNotice from "../shared/RateLimitNotice";
import { useCountdown } from "../shared/useCountdown";

type Props = {
  /** Email the link was sent to. If missing, the user types it. */
  email?: string;
  /** True right after sign-up, when a link has just been sent. */
  justSent?: boolean;
};

type ResendResponse = { message?: string; retryAfterSeconds?: number };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN = 60;

export default function VerifyEmailPending({ email: initialEmail, justSent }: Props) {
  const knownEmail = Boolean(initialEmail);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [cooldown, setCooldown] = useCountdown(justSent ? RESEND_COOLDOWN : 0);
  const [blockedSeconds, setBlockedSeconds] = useCountdown(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(justSent ? "Verification email sent." : "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cooldown > 0 || blockedSeconds > 0 || sending) return;

    setError("");
    setInfo("");

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await response.json()) as ResendResponse;

      if (response.status === 429) {
        setBlockedSeconds(data.retryAfterSeconds ?? RESEND_COOLDOWN);
        return;
      }

      if (!response.ok) {
        setError(data.message ?? "Unable to send the email. Please try again.");
        return;
      }

      setInfo("Verification email sent.");
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setError("Unable to send the email. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const waiting = cooldown > 0;
  const idleLabel = knownEmail ? "RESEND EMAIL" : "SEND VERIFICATION LINK";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-4 text-center"
    >
      <h2 className="futura-light text-[22px] text-soft-ivory">Check your inbox</h2>

      {knownEmail ? (
        <p className="futura-light text-[16px] leading-6 text-soft-ivory/85">
          We sent a verification link to{" "}
          <span className="break-all text-warm-beige">{initialEmail}</span>. Click it to
          activate your account.
        </p>
      ) : (
        <>
          <p className="futura-light text-[16px] leading-6 text-soft-ivory/85">
            Enter your email and we&apos;ll send you a new verification link.
          </p>
          <label className="relative block text-left">
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
              className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${
                error ? "border-[#ffb4b4]" : "border-soft-ivory/45"
              }`}
            />
          </label>
        </>
      )}

      {blockedSeconds > 0 && (
        <RateLimitNotice
          seconds={blockedSeconds}
          title="Too many requests"
          message="Please wait before asking for another email."
        />
      )}

      {error && (
        <p role="alert" className="futura-light text-[14px] text-[#ffb4b4]">
          {error}
        </p>
      )}
      {info && !error && (
        <p role="status" className="futura-light text-[14px] text-[#d9efc2]">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={sending || waiting || blockedSeconds > 0}
        className="futura-light h-12 rounded-full bg-soft-ivory text-[16px] text-dark-burgundy hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-burgundy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "SENDING..." : waiting ? `RESEND IN ${cooldown}s` : idleLabel}
      </button>

      <p className="futura-light text-[14px] text-antique-gold">
        {knownEmail && (
          <>
            <Link
              href="/sign-up"
              className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold"
            >
              Change email address
            </Link>
            <span className="mx-2 text-soft-ivory/40" aria-hidden="true">
              |
            </span>
          </>
        )}
        <Link
          href="/sign-in"
          className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold"
        >
          Return to login
        </Link>
      </p>
    </form>
  );
}
