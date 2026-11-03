"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type FieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string>
>;

type RegisterResponse = {
  success?: boolean;
  message?: string;
  code?: string;
  errors?: Record<string, string[] | undefined>;
};

type SocialProvider = "google" | "apple" | "github";

const SOCIAL_OPTIONS: Array<{
  provider: SocialProvider;
  label: string;
}> = [
  { provider: "google", label: "Continue with Google" },
  { provider: "apple", label: "Continue with Apple" },
  { provider: "github", label: "Continue with GitHub" },
];

function SocialIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "google") {
    return (
      <span className="futura-medium text-[17px] font-bold text-[#4285f4]">
        G
      </span>
    );
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
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 pr-12 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${
            error ? "border-[#ffb4b4]" : "border-soft-ivory/45"
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
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
    setSubmitted(false);
    setFormError("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      });
      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        if (data.code === "EMAIL_TAKEN") {
          setErrors({ email: "This email address is already registered." });
        } else if (data.errors) {
          setErrors({
            name: data.errors.name?.[0],
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
          });
        } else {
          setFormError(data.message ?? "Unable to create your account.");
        }
        return;
      }

      window.location.assign(
        `/verify-email/pending?email=${encodeURIComponent(values.email.trim())}&sent=1`,
      );
      return;
    } catch {
      setFormError("Unable to create your account. Please try again.");
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
    setFormError("");
  }

  function startSocialSignUp(provider: SocialProvider) {
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
      <p className="futura-light mb-1 text-center text-[16px] text-antique-gold">
        Create your account
      </p>
      <p className="futura-light mb-1 text-center text-[14px] text-antique-gold">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold"
        >
          Log in
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
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${
            errors.name ? "border-[#ffb4b4]" : "border-soft-ivory/45"
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
          className={`futura-light h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-soft-ivory outline-none placeholder:text-soft-ivory/75 focus:border-soft-ivory focus-visible:ring-2 focus-visible:ring-antique-gold ${
            errors.email ? "border-[#ffb4b4]" : "border-soft-ivory/45"
          }`}
        />
        {errors.email && <span className="futura-light mt-1 block px-5 text-[14px] leading-5 text-[#ffb4b4]">{errors.email}</span>}
      </label>

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
      {submitted && (
        <p role="status" className="futura-light text-center text-[14px] text-[#d9efc2]">
          Account created successfully.
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

      <div className="flex flex-col gap-2">
        {SOCIAL_OPTIONS.map(({ provider, label }) => (
          <button
            key={provider}
            type="button"
            disabled={submitting || socialLoading !== null}
            onClick={() => startSocialSignUp(provider)}
            className="futura-light flex h-12 items-center justify-center gap-3 rounded-full border border-soft-ivory/35 bg-soft-ivory/15 text-[15px] text-soft-ivory transition-colors hover:bg-soft-ivory/25 focus-visible:ring-2 focus-visible:ring-antique-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SocialIcon provider={provider} />
            {socialLoading === provider ? "Redirecting..." : label}
          </button>
        ))}
      </div>
    </form>
  );
}
