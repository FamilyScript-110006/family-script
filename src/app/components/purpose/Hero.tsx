// components/purpose/Hero.tsx

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SocialIcons from "../layout/SocialIcos";
import ScrapbookImage from "./ScrapbookImage";
import PageGradientBackground from "../layout/PageGradientBackground";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const bannerSectionRef = useRef<HTMLElement>(null);
  const bannerBgRef = useRef<HTMLImageElement>(null);

  const visionRef = useRef<HTMLDivElement>(null);
  const scrapbookWrapperRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ==================================================
         BANNER BACKGROUND PARALLAX
         ================================================== */

      if (bannerBgRef.current && bannerSectionRef.current) {
        gsap.fromTo(
          bannerBgRef.current,
          {
            yPercent: -5,
            scale: 1.08,
          },
          {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: bannerSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          },
        );
      }

      /* ==================================================
         OUR VISION - SMOOTH VERTICAL ENTRY
         ================================================== */

      if (visionRef.current) {
        gsap.fromTo(
          visionRef.current,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: visionRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      /* ==================================================
         SCRAPBOOK - SMOOTH VERTICAL ENTRY
         ================================================== */

      if (scrapbookWrapperRef.current) {
        gsap.fromTo(
          scrapbookWrapperRef.current,
          {
            opacity: 0,
            y: 45,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scrapbookWrapperRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      /* ==================================================
         OUR MISSION - SMOOTH VERTICAL ENTRY
         ================================================== */

      if (missionRef.current) {
        gsap.fromTo(
          missionRef.current,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: missionRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      /* ==================================================
         CTA - SMOOTH VERTICAL ENTRY
         ================================================== */

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative w-full  bg-[#532439] text-white">
      {/* Behind the banner photo below (opaque, so this only actually
          shows through in the content area past it) and everything
          else on the page. */}
      <PageGradientBackground />

      {/* ================= SOCIAL MEDIA ICONS ================= */}
      <SocialIcons />

      {/* =========================================================
          TOP BANNER
          Navbar is handled by the existing site/header.
          ========================================================= */}

      <section
        ref={bannerSectionRef}
        className="relative h-[220px] w-screen  md:h-[260px]"
      >
        <img
          ref={bannerBgRef}
          src="/assets/purpose/hero-banner.png"
          alt="Family Script keepsakes"
          className="absolute inset-[-5%] h-[110%] w-[110%] object-cover"
        />

        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/25" />
      </section>

      {/* =========================================================
          CONTENT
          ========================================================= */}

      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 pt-16 md:px-[4%] md:pt-20">
        {/* ================= OUR VISION ================= */}

        <div ref={visionRef} className="w-full md:w-[68%]">
          <h2 className="futura-bold text-[26px] uppercase tracking-[0.06em] text-[#e7ad55] md:text-[30px]">
            Our Vision
          </h2>

          <p className="futura-light mt-5 text-[15px] leading-[1.8] tracking-wide text-white/80 md:text-[16px]">
            Our vision is to be recognised globally by 2028 as an inspirational
            powerhouse by becoming a living library, a virtual vault where
            stories are safeguarded, memories are enshrined and the fabric of
            human existence is curated; thus emerging as a leading and reputed
            brand that beckons to explore depths of individual&apos;s roots by
            traversing terrains of history through personal anecdotes and shared
            narratives.
          </p>
        </div>

        {/* ================= SCRAPBOOK IMAGE ================= */}

        <div
          ref={scrapbookWrapperRef}
          className="mx-auto mt-14 flex w-full justify-center md:mt-16"
        >
          <ScrapbookImage
            src="/assets/purpose/scrapbook.png"
            alt="A collage of family photographs, letters and keepsakes"
            className="w-full max-w-[1100px]"
          />
        </div>

        {/* ================= OUR MISSION ================= */}

        <div
          ref={missionRef}
          className="mt-14 w-full text-left md:mt-16 md:ml-auto md:w-[68%] md:text-right"
        >
          <h2 className="futura-bold text-[26px] uppercase tracking-[0.06em] text-[#e7ad55] md:text-[30px]">
            Our Mission
          </h2>

          <p className="futura-light mt-5 text-[15px] leading-[1.8] tracking-wide text-white/80 md:text-[16px]">
            Our mission is to create a memory treasure chest that captures the
            full spectrum of emotions, dig beyond surface-level celebrations,
            explores the complexities and nuances of human subtleties, embrace
            vulnerabilities and encourage individuals to recognise and honour
            unfiltered truth that defines them by preserving their stories,
            memories and unscripted experiences.
          </p>

          <p className="futura-light mt-5 text-[15px] leading-[1.8] tracking-wide text-white/80 md:text-[16px]">
            It will eventually feed into the collective consciousness, allowing
            the diversity of perspectives and lived experiences to originate,
            survive, live and thrive at the familial, organisational, societal
            and hence civilisational level.
          </p>
        </div>

        {/* ================= CTA ================= */}

        <div ref={ctaRef} className="mt-16 flex justify-center md:mt-20">
          <Link
            href="#"
            className="futura-light group inline-flex w-fit items-center rounded-full border border-white/30 bg-white/[0.08] px-8 py-3 text-[13px] tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:bg-white/[0.15]"
          >
            Get your Story <span className="futura-bold ml-1">Scripted</span>
            <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
              &gt;&gt;
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
