// components/homepage/WhatWeOffer.tsx

"use client";

import CTAButton from "../layout/CTAButton";
import Link from "next/link";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   COMPONENT
============================================================ */

export default function WhatWeOffer() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const backgroundRef = useRef<HTMLDivElement>(null);

  const gradientRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);

  const introRef = useRef<HTMLDivElement>(null);

  const servicesRef = useRef<HTMLDivElement>(null);

  /* ============================================================
     GSAP
  ============================================================ */

  useEffect(() => {
    const section = sectionRef.current;

    const background = backgroundRef.current;

    const gradient = gradientRef.current;

    const content = contentRef.current;

    const heading = headingRef.current;

    const intro = introRef.current;

    const services = servicesRef.current;

    if (
      !section ||
      !background ||
      !gradient ||
      !content ||
      !heading ||
      !intro ||
      !services
    ) {
      return;
    }

    const boxes =
      services.querySelectorAll<HTMLElement>(".service-box");

    const ctx = gsap.context(() => {
      /* ==================================================
         INITIAL STATES
      ================================================== */

      gsap.set(background, {
        x: 0,
        y: 0,
        scale: 1,
      });

      gsap.set(gradient, {
        x: 0,
        y: 0,
      });

      gsap.set(heading, {
        opacity: 0,
        y: 45,
        scale: 0.98,
      });

      gsap.set(intro, {
        opacity: 0,
        y: 35,
      });

      gsap.set(services, {
        opacity: 1,
      });

      gsap.set(boxes, {
        opacity: 0,
        y: 30,
        scale: 0.97,
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
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      });

      /* --------------------------------------------------
         INTRO
      -------------------------------------------------- */

      entrance.to(
        intro,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.58",
      );

      /* --------------------------------------------------
         SERVICE BOXES
      -------------------------------------------------- */

      entrance.to(
        boxes,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: {
            each: 0.09,
            from: "start",
          },
          ease: "power3.out",
        },
        "-=0.35",
      );

      /* ==================================================
         SECTION ENTRANCE
      ================================================== */

      ScrollTrigger.create({
        trigger: section,

        start: "top 85%",

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
      ctx.revert();
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
          backgroundImage:
            "url('/assets/Homepage/WHAT_WE_OFFER.jpg')",

          backgroundSize: "cover",

          backgroundPosition: "center center",

          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* ======================================================
          COLOURISATION / MAROON GRADIENT
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
          SUBTLE DARK OVERLAY
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
          MAIN CONTENT
      ====================================================== */}

      <div
        ref={contentRef}
        className="
          relative
          z-10
          h-full
          min-h-full
          w-full
          text-white
        "
      >

        {/* ====================================================
            ====================================================
            DESKTOP VERSION
            ====================================================
        ==================================================== */}

        <div
          className="
            absolute
            inset-0
            hidden
            md:block
          "
        >

          {/* ==================================================
              HEADING
          ================================================== */}

          <h2
            className="
              futura-medium
              absolute
              left-0
              right-0
              top-[15%]
              text-center
              text-[3.6vw]
              uppercase
              leading-none
              tracking-[0.04em]
            "
          >
            WHAT WE OFFER?
          </h2>

          {/* ==================================================
              INTRO
          ================================================== */}

          <div
            className="
              futura-light
              absolute
              left-0
              right-0
              top-[27%]
              text-center
              text-[1.55vw]
              leading-[1.5]
            "
          >
            <p>A nonlinear, open-ended process</p>

            <p>
              Recording Oral History and Material Memory
            </p>

            <p>
              Driving a{" "}
              <span
                className="
                  futura-medium
                  font-black
                  text-[#E9C892]
                "
              >
                “Moving Methodology”
              </span>
            </p>
          </div>

          {/* ==================================================
              DESKTOP SERVICES GRID
          ================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-[48%]
              grid
              w-[75%]
              -translate-x-1/2
              grid-cols-3
              gap-x-[15%]
              gap-y-10
            "
          >
            <div>
              <ServiceBox>
                Memoirs, Anthologies,
                <br />
                Biographies
              </ServiceBox>
            </div>

            <div>
              <ServiceBox>
                Documentaries,
                <br />
                Short Films
              </ServiceBox>
            </div>

            <div>
              <ServiceBox>
                Digital Archive Services
              </ServiceBox>
            </div>

            <div>
              <ServiceBox>
                Exhibition Design
              </ServiceBox>
            </div>

            <div>
              <ServiceBox>
                Life Writing Workshops
              </ServiceBox>
            </div>

            <Link
              href="/products"
              className="block cursor-pointer"
            >
              <ServiceBox>
                Bespoke Journals
              </ServiceBox>
            </Link>
          </div>
        </div>

        {/* ====================================================
            ====================================================
            MOBILE VERSION
            ====================================================
        ==================================================== */}

        <div
          ref={servicesRef}
          className="
            absolute
            inset-0
            md:hidden
          "
        >

          {/* ==================================================
              MOBILE HEADING
          ================================================== */}

          <h2
            className="
              absolute
              left-0
              right-0
              top-[6%]
              px-4
              text-center
              futura-light
              text-[7.5vw]
              uppercase
              leading-[1.15]
              tracking-[0.03em]
            "
          >
            WHAT WE OFFER?
          </h2>

          {/* ==================================================
              MOBILE INTRO
          ================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-[25%]
              w-[82%]
              -translate-x-1/2
              text-center
              futura-light
              text-[3.25vw]
              leading-[1.45]
            "
          >
            <p>
              A nonlinear, open-ended process
            </p>

            <p>
              Recording Oral History and Material Memory
            </p>

            <p>
              Driving a{" "}
              <span
                className="
                  futura-medium
                  font-black
                  text-[#E9C892]
                "
              >
                “Moving Methodology”
              </span>
            </p>
          </div>

          {/* ==================================================
              MOBILE SERVICES
          ================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-[43%]
              grid
              w-[74%]
              -translate-x-1/2
              grid-cols-2
              gap-x-[10%]
              gap-y-[4.5%]
            "
          >

            {/* ------------------------------------------------
                MEMOIRS
            ------------------------------------------------ */}

            <div>
              <ServiceBox mobile>
                Memoirs, Anthologies,
                <br />
                Biographies
              </ServiceBox>
            </div>

            {/* ------------------------------------------------
                DOCUMENTARIES
            ------------------------------------------------ */}

            <div>
              <ServiceBox mobile>
                Documentaries,
                <br />
                Short Films
              </ServiceBox>
            </div>

            {/* ------------------------------------------------
                DIGITAL ARCHIVE
            ------------------------------------------------ */}

            <div>
              <ServiceBox mobile>
                Digital Archive Services
              </ServiceBox>
            </div>

            {/* ------------------------------------------------
                EXHIBITION
            ------------------------------------------------ */}

            <div>
              <ServiceBox mobile>
                Exhibition Design
              </ServiceBox>
            </div>

            {/* ------------------------------------------------
                LIFE WRITING
            ------------------------------------------------ */}

            <div>
              <ServiceBox mobile>
                Life Writing Workshops
              </ServiceBox>
            </div>

            {/* ------------------------------------------------
                BESPOKE JOURNALS
            ------------------------------------------------ */}

            <Link
              href="/products"
              className="
                block
                cursor-pointer
              "
            >
              <ServiceBox mobile>
                Bespoke Journals
              </ServiceBox>
            </Link>
          </div>
        </div>

        {/* ====================================================
            GLOBAL CTA
        ==================================================== */}

        <div
          className="
            absolute
            left-1/2
            top-[91%]
            z-30
            -translate-x-1/2
          "
        >
          <CTAButton />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SERVICE BOX
============================================================ */

function ServiceBox({
  children,
  mobile = false,
}: {
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <div
      className={`
        service-box
        futura-light
        flex
        items-center
        justify-center
        text-center
        transition-all
        duration-300

        ${
          mobile
            ? `
              h-[60px]
              w-full
              rounded-[6px]
              bg-[rgba(160,115,59,0.8)]
              px-2
              text-[14px]
              leading-[1.25]
              hover:bg-[rgba(116,87,52,0.85)]
            `
            : `
              h-[100px]
              rounded-[10px]
              bg-[rgba(72,58,70,0.55)]
              px-5
              text-[1.15vw]
              leading-[1.35]
              hover:bg-[rgba(72,58,70,0.7)]
            `
        }
      `}
    >
      {children}
    </div>
  );
}