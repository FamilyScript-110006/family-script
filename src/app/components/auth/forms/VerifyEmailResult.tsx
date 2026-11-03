"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  /** `?token=` : verify it through the API. */
  token?: string;
  /** `?verified=1` : Better Auth already verified it and redirected here. */
  verified?: boolean;
  /** `?error=` : Better Auth redirected here because verification failed. */
  error?: string;
};

type State = "verifying" | "success" | "expired" | "invalid";

function failureState(message?: string): State {
  return /expired/i.test(message ?? "") ? "expired" : "invalid";
}

const linkClass =
  "futura-light flex h-12 items-center justify-center rounded-full bg-soft-ivory text-[16px] text-dark-burgundy hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold";

export default function VerifyEmailResult({ token, verified, error }: Props) {
  const [state, setState] = useState<State>(() => {
    if (error) return failureState(error);
    if (token) return "verifying";
    return verified ? "success" : "invalid";
  });

  useEffect(() => {
    if (error || !token) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (cancelled) return;

        if (response.ok) {
          setState("success");
          return;
        }

        const data = (await response.json()) as { message?: string };
        setState(failureState(data.message));
      } catch {
        if (!cancelled) setState("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, error]);

  const wrapper =
    "pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-5 text-center";

  if (state === "verifying") {
    return (
      <div className={wrapper} role="status">
        <h2 className="futura-light text-[22px] text-soft-ivory">Verifying your email</h2>
        <p className="futura-light text-[16px] leading-6 text-soft-ivory/85">
          One moment please...
        </p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className={wrapper}>
        <div
          className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-[#d9efc2] text-[30px] text-[#d9efc2]"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2 className="futura-light text-[22px] text-soft-ivory">Email verified</h2>
        <p className="futura-light text-[16px] leading-6 text-soft-ivory/85">
          Your email address is confirmed. You can now log in to your account.
        </p>
        <Link href="/sign-in" className={linkClass}>
          Continue to log in
        </Link>
      </div>
    );
  }

  const expired = state === "expired";

  return (
    <div className={wrapper}>
      <div
        className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-[#ffb4b4] text-[30px] text-[#ffb4b4]"
        aria-hidden="true"
      >
        !
      </div>
      <h2 className="futura-light text-[22px] text-soft-ivory">
        {expired ? "This link has expired" : "This link is not valid"}
      </h2>
      <p className="futura-light text-[16px] leading-6 text-soft-ivory/85">
        {expired
          ? "Verification links are only valid for a short time. Request a new one to continue."
          : "The verification link is invalid or has already been used. Request a new one to continue."}
      </p>
      <Link href="/verify-email/pending" className={linkClass}>
        Request a new link
      </Link>
      <Link
        href="/sign-in"
        className="futura-light text-[14px] text-antique-gold underline underline-offset-2 hover:opacity-70"
      >
        Return to login
      </Link>
    </div>
  );
}
