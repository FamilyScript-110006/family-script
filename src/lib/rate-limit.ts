import { NextResponse } from "next/server";

/* ============================================================
   RATE LIMIT  (in-memory)

   Fixed-window counters kept in a Map. This is a stand-in until
   Redis is available:
   - counters are per server instance and reset on restart, so it is
     NOT reliable across multiple instances / serverless invocations;
   - the API below is small on purpose, so swapping the Map for Redis
     (INCR + EXPIRE + TTL) later only touches this file.
============================================================ */

type Entry = { count: number; resetAt: number };

export type RateLimitResult = {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const globalStore = globalThis as unknown as {
  __rateLimitStore?: Map<string, Entry>;
};
// Kept on globalThis so Next.js dev hot reloads don't wipe the counters.
const store = (globalStore.__rateLimitStore ??= new Map<string, Entry>());

function live(key: string): Entry | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.resetAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return entry;
}

function result(entry: Entry | null, limit: number): RateLimitResult {
  const count = entry?.count ?? 0;
  return {
    limited: count >= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: entry
      ? Math.max(1, Math.ceil((entry.resetAt - Date.now()) / 1000))
      : 0,
  };
}

/** Read the counter without changing it. */
export function peekRateLimit(key: string, limit: number): RateLimitResult {
  return result(live(key), limit);
}

/** Count one event. The window starts at the first event. */
export function hitRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): RateLimitResult {
  let entry = live(key);

  if (!entry) {
    entry = { count: 0, resetAt: Date.now() + windowSeconds * 1000 };
    store.set(key, entry);
  }

  entry.count += 1;

  // Opportunistic cleanup so the Map can't grow forever.
  if (store.size > 5000) {
    for (const [k, e] of store) if (e.resetAt <= Date.now()) store.delete(k);
  }

  return result(entry, limit);
}

export function resetRateLimit(key: string) {
  store.delete(key);
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** 429 with both the standard header and a field the UI can read. */
export function rateLimitedResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      success: false,
      code: "RATE_LIMITED",
      message: "Too many attempts. Please try again later.",
      retryAfterSeconds,
    },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

/* Limits used by the auth routes. */
export const LOGIN_FAILURE_LIMIT = { limit: 20, windowSeconds: 60 * 60 };
export const RESEND_LIMIT = { limit: 3, windowSeconds: 60 };
export const FORGOT_PASSWORD_LIMIT = { limit: 3, windowSeconds: 60 };
