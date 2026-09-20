"use client";

import CTAButton from "../layout/CTAButton";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   TYPES
============================================================ */

interface StatProps {
  target: number;
  suffix: string;
  label: string;
  started: boolean;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function WhoAreWe() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const backgroundRef = useRef<HTMLDivElement | null>(null);

  const gradientRef = useRef<HTMLDivElement | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const statsRef = useRef<HTMLDivElement | null>(null);

  const ctaRef = useRef<HTMLDivElement | null>(null);

  const [countStarted, setCountStarted] = useState(false);

  /* ==========================================================
     SECTION ANIMATION
  ========================================================== */

  useEffect(() => {
    const section = sectionRef.current;

    const background = backgroundRef.current;

    const gradient = gradientRef.current;

    const content = contentRef.current;

    const heading = headingRef.current;

    const description = descriptionRef.current;

    const stats = statsRef.current;

    const cta = ctaRef.current;

    if (
      !section ||
      !background ||
      !gradient ||
      !content ||
      !heading ||
      !description ||
      !stats ||
      !cta
    ) {
      return;
    }

    const context = gsap.context(() => {
      /* ==================================================
         BACKGROUND
      ================================================== */

      gsap.set(background, {
        x: 0,
        y: 0,
        scale: 1,
      });

      gsap.set(gradient, {
        x: 0,
        y: 0,
        scale: 1,
      });

      /* ==================================================
         INITIAL CONTENT STATE
      ================================================== */

      gsap.set([heading, description, stats, cta], {
        opacity: 0,
        y: 35,
      });

      gsap.set(cta, {
        scale: 0.96,
      });

      /* ==================================================
         ENTRANCE TIMELINE
      ================================================== */

      const entrance = gsap.timeline({
        paused: true,
      });

      /* --------------------------------------------------
         HEADING
      -------------------------------------------------- */

      entrance.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      /* --------------------------------------------------
         DESCRIPTION
      -------------------------------------------------- */

      entrance.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.55",
      );

      /* --------------------------------------------------
         STATS
      -------------------------------------------------- */

      entrance.to(
        stats,
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",

          onStart: () => {
            setCountStarted(true);
          },
        },
        "-=0.5",
      );

      /* --------------------------------------------------
         CTA
      -------------------------------------------------- */

      entrance.to(
        cta,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.4",
      );

      /* ==================================================
         SECTION ENTER
      ================================================== */

      ScrollTrigger.create({
        trigger: section,

        start: "top 80%",

        onEnter: () => {
          entrance.restart();
        },

        onEnterBack: () => {
          entrance.restart();
        },
      });

      /* ==================================================
         REFRESH
      ================================================== */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      ref={sectionRef}
      className="
        relative
        h-full
        min-h-full
        w-full
      "
    >
      {/* ======================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <div
        ref={backgroundRef}
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: "url('/assets/Homepage/WHO_WE_ARE.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* ======================================================
          MAROON / BURGUNDY COLOURISATION
      ====================================================== */}

      <div
        ref={gradientRef}
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
        "
        style={{
          background:
            "linear-gradient(to bottom, rgba(83, 36, 57, 0.90) 0%, rgba(83, 36, 57, 0.80) 30%, rgba(83, 36, 57, 0.20) 65%, rgba(83, 36, 57, 0.10) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ======================================================
          VERY LIGHT DARK OVERLAY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          bg-black/10
        "
        aria-hidden="true"
      />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        ref={contentRef}
        className="
          relative
          z-10
          flex
          h-full
          min-h-full
          w-full
          flex-col
          items-center
          text-center
          text-white
        "
      >
        {/* ====================================================
            CONTENT CONTAINER
        ==================================================== */}

        <div
          className="
            flex
            h-full
            w-full
            flex-1
            flex-col
            items-center
            px-5
            pb-12
            pt-[15vh]
            sm:px-6
            sm:pt-[18vh]
            md:pt-[22vh]
          "
        >
          {/* ==================================================
              HEADING
          ================================================== */}

          <h2
            ref={headingRef}
            className="
              futura-medium
              mt=6
              uppercase
              text-[2rem]
              leading-none
              tracking-[0.06em]
              sm:text-[2.3rem]
              sm:tracking-[0.07em]
              md:text-[2.65rem]
              md:tracking-[0.08em]
            "
          >
            Who Are We?
          </h2>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div
            ref={descriptionRef}
            className="
              futura-light
              mt-10
              w-full
              max-w-[750px]
              sm:mt-12
              md:mt-14
            "
          >
            <p
              className="
                text-[16px]
                leading-[1.55]
                sm:text-[17px]
                md:text-[20px]
                md:leading-[1.5]
              "
            >
              <span className="futura-medium">Family Script (FS)</span> is a
              venture of designers, historians, architects and educationists
              who{" "}
              <span className="futura-medium">
                celebrate non-hegemonic histories of individuals and
                collectives.
              </span>
            </p>

            <p
              className="
                mt-6
                text-[16px]
                leading-[1.55]
                sm:mt-7
                sm:text-[17px]
                md:text-[20px]
                md:leading-[1.5]
              "
            >
              The untold stories of leaders, artists and changemakers are the
              essence of our work.
            </p>
          </div>

          {/* ==================================================
              STATS
          ================================================== */}

          <div
            ref={statsRef}
            className="
              mt-12
              flex
              w-full
              max-w-[520px]
              items-center
              justify-center
              text-white
              sm:mt-14
              md:mt-16
            "
          >
            <Stat
              target={8}
              suffix="+"
              label="Years of Experience"
              started={countStarted}
            />

            <div
              className="
                h-12
                w-px
                shrink-0
                bg-white/50
                sm:h-14
              "
              aria-hidden="true"
            />

            <Stat
              target={25}
              suffix="+"
              label="Projects Completed"
              started={countStarted}
            />

            <div
              className="
                h-12
                w-px
                shrink-0
                bg-white/50
                sm:h-14
              "
              aria-hidden="true"
            />

            <Stat
              target={5}
              suffix="+"
              label="Regions covered"
              started={countStarted}
            />
          </div>

          {/* ====================================================
              GLOBAL CTA
          ==================================================== */}

          <div
            ref={ctaRef}
            className="
              absolute
              left-1/2
              top-[91%]
              z-30
              -translate-x-1/2
              sm:top-[91%]
              md:top-[91%]
            "
          >
            <CTAButton />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STAT
============================================================ */

function Stat({ target, suffix, label, started }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;

    let animationFrame = 0;

    const duration = 1200;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [started, target]);

  return (
    <div
      className="
        min-w-0
        px-3
        text-center
        sm:px-6
        md:px-12
      "
    >
      <div
        className="
          futura-bold
          text-[25px]
          leading-none
          sm:text-[29px]
          md:text-[36px]
        "
      >
        {count}
        {suffix}
      </div>

      <div
        className="
          futura-light
          mt-2
          whitespace-nowrap
          text-[10px]
          leading-tight
          sm:mt-3
          sm:text-[12px]
          md:text-[15px]
        "
      >
        {label}
      </div>
    </div>
  );
}