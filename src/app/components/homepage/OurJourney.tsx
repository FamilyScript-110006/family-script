
"use client";

import React, { useRef, useState, useCallback } from "react";

type JourneyItem = {
  year: string;
  text: string;
  position: "top" | "bottom";
  image?: string;
};

const journeyItems: JourneyItem[] = [
  {
    year: "2015",
    text: "Two friends, Kshitij and Rishi, envisioned bringing memories out of wardrobes to celebrate family legacies, giving birth to Family Script.",
    position: "top",
    image: "/assets/OurJourney/2015.jpeg",
  },
  {
    year: "2017",
    text: "Incubated at IGDTUW-Anveshan Foundation and formally registered as Prarabdha Info Solutions Private Limited, marking Family Script’s first institutional milestone.",
    position: "bottom",
    image: "/assets/OurJourney/2017.png",
  },
  {
    year: "2018",
    text: "Selected among India’s top 16 from 400 applicants, Family Script received three months of entrepreneurship training and mentorship from the University of Texas at Austin, USA.",
    position: "top",
    image: "/assets/OurJourney/2018.png",
  },
  {
    year: "2019",
    text: "Our first 8+ analogue projects tested the waters, transforming personal milestones and intimate family memories into meaningful, tangible legacies.",
    position: "bottom",
    image: "/assets/OurJourney/2019.png",
  },
  {
    year: "2020 - 2022",
    text: "A period of reflection and family time, amidst difficult circumstances, deepened our belief in preserving oral histories before they are lost.",
    position: "top",
    image: "/assets/OurJourney/2020-2022.jpeg",
  },
  {
    year: "2023",
    text: "Family Script became a daily pursuit as Meenakshi joined as Director, a young team came together, and Family Script 2.0 was launched.",
    position: "bottom",
    image: "/assets/OurJourney/2023.jpg",
  },
  {
    year: "2024",
    text: "Exhibited Family Script projects and Indigo Chronicles, a set of three journals to Create, Cherish and Celebrate life, at DCWA’s Diplomatic Bazaar; bringing life documentation and legacy-making to a wider audience.",
    position: "top",
    image: "/assets/OurJourney/2024.JPG",
  },
  {
    year: "2025",
    text: "Family Script won the UX India 2025 Design Pitch Competition, emerging among 149 global entries and pitching to leading investors in Hyderabad.",
    position: "bottom",
    image: "/assets/OurJourney/2025.png",
  },
  {
    year: "2026",
    text: "Showcased Family Script’s Digital Model at the India Impact AI Summit 2026, representing Delhi Government-promoted startups and opening new institutional opportunities.",
    position: "top",
    image: "/assets/OurJourney/2026.jpg",
  },
  {
    year: "2023-2026",
    text: "28+ projects completed across biographies, memoirs, institutional histories, practice histories, and diverse forms of legacy documentation.",
    position: "bottom",
    image: "/assets/OurJourney/2023-2026.jpg",
  },
];

export default function OurJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToItem = useCallback((index: number) => {
    const target = Math.max(
      0,
      Math.min(index, journeyItems.length - 1)
    );

    const track = trackRef.current;
    const item = itemRefs.current[target];

    if (!track || !item) return;

    track.scrollTo({
      left: item.offsetLeft,
      behavior: "smooth",
    });

    setActiveIndex(target);
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackStart = track.getBoundingClientRect().left;

    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const itemStart = item.getBoundingClientRect().left;

      const distance = Math.abs(trackStart - itemStart);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#2d0b1b] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#35101f] via-[#390e21] to-[#250817]" />

      <div className="relative z-10 mx-auto flex w-full flex-col pt-12 pb-10 sm:pt-14 md:min-h-screen md:pt-10">
        {/* Heading */}
        <header className="mb-8 px-4 text-center sm:mb-10">
          <p className="mb-2 text-xs font-light tracking-[0.25em] sm:text-sm">
            OUR
          </p>

          <h1 className="text-4xl font-light leading-none tracking-[0.08em] sm:text-5xl md:text-[76px]">
            JOURNEY
          </h1>
        </header>

        {/* Timeline */}
        <div className="relative mx-auto flex w-full min-w-0 flex-1 items-center">
          {/* Previous button */}
          <button
            type="button"
            aria-label="Previous milestone"
            onClick={() => scrollToItem(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#35101f]/90 text-xl transition hover:bg-white/10 disabled:opacity-30 sm:left-4 sm:h-11 sm:w-11 md:left-6"
          >
            ←
          </button>

          {/* Scrollable timeline */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="journey-scroll relative w-full min-w-0 overflow-x-auto overflow-y-hidden"
          >
            <div className="journey-track relative flex w-max gap-8 md:gap-12 lg:gap-16">
              {/* Timeline axis */}
              <div className="pointer-events-none absolute left-1/2 top-[270px] z-10 h-[2px] w-full -translate-x-1/2 bg-white/50 sm:top-[280px] md:top-[280px]" />

              {journeyItems.map((item, index) => (
                <div
                  key={`${item.year}-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="journey-item group relative h-[570px] w-[calc(100vw-32px)] shrink-0 snap-center sm:w-[calc(100vw-80px)] md:h-[600px] md:w-[320px] lg:w-[340px]"
                >
                  {/* Timeline point */}
                  <div className="absolute left-1/2 top-[266px] z-20 h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-white sm:top-[276px]" />

                  {/* Year */}
                  <div
                    className={`absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-center text-base font-light tracking-wide text-white sm:text-lg ${
                      item.position === "top"
                        ? "top-[240px] sm:top-[250px]"
                        : "top-[290px] sm:top-[300px]"
                    }`}
                  >
                    {item.year}
                  </div>

                  {/* Top milestone */}
                  {item.position === "top" && (
                    <>
                      <div className="absolute left-1/2 top-[120px] w-[min(250px,calc(100%-48px))] -translate-x-1/2 text-center sm:top-[45px] sm:w-[280px]">
                        <p className="text-xs font-light leading-relaxed text-[#b99850] sm:text-sm">
                          {item.text}
                        </p>
                      </div>

                      <div className="absolute left-1/2 top-[270px] h-[54px] w-px -translate-x-1/2 bg-white/40 sm:top-[280px] sm:h-[65px]" />

                      {item.image && (
                        <img
                          src={item.image}
                          alt={`Family Script milestone ${item.year}`}
                          loading="lazy"
                          className="absolute left-1/2 top-[324px] h-[150px] w-[150px] -translate-x-1/2 rounded-sm object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:top-[345px] sm:h-[175px] sm:w-[230px] md:h-[190px] md:w-[260px]"
                        />
                      )}
                    </>
                  )}

                  {/* Bottom milestone */}
                  {item.position === "bottom" && (
                    <>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={`Family Script milestone ${item.year}`}
                          loading="lazy"
                          className="absolute left-1/2 top-[30px] h-[150px] w-[150px] -translate-x-1/2 rounded-sm object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:top-[35px] sm:h-[175px] sm:w-[230px] md:h-[190px] md:w-[260px]"
                        />
                      )}

                      <div className="absolute left-1/2 top-[230px] h-[40px] w-px -translate-x-1/2 bg-white/40 sm:top-[240px]" />

                      <div className="absolute left-1/2 top-[350px] w-[min(250px,calc(100%-48px))] -translate-x-1/2 text-center sm:top-[360px] sm:w-[280px]">
                        <p className="text-xs font-light leading-relaxed text-[#b99850] sm:text-sm">
                          {item.text}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            type="button"
            aria-label="Next milestone"
            onClick={() => scrollToItem(activeIndex + 1)}
            disabled={activeIndex === journeyItems.length - 1}
            className="absolute right-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#35101f]/90 text-xl transition hover:bg-white/10 disabled:opacity-30 sm:right-4 sm:h-11 sm:w-11 md:right-6"
          >
            →
          </button>
        </div>

        
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .journey-scroll {
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
        }

        .journey-scroll::-webkit-scrollbar {
          display: none;
        }

        .journey-track {
          padding-inline: 0;
        }

        .journey-item {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}
