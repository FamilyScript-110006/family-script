"use client";

import { useEffect, useRef } from "react";

import Stage from "./Stage";

/* ============================================================
   PHOTO ARC  (the "ferris wheel")

   18 photo tiles sit on one big circle, 20 degrees apart. Only the
   top of the circle is visible. Every step the whole wheel turns
   20 degrees counter-clockwise: it rests for 0.8s, then moves for
   0.3s (ease-out). That is the exact timing of the Figma prototype.
============================================================ */

const TILE_SIZE = 131;
const RADIUS = 614.4;
const STEP_DEG = 20;

const FIRST_STEP_DELAY_MS = 200;
const REST_MS = 800;
const MOVE_MS = 300;

/*
 * angle = clockwise degrees from the top of the circle.
 * flip  = Figma mirrors these tiles, so we do too.
 * Files live in /public/auth/wheel (see scripts/download-auth-assets.ps1).
 */
const TILES = [
  { angle: 0, flip: false },
  { angle: 20, flip: false },
  { angle: 40, flip: false },
  { angle: 60, flip: false },
  { angle: 80, flip: false },
  { angle: 100, flip: false },
  { angle: 120, flip: true },
  { angle: 140, flip: true },
  { angle: 160, flip: true },
  { angle: 180, flip: false },
  { angle: 200, flip: false },
  { angle: 220, flip: false },
  { angle: 240, flip: false },
  { angle: 260, flip: true },
  { angle: 280, flip: true },
  { angle: 300, flip: true },
  { angle: 320, flip: true },
  { angle: 340, flip: true },
].map((tile, index) => ({
  ...tile,
  src: `/auth/wheel/tile-${String(index).padStart(2, "0")}.png`,
}));

/*
 * One full turn as Web Animations keyframes: for each of the 18 steps
 * the wheel rests (REST_MS) and then turns STEP_DEG (MOVE_MS, ease-out).
 * Transform animations run on the compositor thread, so they stay smooth
 * even if the main thread is busy.
 */
const STEPS = 360 / STEP_DEG;
const CYCLE_MS = REST_MS + MOVE_MS;
const TOTAL_MS = STEPS * CYCLE_MS;

const KEYFRAMES: Keyframe[] = [
  ...Array.from({ length: STEPS }, (_, i) => [
    {
      offset: (i * CYCLE_MS) / TOTAL_MS,
      transform: `rotate(${-STEP_DEG * i}deg)`,
      easing: "linear",
    },
    {
      offset: (i * CYCLE_MS + REST_MS) / TOTAL_MS,
      transform: `rotate(${-STEP_DEG * i}deg)`,
      easing: "ease-out",
    },
  ]).flat(),
  { offset: 1, transform: `rotate(${-360}deg)` },
];

export default function PhotoArc() {
  const wheelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wheel = wheelRef.current;

    if (!wheel) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const animation = wheel.animate(KEYFRAMES, {
      duration: TOTAL_MS,
      iterations: Infinity,
    });

    /* Figma waits only 0.2s before the first turn (later turns wait 0.8s). */
    animation.currentTime = REST_MS - FIRST_STEP_DELAY_MS;

    return () => animation.cancel();
  }, []);

  return (
    <div className="absolute inset-0 z-10">
      <Stage>
        {/* Wheel box: 1372 x 1360, centred horizontally, 35 from the top. */}
        <div
          ref={wheelRef}
          className="absolute"
          style={{
            left: "50%",
            marginLeft: -1372.064 / 2,
            top: 35,
            width: 1372.064,
            height: 1359.887,
            willChange: "transform",
          }}
        >
          {TILES.map((tile) => (
            <div
              key={tile.src}
              className="absolute rounded-[25px] border border-solid border-[rgba(255,255,255,0.7)] shadow-[-3px_7px_8.3px_2px_rgba(55,10,30,0.5)]"
              style={{
                left: "50%",
                top: "50%",
                width: TILE_SIZE,
                height: TILE_SIZE,
                margin: `${-TILE_SIZE / 2}px 0 0 ${-TILE_SIZE / 2}px`,
                transform: `rotate(${tile.angle}deg) translateY(-${RADIUS}px)${
                  tile.flip ? " scaleX(-1)" : ""
                }`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.src}
                alt=""
                draggable={false}
                className="absolute inset-0 size-full rounded-[25px] object-cover"
              />
              <div className="absolute inset-[-1px] rounded-[inherit] shadow-[inset_9px_7px_4.7px_0px_rgba(233,231,218,0.41)]" />
            </div>
          ))}
        </div>
      </Stage>
    </div>
  );
}
