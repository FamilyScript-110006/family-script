"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SocialIcons from "../layout/SocialIcos";

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

// Replace these video IDs later if the videos change — nothing else needs to.
const episodes = [
  {
    id: 0,
    videoId: "xUYfI1E5kyk",
    caption:
      "Introducing FS Unplugged: our weekly series where we pause, rewind, and reflect.",
  },
  {
    id: 1,
    videoId: "hIplt2UFAJY",
    caption:
      "For the very first episode of FS Unplugged, our Co-founder, reflects on the practice of deep work",
  },
  {
    id: 2,
    videoId: "rKIaru5KwhE",
    caption:
      "The practice of telling a life story carries with it a profound responsibility.",
  },
  {
    id: 3,
    videoId: "4f1xzJKXA2M",
    caption:
      "Documentation becomes a way of holding on, allowing fragments of experience to remain within reach.",
  },
  {
    id: 4,
    videoId: "UQ7KKXZixAU",
    caption:
      "There are moments in every journey when a way of seeing begins to take shape.",
  },
];

/* =============================================================
   YOUTUBE HOVER-TO-PLAY EMBED (9:16 crop, chromeless)

   - At rest: iframe is mounted but paused, showing YouTube's own
     paused-frame preview (so there's no extra thumbnail request/
     flash-of-different-image on hover).
   - On hover (desktop): postMessage tells the existing iframe to
     playVideo — muted stays off since the request was for full
     hover autoplay with sound; browsers allow unmuted autoplay
     triggered by a genuine user gesture like mouseenter.
   - On mouse leave: pauseVideo.
   - Uses youtube-nocookie.com + every "chromeless" param
     (controls, modestbranding, rel, iv_load_policy, disablekb,
     fs, cc_load_policy) so no YouTube title bar, logo, related-
     video grid, captions button, or keyboard hint ever renders.
   - The iframe is deliberately oversized (316% width, 100%
     height) and centered, then clipped by the wrapper — this
     crops a 16:9 source down to a 9:16 frame instead of
     letterboxing it, and as a side effect crops away YouTube's
     corner watermark, which sits outside the visible center
     strip. The top/bottom black fades give a second layer of
     cover for anything left at the very top/bottom edge.
   ============================================================= */
function EpisodeThumbnail({
  id,
  youtubeId,
}: {
  id: number;
  youtubeId: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const videoUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&showinfo=0&loop=1&playlist=${youtubeId}${
    origin ? `&origin=${encodeURIComponent(origin)}` : ""
  }`;

  // YouTube hosts this thumbnail for every video automatically — no upload needed.
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  const sendCommand = (command: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "*",
    );
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    sendCommand("playVideo");
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    sendCommand("pauseVideo");
  };

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* STATIC COVER — shown at rest, fades out on hover */}
      <img
        src={thumbnailUrl}
        alt={`Episode ${id}`}
        className={`
          absolute inset-0 h-full w-full object-cover
          transition-opacity duration-300
          ${isHovering ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* DARKENING OVERLAY so the title stays readable on any thumbnail */}
      <div
        className={`
          absolute inset-0 bg-black/40
          transition-opacity duration-300
          ${isHovering ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* EPISODE TITLE — centered on the cover itself */}
      <p
        className={`
          absolute inset-0 z-10
          flex items-center justify-center
          futura-light text-[13px] uppercase tracking-[0.18em] text-white
          transition-opacity duration-300
          ${isHovering ? "opacity-0" : "opacity-100"}
        `}
      >
        Episode - {id}
      </p>

      {/* LIVE VIDEO — always mounted so hover feels instant, revealed via opacity */}
      <iframe
        ref={iframeRef}
        src={videoUrl}
        title=""
        tabIndex={-1}
        className={`
          pointer-events-none absolute left-1/2 top-1/2
          h-full w-[316%]
          -translate-x-1/2 -translate-y-1/2 border-0
          transition-opacity duration-300
          ${isHovering ? "opacity-100" : "opacity-0"}
        `}
        allow="autoplay; encrypted-media; picture-in-picture"
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
    <main
      className="relative min-h-screen w-full overflow-hidden text-white"
      style={{
  background: `linear-gradient(
        to bottom,
        #431827 0%,
        #3b1724 40%,
        #331923 75%,
        #2c1620 100%
      )`,
    }}
    >
      <SocialIcons />

      {/* =========================================================
          TOP / BOTTOM BLACK VIGNETTE
          Purely decorative, sits above the background color but
          below the actual content so it never blocks interaction.
          ========================================================= */}

   <div className="pointer-events-none absolute left-0 top-0 z-10 h-40 w-full bg-gradient-to-b from-black/40 via-black/15 to-transparent md:h-56" />
      {/* =========================================================
          MAIN CONTENT
          Existing navbar/header remains handled by the codebase.
          ========================================================= */}

      <section className="relative z-20 mx-auto w-full max-w-[1400px] px-6 pb-24 pt-14 md:px-[5%] md:pt-16">
        {/* ==================================================
            FOUNDING BELIEFS TITLE
            ================================================== */}

        <div
          ref={titleRef}
          className="mt-10 flex justify-center text-center md:mt-14"
        >
          <h1
            className="futura-light whitespace-nowrap uppercase tracking-[0.08em] text-white"
            style={{ fontSize: "clamp(24px, 7vw, 40px)", lineHeight: 1 }}
          >
            Founding <span className="futura-medium">Beliefs</span>
          </h1>
        </div>

        {/* ==================================================
            FOUNDING BELIEF CARDS
            ================================================== */}

        <div
          ref={beliefsRef}
          className="
            mx-auto mt-10 flex w-full flex-col items-center
            gap-[35px]
            md:mt-12
            xl:flex-row xl:flex-wrap xl:justify-center xl:gap-12
            xl:max-w-[1000px]
          "
        >
          {beliefs.map((belief, index) => (
            <div
              key={belief.author}
              className={`
                relative flex min-h-[170px] w-[min(300px,calc(100vw_-_84px))] items-center
                rounded-[8px] border border-[#E9E7DA]/25
                py-6
                transition-all duration-500
                hover:-translate-y-1
                hover:border-[#E9E7DA]/45
                hover:bg-white/[0.025]

                ${
                  index === 0
                    ? "translate-x-[24px] pl-[72px] pr-5"
                    : "-translate-x-[24px] pl-5 pr-[72px]"
                }

                xl:h-[280px]
                xl:w-[400px]
                xl:translate-x-0
                xl:px-7
                xl:py-6

                ${
                  index === 0
                    ? "xl:pl-16 xl:pl-20"
                    : "xl:pr-16 xl:pr-20"
                }
              `}
            >
              {/* Portrait */}

              <div
                className={`
                  absolute top-1/2
                  h-[108px] w-[93px]
                  -translate-y-1/2
                  overflow-hidden
                  rounded-[10px]
                  border border-[#E9E7DA]/25
                  shadow-lg

                  ${
                    index === 0
                      ? "left-[-40px]"
                      : "right-[-40px]"
                  }

                  xl:h-[150px]
                  xl:w-[150px]

                  ${
                    index === 0
                      ? "xl:left-[-48px]"
                      : "xl:right-[-48px]"
                  }
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
                className={`
                  flex h-auto w-full flex-col gap-3 text-center
                  xl:justify-between

                  ${
                    index === 0
                      ? "ml-0 xl:text-left"
                      : "mr-0 ml-auto xl:text-right"
                  }

                  xl:h-[180px]
                  xl:translate-y-[15px]

                  ${
                    index === 0
                      ? "xl:ml-12"
                      : "xl:mr-12"
                  }
                `}
              >
                <p
                  className={`
                    futura-light
                    mx-auto max-w-[230px]
                    text-[12px]
                    leading-[1.6]
                    tracking-wide
                    text-white/75

                    xl:max-w-[210px]
                    xl:text-[13.5px]
                    xl:leading-[1.7]
                    xl:max-w-[240px]

                    ${index === 0 ? "xl:mx-0" : "xl:mr-0 xl:ml-auto"}
                  `}
                >
                  &quot;{belief.quote}&quot;
                </p>

                <p
                  className={`
                    futura-light
                    text-center
                    text-[10px]
                    text-white/55

                    xl:text-[10px]

                    ${
                      index === 0
                        ? "xl:text-right"
                        : "xl:text-left"
                    }
                  `}
                >
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
          <p className="futura-light text-balance text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-wrap md:text-[16px]">
            We believe that documentation is an invaluable{" "}
            <span className="futura-emphasis whitespace-nowrap text-white">strategic asset.</span>
          </p>

          <p className="futura-light mt-3 text-balance text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-wrap md:text-[16px]">
            It stems from a profound recognition of the inherent value and
            fragility of oral traditions and cultural heritage of individuals,
            families, institutions and communities.
          </p>

          <p className="futura-light mt-4 text-balance text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-wrap md:text-[16px]">
            At a{" "}
            <span className="futura-emphasis whitespace-nowrap text-white">civilisational level</span>
            , our efforts shall feed into the collective consciousness.
          </p>

          <p className="futura-light mt-4 text-balance text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-wrap md:text-[16px]">
            We envision to be globally recognised as an inspirational{" "}
            <span className="futura-emphasis whitespace-nowrap text-white">powerhouse by 2028</span>{" "}
            - a living library with a virtual vault of memories.
          </p>

          <p className="futura-light mt-4 text-balance text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-wrap md:text-[16px]">
            Our work aligns with UN SDG 11.4 to protect and safeguard
            intangible heritage.
          </p>

          <p className="futura-light mt-4 text-balance text-[14px] leading-[1.75] tracking-wide text-white/80 md:text-wrap md:text-[16px]">
            We are strong in publication design, content creation, multimedia
            storytelling, archival strategy and institutional branding.
          </p>
        </div>

        {/* ==================================================
            EPISODES
            ================================================== */}

        <div
          ref={episodesRef}
          className="mx-auto mt-20 flex w-full max-w-[1200px] flex-wrap justify-center gap-x-10 gap-y-16 md:mt-24"
        >
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="w-full basis-full sm:basis-[calc(50%-20px)] md:basis-[calc(33.333%-27px)] md:max-w-[340px]"
            >
              <EpisodeThumbnail id={episode.id} youtubeId={episode.videoId} />

              <p className="futura-light mt-3 text-center text-[12px] leading-[1.5] tracking-wide text-white/55">
                {episode.caption}
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