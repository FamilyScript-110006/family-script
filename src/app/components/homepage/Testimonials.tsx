"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const KKS_QUOTE =
  "It was thanks to the patience and professionalism of the FS team that later helped me select special moments from our family occasions to craft a permanent pathway that we can travel through and renew the warp and weft of family bonds.";

const KKS_NAME = "Dr. Kshitij Kumar Sinha";

const KKS_PHOTO = "/assets/testimonials/KKS founder.jpg";

const TESTIMONIALS = Array.from({ length: 6 }, () => ({
  quote: KKS_QUOTE,
  name: KKS_NAME,
  photo: KKS_PHOTO,
}));

const LEFT_PRESET = {
  boxLeft: 309,
  photoLeft: 204,
  quoteLeft: 421,
  quoteAlign: "left" as const,
  nameLeft: 1024,
  nameAlign: "left" as const,
};

const RIGHT_PRESET = {
  boxLeft: 204,
  photoLeft: 1054,
  quoteLeft: 321,
  quoteAlign: "right" as const,
  nameLeft: 270,
  nameAlign: "left" as const,
};

/*
 * Derive the types directly from the objects above.
 *
 * This avoids having to manually create Testimonial/Preset interfaces
 * and guarantees that the types stay in sync with the actual data.
 */
type Testimonial = (typeof TESTIMONIALS)[number];

type Preset = typeof LEFT_PRESET | typeof RIGHT_PRESET;

type TestimonialBoxProps = {
  testimonial: Testimonial;
  preset: Preset;
  boxRef: (element: HTMLDivElement | null) => void;
  onMeasured: () => void;
};

const MIN_BOX_HEIGHT = 208;

const QUOTE_BASE_FONT_SIZE = 20;
const QUOTE_LINE_HEIGHT_RATIO = 1.5;
const QUOTE_MIN_FONT_SIZE = 15;
const MAX_BOX_HEIGHT_BEFORE_SHRINK = 260;

const TESTIMONIAL_GAP = 30;

const LIST_TOP = 298;
const LIST_BOTTOM_PADDING = 60;

function TestimonialBox({
  testimonial,
  preset,
  boxRef,
  onMeasured,
}: TestimonialBoxProps) {
  const quoteMeasureRef = useRef<HTMLParagraphElement | null>(null);
  const heightRef = useRef<number>(MIN_BOX_HEIGHT);
  const fontRef = useRef<number>(QUOTE_BASE_FONT_SIZE);

  const quoteWidth = 654;
  const quoteTop = 45;

  useEffect(() => {
    const measure = () => {
      const el = quoteMeasureRef.current;

      /*
       * boxRef is a callback ref, so we cannot access .current from it.
       * Instead, find the containing testimonial box from the measuring
       * paragraph.
       */
      const box = el?.parentElement;

      if (!el || !box) return;

      let fontSize = QUOTE_BASE_FONT_SIZE;
      let textHeight = 0;

      for (; fontSize >= QUOTE_MIN_FONT_SIZE; fontSize--) {
        el.style.fontSize = `${fontSize}px`;

        el.style.lineHeight = `${Math.round(
          fontSize * QUOTE_LINE_HEIGHT_RATIO,
        )}px`;

        textHeight = el.scrollHeight;

        const projectedHeight = quoteTop + textHeight + 20;

        if (projectedHeight <= MAX_BOX_HEIGHT_BEFORE_SHRINK) {
          break;
        }
      }

      const requiredHeight = Math.max(
        MIN_BOX_HEIGHT,
        quoteTop + textHeight + 20,
      );

      const lineHeight = Math.round(
        fontSize * QUOTE_LINE_HEIGHT_RATIO,
      );

      fontRef.current = fontSize;
      heightRef.current = requiredHeight;

      box.style.height = `${requiredHeight}px`;

      const quoteEl = box.querySelector<HTMLElement>(
        "[data-quote-text]",
      );

      const nameEl = box.querySelector<HTMLElement>(
        "[data-quote-name]",
      );

      const borderEl = box.querySelector<HTMLElement>(
        "[data-quote-border]",
      );

      if (quoteEl) {
        quoteEl.style.fontSize = `${fontSize}px`;
        quoteEl.style.lineHeight = `${lineHeight}px`;
      }

      if (nameEl) {
        nameEl.style.top = `${requiredHeight - 46}px`;
      }

      if (borderEl) {
        borderEl.style.height = `${requiredHeight}px`;
      }

      onMeasured();
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
  }, [testimonial.quote, onMeasured]);

  return (
    <div
      ref={boxRef}
      className="relative"
      style={{
        width: 1440,
        height: MIN_BOX_HEIGHT,
      }}
    >
      {/* Hidden measuring text */}

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

      {/* Border */}

      <div
        data-quote-border
        className="absolute rounded-[15px]"
        style={{
          width: 902,
          height: MIN_BOX_HEIGHT,
          top: 0,
          left: preset.boxLeft,
          border: "0.5px solid rgba(255,255,255,0.9)",
        }}
      />

      {/* Quote */}

      <p
        data-quote-text
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
          fontSize: QUOTE_BASE_FONT_SIZE,
          lineHeight: `${Math.round(
            QUOTE_BASE_FONT_SIZE * QUOTE_LINE_HEIGHT_RATIO,
          )}px`,
        }}
      >
        {testimonial.quote}
      </p>

      {/* Name */}

      <p
        data-quote-name
        className="absolute text-[12px] leading-[20px]"
        style={{
          fontFamily: "Futura, sans-serif",
          fontWeight: 400,
          width: 217,
          height: 20,
          top: MIN_BOX_HEIGHT - 46,
          left: preset.nameLeft,
          color: "#D2C6B2",
          textAlign: preset.nameAlign,
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const stRef = useRef<ScrollTrigger | null>(null);
  const trackHeightRef = useRef<number>(0);
  const viewportHeightRef = useRef<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const viewportEl = viewportRef.current;
    const trackEl = trackRef.current;

    if (!section || !viewportEl || !trackEl) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const getMaxScroll = () =>
        Math.max(
          0,
          trackHeightRef.current - viewportHeightRef.current,
        );

      stRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + Math.max(1, getMaxScroll()),
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          const maxScroll = getMaxScroll();

          gsap.set(trackEl, {
            y: -maxScroll * self.progress,
          });
        },
      });

      const measureViewport = () => {
        viewportHeightRef.current =
          viewportEl.getBoundingClientRect().height;
      };

      const measureTrack = () => {
        trackHeightRef.current = trackEl.scrollHeight;
      };

      measureViewport();
      measureTrack();

      ScrollTrigger.refresh();

      const viewportObserver = new ResizeObserver(() => {
        measureViewport();
        ScrollTrigger.refresh();
      });

      viewportObserver.observe(viewportEl);

      const trackObserver = new ResizeObserver(() => {
        measureTrack();
        ScrollTrigger.refresh();
      });

      trackObserver.observe(trackEl);

      requestAnimationFrame(() => {
        measureViewport();
        measureTrack();
        ScrollTrigger.refresh();
      });

      return () => {
        viewportObserver.disconnect();
        trackObserver.disconnect();
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#460A26]"
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          BACKGROUND — gradient only, no photo. Full width.
      ===================================================== */}

      <div
        className="absolute left-0 top-0 h-full w-full pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {/* Dark overlay group */}

        {[
          { height: 834, top: -13 },
          { height: 830.85, top: -9.85 },
          { height: 834, top: -13 },
          { height: 394.45, top: 426.55 },
          { height: 830.85, top: -9.85 },
        ].map((rect, i) => (
          <div
            key={`group41-${i}`}
            className="absolute left-0 w-full"
            style={{
              height: rect.height,
              top: rect.top,
              opacity: 0.26,
              background:
                "linear-gradient(356.76deg, rgba(0,0,0,1) 2.81%, rgba(102,102,102,0) 71.6%)",
            }}
          />
        ))}

        {/* Gradient layers */}

        {[
          { height: 813, top: 8 },
          { height: 813, top: 8 },
          { height: 813, top: 8 },
          { height: 384, top: 437 },
          { height: 384, top: 437 },
        ].map((rect, i) => (
          <div
            key={`gradient-${i}`}
            className="absolute left-0 w-full"
            style={{
              height: rect.height,
              top: rect.top,
              opacity: 0.26,
              background:
                "linear-gradient(356.76deg, rgba(0,0,0,0.5) 2.81%, rgba(102,102,102,0) 71.6%)",
            }}
          />
        ))}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="relative mx-auto h-full"
        style={{
          width: "100%",
          maxWidth: 1440,
          zIndex: 1,
        }}
      >
        {/* Heading */}

        <div
          ref={headingRef}
          className="absolute"
          style={{
            width: 624,
            height: 147,
            top: 75,
            left: 411,
          }}
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
          }}
        >
          This is a tribute to our friends at Family Script, who have been
          unwavering pillars of support throughout our journey, alongside many
          others who have also played pivotal roles in our endeavors.
        </p>

        {/* Testimonials window */}

        <div
          ref={viewportRef}
          className="absolute overflow-hidden"
          style={{
            top: LIST_TOP,
            left: 0,
            width: "100%",
            height: `calc(100% - ${LIST_TOP}px - ${LIST_BOTTOM_PADDING}px)`,
          }}
        >
          <div ref={trackRef} style={{ width: 1440 }}>
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                style={{
                  width: 1440,
                  marginBottom:
                    i === TESTIMONIALS.length - 1
                      ? 0
                      : TESTIMONIAL_GAP,
                }}
              >
                <TestimonialBox
                  testimonial={testimonial}
                  preset={
                    i % 2 === 0
                      ? LEFT_PRESET
                      : RIGHT_PRESET
                  }
                  boxRef={(el) => {
                    boxRefs.current[i] = el;
                  }}
                  onMeasured={() => {
                    if (trackRef.current) {
                      trackHeightRef.current =
                        trackRef.current.scrollHeight;

                      ScrollTrigger.refresh();
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

