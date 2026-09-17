  // components/purpose/ScrapbookImage.tsx
  //
  // Whole-page 3D tilt for a single flattened image. Cursor position is
  // tracked at the window level (not just over the element), so the
  // scrapbook responds to the mouse anywhere on the page. Current tilt is
  // eased toward the cursor-driven target every animation frame for a
  // smooth, natural follow rather than a snap. No hover scale/lift — the
  // image stays at its normal size and position at all times.
  //
  // When individual scrapbook layers are available later, this can be
  // swapped for per-layer floating/parallax without touching the parent
  // Hero.tsx.

  "use client";

  import { useEffect, useRef } from "react";

  const MAX_TILT_DEG = 11; // clearly visible but still elegant (5-7deg range)
  const EASE = 0.08; // lerp factor: how quickly current tilt catches up to target

  interface ScrapbookImageProps {
    src: string;
    alt: string;
    className?: string;
  }

  export default function ScrapbookImage({
    src,
    alt,
    className = "",
  }: ScrapbookImageProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Where the tilt is heading (set instantly from cursor position) vs.
    // where it currently is (eased toward the target every frame).
    const target = useRef({ rotateX: 0, rotateY: 0 });
    const current = useRef({ rotateX: 0, rotateY: 0 });
    const rafId = useRef<number | null>(null);

    useEffect(() => {
      function handleWindowMouseMove(e: MouseEvent) {
        // Cursor position relative to the whole viewport, normalized to
        // [-0.5, 0.5] on each axis — not relative to the image itself.
        const offsetX = e.clientX / window.innerWidth - 0.5;
        const offsetY = e.clientY / window.innerHeight - 0.5;

        // Left half of the page -> tilt left, right half -> tilt right.
        // Top half -> tilt up, bottom half -> tilt down.
        target.current.rotateY = offsetX * MAX_TILT_DEG * 2;
        target.current.rotateX = -offsetY * MAX_TILT_DEG * 2;
      }

      function handleWindowMouseLeave() {
        // Cursor left the page/window entirely - ease back to neutral.
        target.current.rotateX = 0;
        target.current.rotateY = 0;
      }

      window.addEventListener("mousemove", handleWindowMouseMove);
      document.addEventListener("mouseleave", handleWindowMouseLeave);

      function tick() {
        current.current.rotateX +=
          (target.current.rotateX - current.current.rotateX) * EASE;
        current.current.rotateY +=
          (target.current.rotateY - current.current.rotateY) * EASE;

        const el = wrapperRef.current;
        if (el) {
          el.style.transform = `perspective(1000px) rotateX(${current.current.rotateX.toFixed(
            2
          )}deg) rotateY(${current.current.rotateY.toFixed(2)}deg) scale(1)`;
        }

        rafId.current = requestAnimationFrame(tick);
      }

      rafId.current = requestAnimationFrame(tick);

      return () => {
        window.removeEventListener("mousemove", handleWindowMouseMove);
        document.removeEventListener("mouseleave", handleWindowMouseLeave);
        if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      };
    }, []);

    return (
      <div
        ref={wrapperRef}
        className={`will-change-transform ${className}`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={src}
          alt={alt}
          className="pointer-events-none h-full w-full object-contain drop-shadow-2xl"
          draggable={false}
        />
      </div>
    );
  }
