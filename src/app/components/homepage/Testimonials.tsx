"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BACKDROP_PHOTO = "/assets/testimonials/testimonials-bg.png";

type Testimonial = {
  quote: string;
  name: string;
  photo: string;
};

// Figma spec content, verbatim — the only testimonial photo that
// actually exists on disk (public/assets/testimonials/KKS founder.jpg;
// the other five referenced photos are missing files, not a code bug).
const KKS_QUOTE =
  "It was thanks to the patience and professionalism of the FS team that later helped me select special moments from our family occasions to craft a permanent pathway that we can travel through and renew the warp and weft of family bonds.";
const KKS_NAME = "Dr. Kshitij Kumar Sinha";
const KKS_PHOTO = "/assets/testimonials/KKS founder.jpg";

const TESTIMONIALS: Testimonial[] = Array.from({ length: 6 }, () => ({
  quote: KKS_QUOTE,
  name: KKS_NAME,
  photo: KKS_PHOTO,
}));

type SidePreset = {
  boxLeft: number;
  photoLeft: number;
  quoteLeft: number;
  quoteAlign: "left" | "right";
  nameLeft: number;
  nameAlign: "left" | "right";
};

const LEFT_PRESET: SidePreset = {
  boxLeft: 309,
  photoLeft: 204,
  quoteLeft: 421,
  quoteAlign: "left",
  nameLeft: 1024,
  nameAlign: "left",
};

const RIGHT_PRESET: SidePreset = {
  boxLeft: 204,
  photoLeft: 1054,
  quoteLeft: 321,
  quoteAlign: "right",
  nameLeft: 270,
  nameAlign: "left",
};

const MIN_BOX_HEIGHT = 208;

// Quote font sizing — the Figma spec (20px/30px line-height) was mocked
// up against short placeholder text; real testimonial quotes run much
// longer, so rendering all of them at a fixed 20px would make some boxes
// grow very tall. Instead, quotes that would otherwise push the box past
// MAX_BOX_HEIGHT_BEFORE_SHRINK shrink their font size (proportional
// line-height, same 1.5x ratio as the spec) down to QUOTE_MIN_FONT_SIZE
// before the box is allowed to grow further — keeps most boxes close to
// the compact spec size without making any quote illegibly small.
const QUOTE_BASE_FONT_SIZE = 20;
const QUOTE_LINE_HEIGHT_RATIO = 1.5; // 30 / 20, per spec
const QUOTE_MIN_FONT_SIZE = 15;
const MAX_BOX_HEIGHT_BEFORE_SHRINK = 260;

// Gap between every testimonial in the normal-flow list. Confirmed
// against the exact Figma spec (upper/lower box positions) by working
// backward from the given absolute coordinates — 30px, not the 60px
// this was previously set to.
const TESTIMONIAL_GAP = 30;

// Testimonial list starts here, matching the original Figma-measured
// position (298px below the canvas top) — everything below is normal
// document flow, so it grows naturally to fit however tall the real
// content is instead of being clipped to one fixed viewport.
const LIST_TOP = 298;

function TestimonialBox({
  testimonial,
  preset,
}: {
  testimonial: Testimonial;
  preset: SidePreset;
}) {
  const quoteMeasureRef = useRef<HTMLParagraphElement>(null);
  const [boxHeight, setBoxHeight] = useState(MIN_BOX_HEIGHT);
  const [quoteFontSize, setQuoteFontSize] = useState(QUOTE_BASE_FONT_SIZE);

  const quoteWidth = 654;
  const quoteTop = 45;
  const quoteLineHeight = Math.round(quoteFontSize * QUOTE_LINE_HEIGHT_RATIO);
  const nameWidth = 217;
  // Name (20px tall) is anchored to the box's bottom edge, not a fixed
  // offset from the top — at MIN_BOX_HEIGHT (208) this resolves to
  // top:162 (matching the Figma spec's absolute top:460, i.e.
  // LIST_TOP + 162), but for quotes that push boxHeight taller, it
  // correctly follows the bottom instead of staying pinned where the
  // quote text has since grown past it.
  const NAME_BLOCK_BOTTOM_OFFSET = 46;
  const nameTop = boxHeight - NAME_BLOCK_BOTTOM_OFFSET;

  useEffect(() => {
    const measure = () => {
      const el = quoteMeasureRef.current;
      if (!el) return;

      // Try the full spec size first, then step down until the
      // resulting box would fit under the cap or we hit the floor —
      // whichever comes first. Each step forces a synchronous reflow
      // of the (hidden) measuring paragraph, but this is a handful of
      // iterations at most and only runs on mount/resize/quote change.
      let fontSize = QUOTE_BASE_FONT_SIZE;
      let textHeight = 0;
      for (; fontSize >= QUOTE_MIN_FONT_SIZE; fontSize--) {
        el.style.fontSize = `${fontSize}px`;
        el.style.lineHeight = `${Math.round(fontSize * QUOTE_LINE_HEIGHT_RATIO)}px`;
        textHeight = el.scrollHeight;
        const projectedHeight = quoteTop + textHeight + 20;
        if (projectedHeight <= MAX_BOX_HEIGHT_BEFORE_SHRINK) break;
      }

      const requiredHeight = Math.max(MIN_BOX_HEIGHT, quoteTop + textHeight + 20);

      setQuoteFontSize(fontSize);
      setBoxHeight(requiredHeight);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (quoteMeasureRef.current) {
      resizeObserver.observe(quoteMeasureRef.current);
    }

    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [testimonial.quote]);

  return (
    <div className="relative" style={{ width: 1440, height: boxHeight }}>
      {/* Hidden measuring text — font-size/line-height are set
          directly by the measure() effect above (it tries several
          sizes while probing scrollHeight), so no size classes here. */}
      <p
        ref={quoteMeasureRef}
        aria-hidden="true"
        className="pointer-events-none absolute whitespace-pre-line tracking-[0.05em]"
        style={{
          fontFamily: "Futura, sans-serif",
          fontWeight: 400,
          width: quoteWidth,
          height: "auto",
          top: quoteTop,
          left: preset.quoteLeft,
          visibility: "hidden",
        }}
      >
        {testimonial.quote}
      </p>

      {/* Rectangle */}
      <div
        className="absolute rounded-[15px]"
        style={{
          width: 902,
          height: boxHeight,
          top: 0,
          left: preset.boxLeft,
          border: "0.5px solid #FFFFFF",
          transition: "height 0.25s ease",
        }}
      />

      {/* Quote */}
      <p
        className="absolute whitespace-pre-line tracking-[0.05em]"
        style={{
          fontFamily: "Futura, sans-serif",
          fontWeight: 400,
          width: quoteWidth,
          height: "auto",
          top: quoteTop,
          left: preset.quoteLeft,
          color: "#FFF5E5",
          textAlign: preset.quoteAlign,
          opacity: 1,
          fontSize: quoteFontSize,
          lineHeight: `${quoteLineHeight}px`,
          transition: "font-size 0.25s ease, line-height 0.25s ease",
        }}
      >
        {testimonial.quote}
      </p>

      {/* Name */}
      <p
        className="absolute text-[12px] leading-[20px] tracking-normal"
        style={{
          fontFamily: "Futura, sans-serif",
          fontWeight: 400,
          width: nameWidth,
          height: 20,
          top: nameTop,
          left: preset.nameLeft,
          color: "#D2C6B2",
          textAlign: preset.nameAlign,
          opacity: 1,
          transition: "top 0.25s ease",
        }}
      >
        {testimonial.name}
      </p>

      {/* Photo */}
      <div
        className="absolute rounded-[15px]"
        style={{
          width: 158,
          height: 183,
          top: 12,
          left: preset.photoLeft,
          backgroundImage: `url("${testimonial.photo}")`,
          backgroundSize: "250px 333px",
          backgroundPosition: "-46px -37px",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}

export default function Testimonials() {
  const headingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Scrollable region holding just the testimonial list — heading and
  // description sit outside it (in the section's own normal flow), so
  // scrolling within this box never moves them.
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      [headingRef.current, descriptionRef.current].forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      boxRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              // These boxes scroll inside scrollContainerRef, not the
              // page — without pointing ScrollTrigger at that element,
              // it would track window scroll instead and never fire
              // correctly (or fire immediately, since scrolling the
              // page itself no longer moves these boxes into view).
              scroller: scrollContainerRef.current ?? undefined,
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#460A26]">
      {/* =====================================================
          FIXED-HEIGHT BACKDROP BAND

          Stays exactly 823px tall behind the heading/description,
          matching the original Figma artwork. The testimonial list
          below flows naturally past this band as needed — it is no
          longer clipped to a single viewport.
          ===================================================== */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ width: "100%", height: 823, zIndex: 0 }}
      >
        <img
          src={BACKDROP_PHOTO}
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{
            width: "100%",
            height: 823,
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />

        {/* Group 41 */}
        {[
          { width: 1455.93, height: 834, top: -13, left: 2.02 },
          { width: 1456.94, height: 830.85, top: -9.85, left: 1.01 },
          { width: 1455.93, height: 834, top: -13, left: 2.02 },
          { width: 1459.97, height: 394.45, top: 426.55, left: 2.02 },
          { width: 1457.95, height: 830.85, top: -9.85, left: 2.02 },
        ].map((rect, i) => (
          <div
            key={`group41-${i}`}
            className="absolute"
            style={{
              ...rect,
              opacity: 0.26,
              background:
                "linear-gradient(356.76deg, rgba(0, 0, 0, 1) 2.81%, rgba(102, 102, 102, 0) 71.6%)",
            }}
          />
        ))}

        {/* Gradient layers */}
        {[
          { width: 1436, height: 813, top: 8, left: 1 },
          { width: 1436, height: 813, top: 8, left: 1 },
          { width: 1436, height: 813, top: 8, left: 1 },
          { width: 1436, height: 384, top: 437, left: 1 },
          { width: 1436, height: 384, top: 437, left: 1 },
        ].map((rect, i) => (
          <div
            key={`gradient-${i}`}
            className="absolute"
            style={{
              ...rect,
              opacity: 0.26,
              background:
                "linear-gradient(356.76deg, rgba(0, 0, 0, 0.5) 2.81%, rgba(102, 102, 102, 0) 71.6%)",
            }}
          />
        ))}
      </div>

      {/* =====================================================
          CONTENT CANVAS

          Retains the original 1440px coordinate system for the
          heading/description. Fills the section's full height (fixed
          at one viewport) rather than growing with content — the
          testimonial list below is its own internally-scrollable
          region instead of extending the page.
          ===================================================== */}
      <div
        className="relative mx-auto h-full"
        style={{ width: 1440, zIndex: 1 }}
      >
        {/* Heading */}
        <div
          ref={headingRef}
          className="absolute"
          style={{ width: 624, height: 147, top: 75, left: 411, opacity: 1 }}
        >
          <h2
            className="futura-medium w-full text-[50px] leading-[75px] tracking-[0.05em] text-white"
            style={{ textAlign: "center" }}
          >
            TESTIMONIALS
          </h2>
        </div>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="futura-light absolute text-center text-[15px] leading-[20px] tracking-[0.05em] text-white"
          style={{
            width: 737.5399169921875,
            height: 60.22304916381836,
            top: 162,
            left: 351,
            opacity: 1,
          }}
        >
          This is a tribute to our friends at Family Script, who have been
          unwavering pillars of support throughout our journey, alongside many
          others who have also played pivotal roles in our endeavors.
        </p>

        {/* Testimonial list — heading/description above stay put;
            this is its own internally-scrollable region (native
            overflow scroll, no wheel-hijacking) so the user scrolls
            through testimonials without the heading moving. Boxes
            alternate photo-left/photo-right styling by index. */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar absolute overflow-y-auto"
          style={{ top: LIST_TOP, left: 0, right: 0, bottom: 0 }}
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={i}
              ref={(el) => {
                boxRefs.current[i] = el;
              }}
              style={{ marginBottom: i === TESTIMONIALS.length - 1 ? 0 : TESTIMONIAL_GAP }}
            >
              <TestimonialBox
                testimonial={testimonial}
                preset={i % 2 === 0 ? LEFT_PRESET : RIGHT_PRESET}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
