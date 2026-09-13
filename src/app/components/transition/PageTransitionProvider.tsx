// components/transition/PageTransitionProvider.tsx
//
// Drives the ripple transition between actual site routes. Mounted
// once in the root layout. Owns:
//
//   - a global capture-phase click listener that intercepts internal
//     <a> clicks (Next <Link> renders as <a>) without touching any of
//     the ~8 files that render links elsewhere in the app
//   - a plain 2D "freeze frame" canvas that holds a screenshot of the
//     outgoing page, shown the instant a navigation starts so the
//     route change happening underneath is never visible
//   - the WebGL ripple canvas (PageTransitionCanvas) that crossfades
//     from the frozen "before" frame to a screenshot of the new route
//
// See PageTransitionContext.tsx for how the new route's mount is
// detected (there's no router-events API in App Router).

"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import { PageTransitionContext } from "./PageTransitionContext";
import PageTransitionCanvas, {
  type PageTransitionCanvasHandle,
} from "./PageTransitionCanvas";
import { captureViewportSnapshot } from "./PageTransitionCapture";

/* ============================================================
   CONSTANTS
============================================================ */

// Measured against the tallest, most image-heavy page on the site
// (the homepage, ~8000px of scrollable content): a full-document
// capture takes 1.3-1.9s depending on conditions, vs. ~100-300ms on
// shorter pages. The DOM serialization work is largely synchronous —
// racing it against a timeout doesn't actually cancel it, it just
// stops waiting, so the browser can still be catching up from it
// afterward. These budgets give real margin above the observed worst
// case so the homepage's capture reliably finishes on its own instead
// of skirting the timeout boundary.
const BEFORE_CAPTURE_TIMEOUT = 3000;
const AFTER_CAPTURE_TIMEOUT = 3000;
const ROUTE_MOUNT_TIMEOUT = 3000;
const RIPPLE_DURATION = 1250;
const FADE_FALLBACK_DURATION = 200;

/* ============================================================
   TEXT REVEAL

   Softens the incoming page's text so it doesn't just snap into
   view once the ripple finishes — headings/paragraphs are hidden
   right before the "after" screenshot is captured (so the captured
   frame shown during the ripple crossfade matches what the real DOM
   looks like underneath it) and revealed with a staggered fade +
   slide-up right when the ripple hands off to the real page.

   The homepage choreographs its own entrance/scroll animations with
   GSAP across many sections spread over its ~8000px length — excluded
   here entirely rather than risk fighting over the same properties.

   Purpose, Philosophy, and Products also use GSAP (ScrollTrigger
   fromTo, `toggleActions: "play none none reverse"`) for their own
   sections, but only for content *below* the initial viewport —
   confirmed by testing that a ScrollTrigger whose "start" position is
   already satisfied when it's created (true for anything already in
   view, like a hero heading) doesn't actually animate from its "from"
   state at all; GSAP just leaves it at its natural rendered state.
   So above-the-fold content on those pages currently gets no visible
   entrance treatment either, and below-the-fold content is correctly
   already hidden (opacity 0) by GSAP's own "from" state, waiting for
   scroll. Filtering hidePageText to only elements currently within
   (or near) the viewport at hide-time means it only ever touches the
   untouched above-the-fold text — GSAP's below-the-fold sections are
   never selected, so there's nothing to conflict with.
============================================================ */

const TEXT_REVEAL_SELECTOR = "main :is(h1, h2, h3, h4, h5, h6, p)";
const TEXT_REVEAL_EXCLUDED_PATHS = new Set(["/"]);
const TEXT_REVEAL_VIEWPORT_MARGIN_PX = 200;
const TEXT_REVEAL_HIDDEN_TRANSFORM = "translate3d(0, 24px, 0)";
const TEXT_REVEAL_DURATION = 700;
const TEXT_REVEAL_STAGGER_MS = 60;
const TEXT_REVEAL_MAX_STAGGER_MS = 300;

function isNearViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.bottom > -TEXT_REVEAL_VIEWPORT_MARGIN_PX &&
    rect.top < window.innerHeight + TEXT_REVEAL_VIEWPORT_MARGIN_PX
  );
}

function hidePageText(
  pathname: string,
  hiddenElementsRef: React.MutableRefObject<HTMLElement[]>,
) {
  if (TEXT_REVEAL_EXCLUDED_PATHS.has(pathname)) return;

  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(TEXT_REVEAL_SELECTOR),
  ).filter(isNearViewport);

  elements.forEach((el) => {
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = TEXT_REVEAL_HIDDEN_TRANSFORM;
  });

  hiddenElementsRef.current = elements;
}

// Safe to call unconditionally from every exit path (including ones
// where nothing was ever hidden, or where the elements it hid have
// since been superseded/removed from the DOM) — it just no-ops.
function revealPageText(
  hiddenElementsRef: React.MutableRefObject<HTMLElement[]>,
) {
  const elements = hiddenElementsRef.current;
  if (elements.length === 0) return;
  hiddenElementsRef.current = [];

  elements.forEach((el, index) => {
    const delay = Math.min(
      index * TEXT_REVEAL_STAGGER_MS,
      TEXT_REVEAL_MAX_STAGGER_MS,
    );
    el.style.transition = [
      `opacity ${TEXT_REVEAL_DURATION}ms ease-out ${delay}ms`,
      `transform ${TEXT_REVEAL_DURATION}ms ease-out ${delay}ms`,
    ].join(", ");
  });

  requestAnimationFrame(() => {
    elements.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translate3d(0, 0, 0)";
    });
  });

  const cleanupDelay = TEXT_REVEAL_MAX_STAGGER_MS + TEXT_REVEAL_DURATION + 50;
  setTimeout(() => {
    elements.forEach((el) => {
      el.style.transition = "";
      el.style.opacity = "";
      el.style.transform = "";
    });
  }, cleanupDelay);
}

/* ============================================================
   COMPONENT
============================================================ */

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const canvasHandleRef = useRef<PageTransitionCanvasHandle | null>(null);
  const freezeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isWebglReadyRef = useRef(false);
  const isBusyRef = useRef(false);
  const pendingPathnameRef = useRef<string | null>(null);
  const pendingResolveRef = useRef<(() => void) | null>(null);

  // Bumped whenever a click supersedes an in-flight transition (see the
  // busy-click branch below). Every DOM-touching step in beginTransition
  // re-checks this after its await — if it no longer matches the id it
  // captured at the start, that step's own work has been superseded by a
  // newer click and it bails without painting/animating anything, so a
  // stale "before" frame can never flash over content the newer
  // navigation already put on screen.
  const transitionIdRef = useRef(0);

  // Text elements currently hidden by hidePageText(), pending
  // revealPageText() putting them back. See the TEXT REVEAL section
  // above.
  const hiddenTextElementsRef = useRef<HTMLElement[]>([]);

  /* ==========================================================
     ROUTE-MOUNT SIGNAL (called from root template.tsx)
  ========================================================== */

  const notifyRouteMounted = useCallback((pathname: string) => {
    if (
      pendingPathnameRef.current !== null &&
      pathname === pendingPathnameRef.current
    ) {
      pendingResolveRef.current?.();
      pendingResolveRef.current = null;
      pendingPathnameRef.current = null;
    }
  }, []);

  /* ==========================================================
     TRANSITION SEQUENCE
  ========================================================== */

  const beginTransition = useCallback(
    async (
      href: string,
      pathname: string,
      origin: { originX: number; originY: number },
    ) => {
      const myId = ++transitionIdRef.current;
      isBusyRef.current = true;
      const scrollYAtClick = window.scrollY;
      const freezeCanvas = freezeCanvasRef.current;
      let navigated = false;

      try {
        // A — capture the outgoing page exactly as the user sees it now.
        const before = await captureViewportSnapshot(
          BEFORE_CAPTURE_TIMEOUT,
          scrollYAtClick,
        );

        if (transitionIdRef.current !== myId) return;

        if (!before) {
          // Capture failed/timed out — never block navigation on a
          // screenshot. Just do a plain instant nav.
          router.push(href);
          navigated = true;
          return;
        }

        // B — freeze: paint the captured frame over a canvas that's
        // already sitting at opacity 0, then flip it to 1. Since the
        // frozen pixels are identical to what's already on screen,
        // this swap is imperceptible — the real DOM can now change
        // freely underneath it with zero visible flash.
        if (freezeCanvas) {
          // Buffer size = the captured frame's own pixel size (DPR-
          // scaled, matching the WebGL canvas's resolution — see
          // TransitionFrame's docs in PageTransitionCapture.ts). CSS
          // box size = the actual CSS viewport size, NOT before.width/
          // height directly — those are no longer the same number now
          // that captures happen at up to 2x resolution; using them
          // for the CSS box would draw the frame at double size.
          freezeCanvas.width = before.width;
          freezeCanvas.height = before.height;
          // Lock the CSS box to the viewport size explicitly, instead
          // of the default 100vw/100vh from its className. If the
          // viewport resizes during the transition (a vertical
          // scrollbar appearing/disappearing between pages of very
          // different heights is the common trigger on this site),
          // percentage sizing would make the browser stretch this
          // fixed-resolution bitmap to fit the new box — this pins it
          // to its actual captured dimensions so that can't happen.
          freezeCanvas.style.width = `${window.innerWidth}px`;
          freezeCanvas.style.height = `${window.innerHeight}px`;
          const ctx = freezeCanvas.getContext("2d");
          ctx?.drawImage(before.canvas, 0, 0);
          freezeCanvas.style.opacity = "1";
        }

        // Double rAF: confirm the frozen frame has actually been
        // painted before letting anything underneath change. Setting
        // a style property doesn't guarantee a paint has landed by
        // the next line of JS — without this, router.push below could
        // start swapping in the new route's DOM (a very different
        // height/layout than the outgoing page) before the frozen
        // overlay is genuinely on screen, letting a glimpse of the
        // real reflow through as a visible jump. Same guarantee
        // template.tsx uses for the route-mount signal, applied
        // symmetrically here for the other end of the transition.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });

        if (transitionIdRef.current !== myId) return;

        // C — navigate. The new route mounts hidden beneath the
        // frozen overlay.
        pendingPathnameRef.current = pathname;
        const routeMounted = new Promise<void>((resolve) => {
          pendingResolveRef.current = resolve;
        });

        router.push(href);
        navigated = true;

        const mounted = await Promise.race([
          routeMounted.then(() => true),
          new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(false), ROUTE_MOUNT_TIMEOUT);
          }),
        ]);

        if (transitionIdRef.current !== myId) return;

        if (!mounted) {
          // The new route never signalled ready (unexpected error,
          // redirect, etc). Navigation already happened — fade the
          // frozen overlay out instead of just dropping it: the real
          // page underneath is already showing, and without an
          // explicit opacity reset here the frozen "before" screenshot
          // stays pinned at opacity 1 forever, permanently hiding the
          // real page behind a stale frame.
          if (freezeCanvas) {
            freezeCanvas.style.transition = `opacity ${FADE_FALLBACK_DURATION}ms ease`;
            freezeCanvas.style.opacity = "0";
            setTimeout(() => {
              if (freezeCanvas) freezeCanvas.style.transition = "";
            }, FADE_FALLBACK_DURATION + 50);
          }
          return;
        }

        // Hide the incoming page's text before capturing it, so the
        // "after" screenshot shown during the ripple crossfade matches
        // what the real DOM looks like underneath — otherwise hiding
        // it only afterward would flash fully-visible text to hidden
        // right as the overlay disappears. See TEXT REVEAL above.
        hidePageText(pathname, hiddenTextElementsRef);

        // D — capture the new route (already fully rendered in the
        // DOM, just visually hidden beneath the frozen overlay —
        // DOM-based capture reads the tree, not the screen, so
        // occlusion doesn't matter here). New pages scroll-restore to
        // top by default.
        const after = await captureViewportSnapshot(AFTER_CAPTURE_TIMEOUT, 0);

        if (transitionIdRef.current !== myId) return;

        if (!after) {
          // Skip the shader animation — plain fade reveal instead of
          // a permanently stuck frozen frame.
          if (freezeCanvas) {
            freezeCanvas.style.transition = `opacity ${FADE_FALLBACK_DURATION}ms ease`;
            freezeCanvas.style.opacity = "0";
            setTimeout(() => {
              if (freezeCanvas) freezeCanvas.style.transition = "";
            }, FADE_FALLBACK_DURATION + 50);
          }
          revealPageText(hiddenTextElementsRef);
          return;
        }

        // E — run the ripple crossfade between the two real frames.
        await canvasHandleRef.current?.renderTransition(
          { before, after },
          {
            originX: origin.originX,
            originY: origin.originY,
            strength: 1.05,
            duration: RIPPLE_DURATION,
          },
        );

        if (transitionIdRef.current !== myId) return;

        // CRITICAL: this must run synchronously, in the very next
        // statement after renderTransition resolves, with no
        // intervening await/setState/CSS-transition. renderTransition's
        // own canvas is already transparent by the time this line
        // runs (set inside the same rAF callback that resolved the
        // promise), so removing the frozen overlay here — before the
        // browser's next paint — is what prevents a one-frame flash
        // back to the stale "before" pixels. Do not insert anything
        // async between these two lines.
        if (freezeCanvas) freezeCanvas.style.opacity = "0";
        revealPageText(hiddenTextElementsRef);
      } catch (error) {
        // A screenshot/WebGL failure must never leave the click
        // looking like it did nothing — if navigation hasn't happened
        // yet, fall back to a plain instant nav.
        console.error("[page-transition] transition failed:", error);
        if (!navigated) {
          router.push(href);
        }
        if (transitionIdRef.current === myId && freezeCanvas) {
          freezeCanvas.style.opacity = "0";
        }
        revealPageText(hiddenTextElementsRef);
      } finally {
        if (transitionIdRef.current === myId) {
          pendingPathnameRef.current = null;
          pendingResolveRef.current = null;
          isBusyRef.current = false;
        }
      }
    },
    [router],
  );

  /* ==========================================================
     GLOBAL CLICK INTERCEPTION
  ========================================================== */

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!isWebglReadyRef.current) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.hasAttribute("data-no-transition")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return; // asset/file links
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      if (isBusyRef.current) {
        // A previous transition is still finishing — captures on a
        // heavy page can take a few seconds, and without this a click
        // that lands during that window was silently dropped (looking
        // exactly like "sometimes clicking a button does nothing").
        // Supersede it instead: invalidate whatever step it's on (its
        // own transitionIdRef checks make every remaining step a
        // no-op), cancel the WebGL canvas if it's mid-animation, hide
        // the frozen overlay, and navigate immediately without the
        // effect so the click always does *something*.
        transitionIdRef.current++;
        isBusyRef.current = false;
        canvasHandleRef.current?.cancelTransition();
        if (freezeCanvasRef.current) {
          freezeCanvasRef.current.style.opacity = "0";
        }
        revealPageText(hiddenTextElementsRef);
        router.push(url.pathname + url.search);
        return;
      }

      // Fixed bottom-center origin, matching the deleted homepage
      // ripple system's own default (getRippleOrigin / playTransition
      // both used originX=0.5, originY=1) — NOT the click position.
      // Nav links sit near the top of the screen, so an origin derived
      // from click coordinates was pinned at the very edge, which is
      // what produced the lopsided "zoom" look.
      void beginTransition(url.pathname + url.search, url.pathname, {
        originX: 0.5,
        originY: 1,
      });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [beginTransition]);

  return (
    <PageTransitionContext.Provider value={{ notifyRouteMounted }}>
      <canvas
        ref={freezeCanvasRef}
        aria-hidden="true"
        data-page-transition-overlay=""
        className="pointer-events-none fixed inset-0 z-[9998] block h-screen w-screen opacity-0"
        style={{ background: "transparent", willChange: "opacity" }}
      />
      <PageTransitionCanvas
        ref={canvasHandleRef}
        onReady={() => {
          isWebglReadyRef.current = true;
        }}
        onError={() => {
          isWebglReadyRef.current = false;
        }}
      />
      {children}
    </PageTransitionContext.Provider>
  );
}
