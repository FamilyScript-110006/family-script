"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";

/* ============================================================
   HERO
============================================================ */

export default function Hero() {
  /*
   * IMPORTANT:
   *
   * page.tsx owns:
   *
   * <section>
   *   <Hero />
   * </section>
   *
   * Therefore Hero itself must NOT create another
   * homepage <section>.
   */

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const logoRef = useRef<HTMLDivElement | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const subtitleRef = useRef<HTMLHeadingElement | null>(null);

  /* ==========================================================
     HERO ENTRANCE ANIMATION
  ========================================================== */

  useEffect(() => {
    const section = sectionRef.current;

    const content = contentRef.current;

    const logo = logoRef.current;

    const title = titleRef.current;

    const subtitle = subtitleRef.current;

    if (!section || !content || !logo || !title || !subtitle) {
      return;
    }

    const context = gsap.context(() => {
      /*
       * Hero is the starting section.
       *
       * This animation only runs on initial load.
       */

      gsap.set([logo, title, subtitle], {
        opacity: 0,
        y: 30,
      });

      const timeline = gsap.timeline({
        delay: 0.15,
      });

      /* ==================================================
             LOGO
          ================================================== */

      timeline.to(logo, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      /* ==================================================
             TITLE
          ================================================== */

      timeline.to(
        title,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.55",
      );

      /* ==================================================
             SUBTITLE
          ================================================== */

      timeline.to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.55",
      );
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
          BACKGROUND VIDEO
      ====================================================== */}

      <video
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      >
        <source src="/assets/homepage/HOME_PAGE_VIDEO.mp4" type="video/mp4" />
      </video>

      {/* ======================================================
          HERO OVERLAY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/30
        "
      />

      {/* ======================================================
          HERO CONTENT
      ====================================================== */}

      <div
        ref={contentRef}
        className="
          relative
          z-10
          flex
          h-full
          flex-col
          items-center
          justify-end
          pb-[5vh]
          text-center
          text-white
        "
      >
        {/* ==================================================
            LOGO
        ================================================== */}

        <div ref={logoRef} className="mb-1">
          <img
            src="/assets/homepage/FS_logo.png"
            alt="Family Script"
            className="
              h-[130px]
              w-[130px]
              object-contain
              brightness-0
              invert
            "
          />
        </div>

        {/* ==================================================
            TITLE
        ================================================== */}

        <h1
          ref={titleRef}
          className="
            futura-light
            uppercase
            text-[2.25rem]
            leading-[1.15]
            tracking-[0.10em]
          "
        >
          Record Your Story
        </h1>

        {/* ==================================================
            SUBTITLE
        ================================================== */}

        <h2
          ref={subtitleRef}
          className="
            futura-bold
            mt-3
            uppercase
            text-[2.25rem]
            leading-[1.15]
            tracking-[0.10em]
          "
        >
          Create a Legacy
        </h2>
      </div>
    </div>
  );
}
