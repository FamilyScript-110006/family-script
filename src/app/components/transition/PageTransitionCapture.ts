// components/transition/PageTransitionCapture.ts

"use client";

import { domToCanvas } from "modern-screenshot";
import { MAX_PIXEL_RATIO } from "./PageTransitionCanvas";

function getCapturePixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
}

/* ============================================================
   TYPES
============================================================ */

export interface TransitionFrame {
  canvas: HTMLCanvasElement;
  // Buffer pixel size (DPR-scaled, matching canvas.width/height) —
  // NOT CSS pixels. A caller that needs a CSS-pixel box (e.g. to size
  // an element's style.width/height) must derive it separately from
  // window.innerWidth/innerHeight, the same way the WebGL canvas's
  // own resizeCanvas() keeps its buffer size and CSS size distinct.
  width: number;
  height: number;
}

export interface TransitionFramePair {
  before: TransitionFrame;
  after: TransitionFrame;
}

/* ============================================================
   VIEWPORT SNAPSHOT

   Captures the document (via modern-screenshot, which serializes
   real DOM into an SVG foreignObject and lets the browser's own
   engine rasterize it — unlike html2canvas, this correctly handles
   Tailwind v4's oklch()/color-mix() output), then crops to exactly
   the visible viewport at the given scroll offset. This matches what
   the user actually saw on screen.

   Only elements near the viewport are actually rendered — excluding
   an element excludes its whole subtree (fonts, images, nested
   nodes), which is what keeps this fast on very tall pages (the
   homepage is ~8000px).

   The capture is ALSO bounded to an explicit width/height (viewport
   size, plus a small margin, from the top of the document down to
   the bottom of the current scroll position) instead of the full
   document height. modern-screenshot's `width`/`height` options only
   size the SVG viewBox/foreignObject box the clone is rendered into
   — the clone's own CSS layout is untouched, so this can't squish
   flex/grid content — anything below that box is simply never
   rasterized. Without this, every homepage capture still allocated
   and rasterized a canvas the full ~8000px document height even
   though only the visible viewport is ever read out of it, which
   under repeated navigations was measurably costing multi-second
   stalls (and, once one capture fell behind, a cascade of slower
   ones after it).
============================================================ */

const CAPTURE_MARGIN_PX = 200;

// modern-screenshot's first step ("wait until load") scans the ENTIRE
// document for every <img>/<video>, not just the elements our `filter`
// below will end up rendering — so a native lazy-loaded image far off
// screen (which the browser deliberately never fetches until it's
// scrolled near) sits there incomplete and un-erroring forever. Its own
// internal per-image timer is what `timeout` controls, so passing the
// full outer capture budget here means a single stuck image silently
// eats the *entire* budget doing nothing useful, leaving no time for
// the actual clone/serialize/rasterize work that follows. Bounding it
// to a short window instead (same principle the old deleted homepage
// ripple system used for its own IMAGE_LOAD_TIMEOUT) means a stuck
// image just renders as a blank gap instead of stalling the whole
// capture.
const IMAGE_LOAD_TIMEOUT_MS = 800;

/* ============================================================
   CROSS-CAPTURE IMAGE CACHE

   modern-screenshot re-fetches and re-base64-encodes every <img> and
   CSS background-image in the capture region from scratch on EVERY
   call — its own request cache is per-call and destroyed right after
   (see `destroyContext` in its source), so nothing carries over
   between navigations even though a page's images never change
   between them. This disproportionately costs the homepage, which
   has far more images than any other page on the site.

   `fetchFn` is a public hook the library checks before doing its own
   fetch for any image request (both <img> src and CSS url() route
   through it) — resolving it to a data URL short-circuits the
   library's own fetch+embed entirely. Caching by URL here, in module
   scope (not per-capture), means only the FIRST capture of a given
   image pays the fetch+encode cost for the lifetime of the tab.
============================================================ */

const imageDataUrlCache = new Map<string, Promise<string>>();

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function cachedFetchImageAsDataUrl(url: string): Promise<string | false> {
  let cached = imageDataUrlCache.get(url);
  if (!cached) {
    cached = fetch(url, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return response.blob();
      })
      .then(blobToDataUrl);
    // A failed fetch shouldn't be cached forever — evict so a later
    // capture (e.g. after a flaky network blip) can retry.
    cached.catch(() => imageDataUrlCache.delete(url));
    imageDataUrlCache.set(url, cached);
  }
  try {
    return await cached;
  } catch {
    // Let modern-screenshot fall back to its own default fetch/
    // placeholder-image behavior instead of failing the capture.
    return false;
  }
}

function isNearViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  // A zero-size rect (display:none, or an element with no box at all)
  // isn't "off-screen content" in the sense this filter cares about —
  // exclude it so it doesn't fail the range check below.
  if (rect.width === 0 && rect.height === 0) return true;
  return (
    rect.bottom >= -CAPTURE_MARGIN_PX &&
    rect.top <= window.innerHeight + CAPTURE_MARGIN_PX
  );
}

async function captureFullDocument(
  timeoutMs: number,
  scrollY: number,
): Promise<HTMLCanvasElement | null> {
  try {
    const captureWidth = window.innerWidth;
    const captureHeight = Math.min(
      document.documentElement.scrollHeight,
      scrollY + window.innerHeight + CAPTURE_MARGIN_PX,
    );

    const capture = domToCanvas(document.documentElement, {
      backgroundColor: null,
      timeout: IMAGE_LOAD_TIMEOUT_MS,
      width: captureWidth,
      height: captureHeight,
      scale: getCapturePixelRatio(),
      fetchFn: cachedFetchImageAsDataUrl,
      filter: (node) => {
        if (!(node instanceof Element)) return true;
        // Exclude our own overlay layers — capturing them would
        // recursively bake a stale frozen frame into the new
        // screenshot.
        if (node.hasAttribute("data-page-transition-overlay")) {
          return false;
        }
        return isNearViewport(node);
      },
    });

    const timeout = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutMs);
    });

    const result = await Promise.race([capture, timeout]);
    return result ?? null;
  } catch (error) {
    console.error("[page-transition] capture failed:", error);
    return null;
  }
}

function cropToViewport(
  full: HTMLCanvasElement,
  scrollY: number,
): TransitionFrame | null {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // The capture above was requested at an explicit width/height AND
  // scale (see captureFullDocument), so `full`'s pixel dimensions are
  // the CSS-pixel region we asked for multiplied by this same pixel
  // ratio — everything below has to work in that scaled pixel space
  // too, or the crop would silently downsample the capture straight
  // back to 1x and undo the point of capturing at higher DPI.
  const pixelRatio = getCapturePixelRatio();
  const scaledViewportWidth = Math.round(viewportWidth * pixelRatio);
  const scaledViewportHeight = Math.round(viewportHeight * pixelRatio);

  const sourceX = 0;
  const sourceY = Math.max(0, Math.round(scrollY * pixelRatio));
  const sourceWidth = Math.min(full.width, scaledViewportWidth);
  const sourceHeight = Math.min(full.height - sourceY, scaledViewportHeight);

  if (sourceWidth <= 0 || sourceHeight <= 0) return null;

  const cropped = document.createElement("canvas");
  cropped.width = scaledViewportWidth;
  cropped.height = scaledViewportHeight;

  const ctx = cropped.getContext("2d");
  if (!ctx) return null;

  // drawImage can throw synchronously (e.g. SecurityError if the
  // captured canvas got "tainted" by a cross-origin image without
  // CORS headers) — this must never propagate, or the caller's async
  // chain dies silently right after preventDefault() already fired,
  // leaving the click looking like it did nothing at all.
  try {
    ctx.drawImage(
      full,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      scaledViewportWidth,
      scaledViewportHeight,
    );
  } catch (error) {
    console.error("[page-transition] crop failed:", error);
    return null;
  }

  // width/height are the scaled buffer pixel size (matching the
  // WebGL canvas's own DPR-scaled drawing buffer) — not CSS pixels.
  // The one caller that needs a CSS pixel box (the freeze canvas)
  // derives it separately from window.innerWidth/innerHeight.
  return { canvas: cropped, width: scaledViewportWidth, height: scaledViewportHeight };
}

/**
 * Captures the current page as it visually appears in the viewport
 * right now. Resolves to `null` (never throws) on timeout or any
 * capture error — callers must treat `null` as "skip the effect,
 * never block navigation on this."
 */
export async function captureViewportSnapshot(
  timeoutMs: number,
  scrollY: number = window.scrollY,
): Promise<TransitionFrame | null> {
  try {
    const full = await captureFullDocument(timeoutMs, scrollY);
    if (!full) return null;
    return cropToViewport(full, scrollY);
  } catch (error) {
    console.error("[page-transition] captureViewportSnapshot failed:", error);
    return null;
  }
}

/* ============================================================
   GL TEXTURE HELPERS

   Ported verbatim from the deleted RippleTextures.ts — these are
   fully generic canvas-to-GPU-texture utilities with no coupling
   to how the source canvas was produced.
============================================================ */

export function createRippleTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error("Unable to create WebGL texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Transparent initial pixel — prevents an uninitialized texture from
  // becoming a black frame.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 0]),
  );

  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

export function uploadCanvasToTexture(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  texture: WebGLTexture,
) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

export function uploadFramePair(
  gl: WebGL2RenderingContext,
  pair: TransitionFramePair,
  beforeTexture: WebGLTexture,
  afterTexture: WebGLTexture,
) {
  uploadCanvasToTexture(gl, pair.before.canvas, beforeTexture);
  uploadCanvasToTexture(gl, pair.after.canvas, afterTexture);
}

export function disposeTexture(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture | null,
) {
  if (texture) {
    gl.deleteTexture(texture);
  }
}
