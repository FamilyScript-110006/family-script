"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* ============================================================
   STAGE

   The Figma frame is 1512px wide. Stage lays its children out in
   that coordinate space and scales the whole thing so it fills the
   page edge to edge:

   - the scale follows the viewport WIDTH, so the design always spans
     the full width (no empty bars on the sides);
   - the stage is as tall as the viewport, so there are no bars at the
     top / bottom either. Pin things to the top with `top-[..]` and to
     the bottom with `bottom-[..]`; centre them with `left-1/2`.
   - on short, wide windows the scale is lowered so that
     MIN_DESIGN_HEIGHT units still fit vertically and nothing overlaps.
============================================================ */

export const DESIGN_WIDTH = 1512;
export const MIN_DESIGN_HEIGHT = 820;

type StageSize = { scale: number; width: number; height: number };

export default function Stage({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<StageSize | null>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) return;

    const update = () => {
      const { width: vw, height: vh } = host.getBoundingClientRect();

      if (!vw || !vh) return;

      const scale = Math.min(vw / DESIGN_WIDTH, vh / MIN_DESIGN_HEIGHT);

      setSize({ scale, width: vw / scale, height: vh / scale });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: size?.width ?? DESIGN_WIDTH,
          height: size?.height ?? MIN_DESIGN_HEIGHT,
          transform: `scale(${size?.scale ?? 1})`,
          /* Hidden until the first measurement so it never flashes at 1x. */
          opacity: size === null ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
