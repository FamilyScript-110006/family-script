"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SocialIcons from "../layout/SocialIcos";
import PageGradientBackground from "../layout/PageGradientBackground";

gsap.registerPlugin(ScrollTrigger);

const beliefs = [
  {
    image: "/assets/philosophy/founding-belief-1.png",
    quote:
      "The ultimate goal of life is to put the 'human self' that is conscious of one's roots, in service of the greater good. This is the value of 'living'.",
    author: "Dr. Kshitij Kumar Sinha",
    side: "left",
  },
  {
    image: "/assets/philosophy/founding-belief-2.png",
    quote:
      "Design discipline needs to move from the one-off act of problem-solving to continuous, responsive dialogue—decentralising it from a specialist discipline into a generalist attitude embedded in everyday practice.",
    author: "Meenakshi Dubey",
    side: "right",
  },
];

// Replace these URLs later if the Reels change — nothing else needs to.
const episodes = [
  { id: 0, url: "https://www.instagram.com/reel/DUOAJcEjVIJ/" },
  { id: 1, url: "https://www.instagram.com/reel/DUvDWA0k-Sl/" },
  { id: 2, url: "https://www.instagram.com/reel/DVqDNltDcM2/" },
  { id: 3, url: "https://www.instagram.com/reel/DV-VEcRq6hS/" },
  { id: 4, url: "https://www.instagram.com/reel/DZhxhlUzTbd/" },
];

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

// Instagram's embed.js is loaded once and shared across every card on the
// page, rather than injecting a fresh <script> per embed.
let igScriptPromise: Promise<void> | null = null;

function loadInstagramEmbedScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.instgrm) return Promise.resolve();
  if (igScriptPromise) return igScriptPromise;

  igScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("ig embed script failed")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("ig embed script failed"));
    document.body.appendChild(script);
  });

  return igScriptPromise;
}

function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | undefined;

    loadInstagramEmbedScript()
      .then(() => {
        if (cancelled) return;

        window.instgrm?.Embeds.process();
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("failed");
        }
      });

    if (containerRef.current) {
      observer = new MutationObserver(() => {
        if (containerRef.current?.querySelector("iframe")) {
          setStatus("loaded");
          observer?.disconnect();
        }
      });

      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    const timeoutId = setTimeout(() => {
      if (!cancelled && !containerRef.current?.querySelector("iframe")) {
        setStatus("failed");
      }
    }, 7000);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [url]);

  if (status === "failed") {
    return (
      <div className="flex aspect-[9/13] w-full flex-col items-center justify-center gap-3 rounded-[8px] border border-white/25 bg-white/[0.03] px-6 text-center">
        <span className="futura-light text-[11px] tracking-wide text-white/60">
          This Reel couldn&apos;t load here.
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="futura-light text-[12px] tracking-wide text-white underline underline-offset-4 hover:text-white/80"
        >
          View on Instagram &rarr;
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full  rounded-[8px]"
      style={{ minHeight: status === "loading" ? 420 : undefined }}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          margin: 0,
          maxWidth: "100%",
          minWidth: "270px",
          padding: 0,
          width: "100%",
        }}
      />
    </div>
  );
}

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null);
  const beliefsRef = useRef<HTMLDivElement>(null);
  const philosophyTextRef = useRef<HTMLDivElement>(null);
  const episodesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ==================================================
         PAGE TITLE
         ================================================== */

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      /* ==================================================
         FOUNDING BELIEFS
         ================================================== */

      if (beliefsRef.current) {
        gsap.fromTo(
          beliefsRef.current.children,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: beliefsRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      /* ==================================================
         SUBTLE PARALLAX ON BELIEF CARDS
         ================================================== */

      if (beliefsRef.current) {
        gsap.to(beliefsRef.current, {
          y: -25,
          ease: "none",
          scrollTrigger: {
            trigger: beliefsRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* ==================================================
         PHILOSOPHY TEXT
         ================================================== */

      if (philosophyTextRef.current) {
        gsap.fromTo(
          philosophyTextRef.current,
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
              trigger: philosophyTextRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.to(philosophyTextRef.current, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: philosophyTextRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* ==================================================
         EPISODES
         ================================================== */

      if (episodesRef.current) {
        gsap.fromTo(
          episodesRef.current.children,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: episodesRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      /* ==================================================
         CTA
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
    <main className="relative min-h-screen w-full  bg-[#532439] text-white">
      <PageGradientBackground />

      <SocialIcons />

      {/* =========================================================
          MAIN CONTENT
          Existing navbar/header remains handled by the codebase.
          ========================================================= */}

      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 pt-14 md:px-[5%] md:pt-16">
        {/* ==================================================
            FOUNDING BELIEFS TITLE
            ================================================== */}

        <div
          ref={titleRef}
          className="mt-10 flex justify-center text-center md:mt-14"
        >
          <h1 className="futura-light text-[32px] uppercase tracking-[0.08em] text-white md:text-[40px]">
            Founding <span className="futura-medium">Beliefs</span>
          </h1>
        </div>

        {/* ==================================================
            FOUNDING BELIEF CARDS
            ================================================== */}

        <div
          ref={beliefsRef}
          className="mx-auto mt-10 grid w-full max-w-[1020px] gap-8 md:mt-12 md:grid-cols-2 md:gap-8 lg:gap-10"
        >
          {beliefs.map((belief, index) => (
            <div
              key={belief.author}
              className={`
                relative flex min-h-[170px] items-center
                rounded-[8px] border border-[#E9E7DA]/25
                px-7 py-6
                transition-all duration-500
                hover:-translate-y-1
                hover:border-[#E9E7DA]/45
                hover:bg-white/[0.025]
                md:min-h-[180px]
                lg:min-h-[190px]
                ${index === 0 ? "pl-16 lg:pl-20" : "pr-16 lg:pr-20"}
              `}
            >
              {/* Portrait */}

              <div
                className={`
                  absolute top-1/2 h-[100px] w-[100px]
                  -translate-y-1/2 
                  rounded-[6px]
                  border border-[#E9E7DA]/25
                  shadow-lg
                  ${index === 0 ? "left-[-38px]" : "right-[-38px]"}
                `}
              >
                <img
                  src={belief.image}
                  alt={belief.author}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Quote */}

              <div
                className={`w-full ${
                  index === 0 ? "text-left" : "ml-auto text-right"
                }`}
              >
                <p
                  className={`futura-light max-w-[200px] text-[12px] leading-[1.7] tracking-wide text-white/75 md:max-w-[210px] md:text-[13.5px] lg:max-w-[240px] ${
                    index === 0 ? "" : "ml-auto"
                  }`}
                >
                  &quot;{belief.quote}&quot;
                </p>

                <p className="futura-light mt-4 text-[9.5px] text-white/55 md:text-[10px]">
                  {belief.author}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ==================================================
            PHILOSOPHY STATEMENT
            ================================================== */}

        <div
          ref={philosophyTextRef}
          className="mx-auto mt-16 w-full max-w-[820px] text-center md:mt-20"
        >
          <p className="futura-light text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-[16px]">
            We believe that documentation is an invaluable strategic asset.
          </p>

          <p className="futura-light mt-3 text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-[16px]">
            It stems from a profound recognition of the inherent value and
            fragility of oral traditions and cultural heritage of individuals,
            families, institutions and communities.
          </p>

          <p className="futura-light mt-4 text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-[16px]">
            At a civilisational level, our efforts shall feed into the
            collective consciousness.
          </p>

          <p className="futura-light mt-4 text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-[16px]">
            We envision to be globally recognised as an inspirational powerhouse
            by 2028 - a living library with a virtual vault of memories.
          </p>

          <p className="futura-light mt-4 text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-[16px]">
            Our work aligns with UN SDG 11.4 to protect and safeguard intangible
            heritage.
          </p>

          <p className="futura-light mt-4 text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-[16px]">
            We are strong in publication design, content creation, multimedia
            storytelling, archival strategy and institutional branding.
          </p>
        </div>

        {/* ==================================================
            EPISODES
            ================================================== */}

        <div
          ref={episodesRef}
          className="mx-auto mt-20 flex w-full max-w-[1100px] flex-wrap justify-center gap-x-10 gap-y-14 md:mt-24"
        >
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="w-full basis-full sm:basis-[calc(50%-20px)] md:basis-[calc(33.333%-28px)] md:max-w-[320px]"
            >
              <p className="futura-light mb-3 text-center text-[13px] uppercase tracking-[0.18em] text-white/70">
                Episode - {episode.id}
              </p>

              <InstagramEmbed url={episode.url} />

              <p className="futura-light mt-3 text-center text-[9px] leading-[1.5] tracking-wide text-white/55">
                The beginning of a dream, where ideas sparked into purpose and
                our journey began.
              </p>
            </div>
          ))}
        </div>

        {/* ==================================================
            CTA
            ================================================== */}

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
