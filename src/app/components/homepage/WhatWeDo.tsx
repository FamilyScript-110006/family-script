"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CTAButton from "../layout/CTAButton";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   COMPONENT
============================================================ */

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);

  /* ============================================================
     GSAP
  ============================================================ */

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) {
      return;
    }

    const context = gsap.context(() => {
      /* ==================================================
         MOBILE + DESKTOP ELEMENTS
      ================================================== */

      const boxes = content.querySelectorAll(
        ".wwd-composition-box",
      );

      const titles = content.querySelectorAll(
        ".wwd-title",
      );

      const rightTexts = content.querySelectorAll(
        ".wwd-right-text",
      );

      const leftTexts = content.querySelectorAll(
        ".wwd-left-text",
      );

      /* ==================================================
         INITIAL STATE
      ================================================== */

      gsap.set(boxes, {
        opacity: 0,
      });

      gsap.set(titles, {
        opacity: 0,
        y: 35,
        scale: 0.96,
      });

      gsap.set(rightTexts, {
        opacity: 0,
        x: 40,
      });

      gsap.set(leftTexts, {
        opacity: 0,
        x: -40,
      });

      /* ==================================================
         ENTRANCE TIMELINE
      ================================================== */

      const entrance = gsap.timeline({
        paused: true,
      });

      /* --------------------------------------------------
         TRANSPARENT COMPOSITION BOXES
      -------------------------------------------------- */

      entrance.to(boxes, {
        opacity: 1,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.04,
      });

      /* --------------------------------------------------
         TITLE
      -------------------------------------------------- */

      entrance.to(
        titles,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.35",
      );

      /* --------------------------------------------------
         RIGHT TEXT
      -------------------------------------------------- */

      entrance.to(
        rightTexts,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.52",
      );

      /* --------------------------------------------------
         LEFT TEXT
      -------------------------------------------------- */

      entrance.to(
        leftTexts,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.62",
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
            "url('/assets/Homepage/WHAT_WE_DO.jpg')",

          backgroundSize: "cover",

          backgroundPosition: "center center",

          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* ======================================================
          STATIC MAROON / BURGUNDY COLOURISATION
      ====================================================== */}

      <div
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
          STATIC DARK OVERLAY
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
          MAIN COMPOSITION
      ====================================================== */}

      <div
        ref={contentRef}
        className="
          absolute
          inset-0
          z-10
        "
      >

        {/* ====================================================
            ====================================================
            DESKTOP COMPOSITION
            ====================================================
        ==================================================== */}

        <div
          className="
            hidden
            md:block
            absolute
            inset-0
          "
        >

          {/* ==================================================
              LEFT DARK TRANSPARENT BLOCK
          ================================================== */}

          <div
            className="
              wwd-composition-box
              absolute
              left-0
              top-[23%]
              h-[33%]
              w-[19%]
            "
            style={{
              background: "rgba(18, 15, 32, 0.58)",
              backdropFilter: "blur(1px)",
              WebkitBackdropFilter: "blur(1px)",
            }}
          />

          {/* ==================================================
              TITLE BOX
          ================================================== */}

          <div
            className="
              wwd-title
              absolute
              left-[25.2%]
              top-[12%]
              flex
              h-[33%]
              w-[19%]
              items-center
              justify-center
              text-center
            "
            style={{
              background: "rgba(164, 103, 40, 0.70)",
            }}
          >
            <h2
              className="
                futura-light
                uppercase
                text-[3.7vw]
                leading-[1.18]
                tracking-[0.02em]
                text-white
              "
            >
              WHAT
              <br />
              WE
              <br />
              DO?
            </h2>
          </div>

          {/* ==================================================
              TOP RIGHT WHITE TRANSPARENT BLOCK
          ================================================== */}

          <div
            className="
              wwd-composition-box
              absolute
              right-0
              top-0
              h-[33%]
              w-[19%]
            "
            style={{
              background: "rgba(255, 255, 255, 0.42)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          {/* ==================================================
              RIGHT GOLD CONTENT BLOCK
          ================================================== */}

          <div
            className="
              wwd-right-text
              absolute
              right-[12.7%]
              top-[33.5%]
              flex
              h-[33.5%]
              w-[37%]
              items-center
              justify-center
              px-[4%]
              text-center
            "
            style={{
              background: "rgba(174, 111, 32, 0.62)",
            }}
          >
            <p
              className="
                futura-light
                max-w-[360px]
                text-[15px]
                leading-[1.35]
                text-white
                md:text-[17px]
                lg:text-[18px]
              "
            >
              We explore{" "}
              <span className="futura-medium">
                Individual and
                <br />
                Institutional legacies
              </span>{" "}
              through social
              <br />
              and spatial documentation.
            </p>
          </div>

          {/* ==================================================
              RIGHT BOTTOM WHITE TRANSPARENT BLOCK
          ================================================== */}

          <div
            className="
              wwd-composition-box
              absolute
              bottom-0
              right-0
              h-[33%]
              w-[19%]
            "
            style={{
              background: "rgba(255, 255, 255, 0.40)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          {/* ==================================================
              RIGHT VERTICAL LIGHT PANEL
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-[33%]
              h-[34%]
              w-[19%]
            "
            style={{
              background: "rgba(255, 255, 255, 0.12)",
            }}
          />

          {/* ==================================================
              LEFT BOTTOM GOLD CONTENT BLOCK
          ================================================== */}

          <div
            className="
              wwd-left-text
              absolute
              bottom-0
              left-0
              flex
              h-[44%]
              w-[37.8%]
              flex-col
              items-center
              justify-center
              px-[5.5%]
              py-8
              text-center
            "
            style={{
              background: "rgba(169, 107, 33, 0.57)",
            }}
          >
            <p
              className="
                futura-light
                text-[15px]
                leading-[1.45]
                text-white
                md:text-[17px]
                lg:text-[18px]
              "
            >
              We develop forward-looking
              <br />
              perspectives to create a legacy from
              <br />
              lesser-known histories. Our process is
              <br />
              interactive, collaborative and an
              <br />
              experience worth undertaking.
            </p>

            <p
              className="
                futura-light
                mt-6
                text-[15px]
                leading-[1.45]
                text-white
                md:text-[17px]
                lg:text-[18px]
              "
            >
              We are empathetic listeners,{" "}
              <span className="futura-medium">
                We co-
                <br />
                create with you.
              </span>
            </p>
          </div>
        </div>

        {/* ====================================================
            ====================================================
            MOBILE COMPOSITION
            ====================================================
        ==================================================== */}

        <div
          className="
            absolute
            inset-0
            md:hidden
          "
        >

          {/* ==================================================
              SUBTLE TOP LEFT PANEL
          ================================================== */}

          <div
            className="
              wwd-composition-box
              absolute
              left-0
              top-[27%]
              h-[15%]
              w-[56%]
            "
            style={{
              background: "rgba(35, 30, 40, 0.42)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          {/* ==================================================
              MOBILE TITLE
          ================================================== */}

          <div
            className="
              wwd-title
              absolute
              left-[28%]
              top-[3%]
              flex
              h-[20%]
              w-[45%]
              items-center
              justify-center
              text-center
            "
            style={{
              background: "rgba(164, 103, 40, 0.72)",
            }}
          >
            <h2
              className="
                futura-light
                uppercase
                text-[8.2vw]
                leading-[1.15]
                tracking-[0.015em]
                text-white
              "
            >
              WHAT
              <br />
              WE DO?
            </h2>
          </div>

          {/* ==================================================
              MOBILE FIRST TEXT PANEL
          ================================================== */}

          <div
            className="
              wwd-left-text
              absolute
              left-0
              top-[27%]
              flex
              h-[15%]
              w-[57%]
              items-center
              justify-center
              px-[5%]
              text-center
            "
            style={{
              background: "rgba(154, 154, 154, 0.58)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          >
            <p
              className="
                futura-light
                text-[3vw]
                leading-[1.28]
                text-white
              "
            >
              We explore{" "}
              <span className="futura-medium">
                Individual
                <br />
                and Institutional legacies
              </span>
              <br />
              through social and spatial
              <br />
              documentation.
            </p>
          </div>

          {/* ==================================================
              MOBILE RIGHT SIDE LIGHT PANEL
          ================================================== */}

          <div
            className="
              wwd-composition-box
              absolute
              right-0
              top-[20%]
              h-[32%]
              w-[22%]
            "
            style={{
              background: "rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          {/* ==================================================
              MOBILE LARGE LOWER CONTENT PANEL
          ================================================== */}

          <div
            className="
              wwd-right-text
              absolute
              right-0
              top-[52%]
              flex
              h-[39%]
              w-[57%]
              flex-col
              items-center
              justify-center
              px-[5%]
              text-center
            "
            style={{
              background: "rgba(103, 32, 67, 0.66)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          >
            <p
              className="
                futura-light
                text-[3vw]
                leading-[1.32]
                text-white
              "
            >
              We develop forward-looking
              <br />
              perspectives to create a
              <br />
              legacy from lesser-known
              <br />
              histories. Our process is
              <br />
              <span className="futura-medium">
                interactive, collaborative and
              </span>
              <br />
              an experience worth
              <br />
              undertaking.
            </p>

            <p
              className="
                futura-light
                mt-[5%]
                text-[3vw]
                leading-[1.35]
                text-white
              "
            >
              We are empathetic listeners,
              <br />
              <span className="futura-medium">
                We co-create with you.
              </span>
            </p>
          </div>

          {/* ==================================================
              MOBILE BOTTOM SUBTLE PANEL
          ================================================== */}

          <div
            className="
              wwd-composition-box
              absolute
              bottom-0
              left-0
              h-[10%]
              w-full
            "
            style={{
              background: "rgba(18, 15, 32, 0.18)",
            }}
          />
        </div>

        {/* ====================================================
            CTA BUTTON
        ==================================================== */}

        <div
          className="
            absolute
            left-1/2
            top-[93%]
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