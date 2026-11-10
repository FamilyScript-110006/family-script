"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

type FieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string>
>;

type SocialProvider = "google" | "apple" | "github";

const SOCIAL_OPTIONS: Array<{
  provider: SocialProvider;
  label: string;
}> = [{ provider: "google", label: "Continue with Google" }];

function SocialIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "google") {
    return (
      <span className="futura-medium text-[17px] font-bold text-[#ffffff]">
        G
      </span>
    );
  }

  return null;
}

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

function PasswordField({
  id,
  label,
  value,
  visible,
  error,
  onChange,
  onToggle,
}: {
  id: "password" | "confirmPassword";
  label: string;
  value: string;
  visible: boolean;
  error?: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <span className="relative block">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          placeholder={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 pr-12 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${error ? "border-[#ffb4b4]" : "border-soft-ivory/45"
            }`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-soft-ivory/70 transition-colors hover:text-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold"
        >
          <EyeIcon hidden={!visible} />
        </button>
      </span>
      {error && (
        <span id={`${id}-error`} className="futura-light mt-1 block px-5 text-[14px] leading-5 text-[#ffb4b4]">
          {error}
        </span>
      )}
    </label>
  );
}

export default function SignUpForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [existingAccount, setExistingAccount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
    null,
  );

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (values.name.trim().length < 2) {
      nextErrors.name = "Enter at least 2 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (values.password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    }

    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");
    setExistingAccount(false);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      if (process.env.NODE_ENV === "development") {
        console.info("[auth.sign-up] Email sign-up started.");
      }

      const email = values.email.trim();
      const result = await authClient.signUp.email({
        name: values.name.trim(),
        email,
        password: values.password,
      });

      if (result.error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[auth.sign-up] Email sign-up failed.", {
            status: result.error.status,
            code: result.error.code,
          });
        }

        const message = result.error.message ?? "Unable to create your account.";
        const normalizedMessage = message.toLowerCase();
        const emailAlreadyExists =
          result.error.status === 409 ||
          result.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
          normalizedMessage.includes("already exists") ||
          normalizedMessage.includes("already registered");

        if (emailAlreadyExists) {
          setExistingAccount(true);
          setErrors({ email: "This email address already has an account." });
        } else {
          setFormError(message);
        }

        return;
      }

      if (process.env.NODE_ENV === "development") {
        console.info("[auth.sign-up] Email sign-up succeeded.", {
          hasUser: Boolean(result.data?.user),
        });
      }

      router.push(
        `/verify-email/code?email=${encodeURIComponent(email)}&sent=1`,
      );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[auth.sign-up] Email sign-up request threw.", {
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
      }
      setFormError(
        "Unable to create your account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function updateValue(
    field: keyof typeof values,
    value: string,
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === "email") {
      setExistingAccount(false);
    }
    setFormError("");
  }

  async function startSocialSignUp(provider: SocialProvider) {
    setFormError("");
    setSocialLoading(provider);

    try {
      if (process.env.NODE_ENV === "development") {
        console.info("[auth.sign-up] Social sign-in started.", { provider });
      }

      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/candidate-dashboard",
      });

      if (result.error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[auth.sign-up] Social sign-in failed.", {
            provider,
            status: result.error.status,
            code: result.error.code,
          });
        }
        setFormError(
          result.error.message ?? "Unable to continue with Google."
        );
        setSocialLoading(null);
        return;
      }

      const redirectUrl = result.data?.url;
      if (!redirectUrl) {
        if (process.env.NODE_ENV === "development") {
          console.error("[auth.sign-up] Social sign-in returned no redirect URL.", {
            provider,
          });
        }
        setFormError("Google sign-in did not return a redirect URL.");
        setSocialLoading(null);
        return;
      }

      if (process.env.NODE_ENV === "development") {
        console.info("[auth.sign-up] Navigating to the OAuth provider.", {
          provider,
          sdkRedirectFlag: result.data.redirect,
        });
      }
      window.location.assign(redirectUrl);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[auth.sign-up] Social sign-in request threw.", {
          provider,
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
      }
      setFormError("Unable to start Google sign-up.");
      setSocialLoading(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="pointer-events-auto absolute left-1/2 top-[320px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-[10px]"
    >
      <p className="futura-light  text-center text-[16px] text-antique-gold">
        Create your account
      </p>
      <p className="futura-light  text-center text-[14px] text-antique-gold">
        <Link
          href="/sign-in"
          className="underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold"
        >
          Already have an account? Log in
        </Link>
      </p>
      <label className="relative block">
        <span className="sr-only">Name</span>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${errors.name ? "border-[#ffb4b4]" : "border-soft-ivory/45"
            }`}
        />
        {errors.name && <span className="futura-light mt-1 block px-5 text-[14px] leading-5 text-[#ffb4b4]">{errors.name}</span>}
      </label>

      <label className="relative block">
        <span className="sr-only">Email</span>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${errors.email ? "border-[#ffb4b4]" : "border-soft-ivory/45"
            }`}
        />
      </label>
      {errors.email && (
        <p
          id="email-error"
          role={existingAccount ? "alert" : undefined}
          className="futura-light -mt-2 px-5 text-[14px] leading-5 text-[#ffb4b4]"
        >
          {errors.email}{" "}
          {existingAccount && (
            <Link
              href="/sign-in"
              className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold"
            >
              Log in instead.
            </Link>
          )}
        </p>
      )}

      <PasswordField
        id="password"
        label="Password"
        value={values.password}
        visible={showPasswords}
        error={errors.password}
        onChange={(value) => updateValue("password", value)}
        onToggle={() => setShowPasswords((visible) => !visible)}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        value={values.confirmPassword}
        visible={showPasswords}
        error={errors.confirmPassword}
        onChange={(value) => updateValue("confirmPassword", value)}
        onToggle={() => setShowPasswords((visible) => !visible)}
      />

      {formError && (
        <p role="alert" className="futura-light text-center text-[14px] text-[#ffb4b4]">
          {formError}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="futura-light mt-1 h-12 rounded-full bg-soft-ivory text-[16px] text-dark-burgundy transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-burgundy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "CREATING ACCOUNT..." : "SIGN UP"}
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
            onClick={() => startSocialSignUp(provider)}
            aria-label={socialLoading === provider ? "Redirecting..." : label}
            title={label}
            className="flex size-12 items-center justify-center rounded-full border border-soft-ivory/35 bg-soft-ivory/15 text-soft-ivory transition-colors hover:bg-soft-ivory/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SocialIcon provider={provider} />
          </button>
        ))}
      </div>
    </form>
  );
}
