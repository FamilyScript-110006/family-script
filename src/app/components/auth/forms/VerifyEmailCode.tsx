"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthApiError } from "@neon/auth";
import { authClient } from "@/lib/auth/client";
import { useCountdown } from "../shared/useCountdown";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailCode({
  email,
  sent,
}: {
  email?: string;
  sent: boolean;
}) {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState(email ?? "");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(sent);
  const [cooldown, setCooldown] = useCountdown(sent ? RESEND_COOLDOWN : 0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    sent ? "A verification code was sent to your email." : "",
  );
  const recipientEmail = (email ?? emailInput).trim();
  const hasKnownEmail = Boolean(email);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isValidEmail(recipientEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setVerifying(true);
    try {
      const result = await authClient.emailOtp.verifyEmail({
        email: recipientEmail,
        otp: code,
      });
      if (result.error) {
        setError(result.error.message ?? "That code is invalid or expired.");
        return;
      }

      router.replace("/sign-in?reason=email-verified");
    } catch (verificationError) {
      if (isAuthApiError(verificationError)) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[auth.verify-email] Code verification failed.", {
            status: verificationError.status,
            code: verificationError.code,
          });
        }

        setError(
          verificationError.status === 400
            ? "That code is invalid or expired. Request a new code and use the latest email."
            : verificationError.status === 429
              ? "Too many attempts. Please wait a moment before trying again."
              : "Unable to verify that code. Please try again.",
        );
        return;
      }

      if (process.env.NODE_ENV === "development") {
        console.error("[auth.verify-email] Code verification threw.", {
          errorType:
            verificationError instanceof Error
              ? verificationError.name
              : "UnknownError",
        });
      }
      setError("Unable to verify that code. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (sending || cooldown > 0) return;

    setSending(true);
    setError("");
    setMessage("");

    if (!isValidEmail(recipientEmail)) {
      setError("Enter a valid email address.");
      setSending(false);
      return;
    }

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: recipientEmail,
        type: "email-verification",
      });

      if (result.error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[auth.verify-email] Code resend failed.", {
            status: result.error.status,
            code: result.error.code,
          });
        }
        setError(result.error.message ?? "Unable to send a new code.");
        return;
      }

      setCodeSent(true);
      setMessage("A new verification code was sent to your email.");
      setCooldown(RESEND_COOLDOWN);
    } catch (resendError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[auth.verify-email] Code resend threw.", {
          errorType:
            resendError instanceof Error ? resendError.name : "UnknownError",
        });
      }
      setError("Unable to send a new code. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-5 text-center">
      <h2 className="futura-light text-[22px] text-soft-ivory">
        Verify your email
      </h2>
      <p className="futura-light break-words text-[16px] leading-6 text-soft-ivory/85">
        {hasKnownEmail ? (
          <>
            Enter the 6-digit code sent to{" "}
            <span className="text-warm-beige">{recipientEmail}</span>.
            {!codeSent && " If you already received a code, enter it below."}
          </>
        ) : (
          "Enter your email and the 6-digit verification code."
        )}
      </p>

      <form onSubmit={handleVerify} noValidate className="flex flex-col gap-4">
        {!hasKnownEmail && (
          <label>
            <span className="sr-only">Email address</span>
            <input
              type="email"
              autoComplete="email"
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error)}
              placeholder="Email address"
              className="futura-light h-12 w-full rounded-full border border-soft-ivory/45 bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/70 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold"
            />
          </label>
        )}
        <label>
          <span className="sr-only">Verification code</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "verification-code-error" : undefined}
            placeholder="6-digit code"
            className="futura-light h-12 w-full rounded-full border border-soft-ivory/45 bg-transparent px-5 text-center text-[18px] tracking-[0.3em] text-soft-ivory outline-none placeholder:text-soft-ivory/70 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold"
          />
        </label>
        <button
          type="submit"
          disabled={verifying || sending}
          className="futura-light h-12 rounded-full bg-soft-ivory text-[16px] text-dark-burgundy transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {verifying ? "VERIFYING..." : "VERIFY EMAIL"}
        </button>
      </form>

      {error && (
        <p id="verification-code-error" role="alert" className="text-[14px] text-[#ffb4b4]">
          {error}
        </p>
      )}
      {message && !error && (
        <p role="status" className="text-[14px] text-[#d9efc2]">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleResend}
        disabled={sending || cooldown > 0}
        className="futura-light text-[14px] text-antique-gold underline underline-offset-2 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending
          ? "SENDING CODE..."
          : cooldown > 0
            ? `RESEND CODE IN ${cooldown}s`
            : codeSent
              ? "RESEND CODE"
              : "SEND VERIFICATION CODE"}
      </button>

      <Link
        href={hasKnownEmail ? "/sign-up" : "/sign-in"}
        className="futura-light text-[14px] text-antique-gold underline underline-offset-2 hover:opacity-70"
      >
        {hasKnownEmail ? "Change email address" : "Return to sign in"}
      </Link>
    </div>
  );
}
