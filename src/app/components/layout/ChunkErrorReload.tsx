// components/layout/ChunkErrorReload.tsx
"use client";

import { useEffect } from "react";

/**
 * Safety net.
 *
 * Next.js's client router fetches each route's JS chunk by a
 * content-hashed filename. If the server's build has moved on since
 * the current tab's HTML was loaded — a fresh deploy, or (in dev) a
 * server restart/cache clear — that filename no longer exists, and
 * the chunk `import()` rejects with a ChunkLoadError. Nothing catches
 * that by default, so it takes down the whole React tree, including
 * this transition system, leaving every link dead until the user
 * manually refreshes.
 *
 * A plain reload fetches the current HTML (correct chunk hashes) and
 * self-heals, so that's the whole fix here.
 */
export default function ChunkErrorReload() {
  useEffect(() => {
    const RELOAD_FLAG = "chunk-error-reload";

    function isChunkLoadError(reason: unknown): boolean {
      if (!reason) return false;
      const name = (reason as { name?: string }).name;
      const message = (reason as { message?: string }).message ?? String(reason);
      return name === "ChunkLoadError" || /loading chunk .* failed/i.test(message);
    }

    function handleRejection(event: PromiseRejectionEvent) {
      if (!isChunkLoadError(event.reason)) return;
      // Guard against a reload loop if something keeps serving stale
      // chunks — only auto-reload once per tab lifetime.
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
    }

    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  return null;
}
