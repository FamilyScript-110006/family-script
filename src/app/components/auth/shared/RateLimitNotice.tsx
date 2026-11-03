import { formatCountdown } from "./useCountdown";

type Props = {
  /** Seconds left until the user can try again. */
  seconds: number;
  title?: string;
  message?: string;
};

/* Shown in place of the form error when the API answers 429. */
export default function RateLimitNotice({
  seconds,
  title = "Too many attempts",
  message = "For your security, please wait before trying again.",
}: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-1 rounded-3xl border border-antique-gold/50 bg-soft-ivory/10 px-5 py-4 text-center"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="mb-1 size-6 text-antique-gold">
        <path
          fill="currentColor"
          d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm-3 8V6a3 3 0 1 1 6 0v3H9Z"
        />
      </svg>
      <p className="futura-light text-[16px] text-warm-beige">{title}</p>
      <p className="futura-light text-[14px] leading-5 text-soft-ivory/85">{message}</p>
      <p className="futura-light mt-1 text-[22px] tabular-nums text-soft-ivory">
        {formatCountdown(seconds)}
      </p>
    </div>
  );
}
