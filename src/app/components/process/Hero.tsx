"use client";

import Link from "next/link";
import { useState } from "react";
import SocialIcons from "../layout/SocialIcos";

interface ProcessStep {
  title: string;
  description: string;
  number: string;
  icon: string;
  image: string;
}

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "CONNECTION AND RECORDING THE INTERVIEWS",
    description:
      "In this initial phase, Family Script conducts physical interviews, ensuring a meticulous capture of personal narratives and oral histories. Through these interactions, interviewers extract narratives, emotions, and memories from participants, laying the groundwork for the documentation process.",
    icon: "/process-icons/process-1.svg",
    image: "/process-images/process-1.png",
  },
  {
    number: "02",
    title: "TRANSCRIPTION OF INTERVIEWS",
    description:
      "Following the interviews, transcription transforms audio recordings into written text. This crucial step ensures accessibility and facilitates further analysis and content generation, providing a textual foundation for the subsequent stages of the process.",
    icon: "/process-icons/process-2.svg",
    image: "/process-images/process-2.png",
  },
  {
    number: "03",
    title: "ARCHIVAL ASSESSMENT",
    description:
      "Family Script conducts archival assessments, examining photographs, letters, handwritten notes, documents and any material memory available. These artifacts are evaluated, ensuring their preservation and integration into the narrative framework.",
    icon: "/process-icons/process-3.svg",
    image: "/process-images/process-3.png",
  },
  {
    number: "04",
    title: "NARRATIVE DEVELOPMENT",
    description:
      "Through conceptualization, storyboarding, and narrative development, Family Script breathes life into raw data. Skilled storytellers weave together disparate elements, crafting comprehensive narratives that resonate with depths and entirety their essence.",
    icon: "/process-icons/process-4.svg",
    image: "/process-images/process-4.png",
  },
  {
    number: "05",
    title: "DATA SEGREGATION AND CHAPTERIZATION",
    description:
      "Data segmentation and chapterization form the backbone of narrative organization. By categorizing and structuring content, we create a cohesive framework, facilitating seamless transitions and enhancing readability for both books and videos.",
    icon: "/process-icons/process-5.svg",
    image: "/process-images/process-5.png",
  },
  {
    number: "06",
    title: "DESIGN DEVELOPMENT - CREATING VISUAL COHESION",
    description:
      "Layout generation and formatting transform textual content into visually engaging formats. Attention to detail is paramount as we design layouts, selecting fonts, colors, and imagery to communicate content and enhance aesthetic appeal.",
    icon: "/process-icons/process-6.svg",
    image: "/process-images/process-6.png",
  },
  {
    number: "07",
    title: "FINAL ASSESSMENT AND QUALITY CHECK",
    description:
      "Rigorous quality checks ensure that every aspect of the project meets the exacting standards. From narrative coherence to visual presentation, meticulous scrutiny guarantees a final product of unparalleled excellence in tandem with the client's choice.",
    icon: "/process-icons/process-7.svg",
    image: "/process-images/process-7.png",
  },
  {
    number: "08",
    title: "COMPILATION OF BOOKS AND VIDEOS",
    description:
      "In this pivotal stage, Family Script compiles books and videos, integrating multimodal content into cohesive deliverables. Seamlessly weaving together textual narratives, visual elements, and audiovisual components, the final products emerge as immersive and captivating experiences.",
    icon: "/process-icons/process-8.svg",
    image: "/process-images/process-8.png",
  },
  {
    number: "09",
    title: "PRODUCT DELIVERY",
    description:
      "With the completion of the production process, we deliver the finished products to the clients. Whether in printed form or digital format, each deliverable represents the culmination of meticulous planning, creative vision, and dedication to preserving and sharing stories.",
    icon: "/process-icons/process-9.svg",
    image: "/process-images/process-9.png",
  },
];

/* ------------------------------------------------------------------ */
/*  ATMOSPHERIC OMBRÉ SYSTEM                                          */
/* ------------------------------------------------------------------ */

type Layer = {
  x: number;
  y: number;
  color: string;
  opacity: number;
  w?: number;
  h?: number;
  fade?: number;
};

const BASE = "#421C2A";

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

function buildOmbre(layers: Layer[], base: string = BASE): string {
  const radials = layers
    .map((l) => {
      const w = l.w ?? 140;
      const h = l.h ?? 55;
      const fade = l.fade ?? 72;

      return `radial-gradient(ellipse ${w}% ${h}% at ${l.x}% ${l.y}%, rgba(${hexToRgb(
        l.color,
      )}, ${l.opacity}) 0%, transparent ${fade}%)`;
    })
    .join(",\n      ");

  return `${radials},\n      ${base}`;
}

function intensify(layers: Layer[], boost = 0.12): Layer[] {
  return layers.map((l) => ({
    ...l,
    opacity: Math.min(l.opacity + boost, 0.95),
  }));
}

/* ------------------------------------------------------------------ */
/*  CARD GRADIENT FAMILIES                                            */
/* ------------------------------------------------------------------ */

// Card 1 / Card 6
const familyA: Layer[] = [
  {
    x: 50,
    y: 6,
    color: "#776B67",
    opacity: 0.68,
    w: 150,
    h: 34,
    fade: 70,
  },
  {
    x: 46,
    y: 27,
    color: "#97794F",
    opacity: 0.72,
    w: 145,
    h: 42,
    fade: 70,
  },
  {
    x: 54,
    y: 47,
    color: "#88693D",
    opacity: 0.6,
    w: 150,
    h: 44,
    fade: 72,
  },
  {
    x: 50,
    y: 68,
    color: "#654E2E",
    opacity: 0.62,
    w: 150,
    h: 42,
    fade: 74,
  },
  {
    x: 50,
    y: 88,
    color: "#563632",
    opacity: 0.65,
    w: 150,
    h: 36,
    fade: 70,
  },
  {
    x: 50,
    y: 102,
    color: "#4F2835",
    opacity: 0.8,
    w: 160,
    h: 40,
    fade: 62,
  },
];

// Card 2 / Card 7
const familyB: Layer[] = [
  {
    x: 50,
    y: 8,
    color: "#896441",
    opacity: 0.68,
    w: 150,
    h: 34,
    fade: 70,
  },
  {
    x: 44,
    y: 28,
    color: "#6E483B",
    opacity: 0.58,
    w: 145,
    h: 40,
    fade: 72,
  },
  {
    x: 52,
    y: 50,
    color: "#4A2333",
    opacity: 0.72,
    w: 155,
    h: 46,
    fade: 70,
  },
  {
    x: 48,
    y: 70,
    color: "#6D4C3A",
    opacity: 0.55,
    w: 150,
    h: 42,
    fade: 74,
  },
  {
    x: 50,
    y: 86,
    color: "#78614D",
    opacity: 0.5,
    w: 150,
    h: 36,
    fade: 74,
  },
  {
    x: 50,
    y: 102,
    color: "#736A67",
    opacity: 0.6,
    w: 160,
    h: 36,
    fade: 66,
  },
];

const familyB2: Layer[] = [
  {
    x: 50,
    y: 8,
    color: "#896441",
    opacity: 0.68,
    w: 150,
    h: 34,
    fade: 70,
  },
  {
    x: 46,
    y: 30,
    color: "#6F483C",
    opacity: 0.55,
    w: 145,
    h: 40,
    fade: 72,
  },
  {
    x: 52,
    y: 50,
    color: "#7A6670",
    opacity: 0.6,
    w: 155,
    h: 46,
    fade: 72,
  },
  {
    x: 48,
    y: 70,
    color: "#6E4C3A",
    opacity: 0.55,
    w: 150,
    h: 42,
    fade: 74,
  },
  {
    x: 50,
    y: 86,
    color: "#78614D",
    opacity: 0.5,
    w: 150,
    h: 36,
    fade: 74,
  },
  {
    x: 50,
    y: 102,
    color: "#716967",
    opacity: 0.58,
    w: 160,
    h: 36,
    fade: 66,
  },
];

// Card 3 / Card 8
const familyC: Layer[] = [
  {
    x: 48,
    y: 6,
    color: "#695D61",
    opacity: 0.62,
    w: 150,
    h: 32,
    fade: 70,
  },
  {
    x: 54,
    y: 24,
    color: "#8C8788",
    opacity: 0.5,
    w: 130,
    h: 30,
    fade: 68,
  },
  {
    x: 50,
    y: 48,
    color: "#563332",
    opacity: 0.68,
    w: 155,
    h: 46,
    fade: 72,
  },
  {
    x: 46,
    y: 68,
    color: "#745A35",
    opacity: 0.58,
    w: 150,
    h: 42,
    fade: 74,
  },
  {
    x: 50,
    y: 86,
    color: "#9A7846",
    opacity: 0.65,
    w: 150,
    h: 38,
    fade: 72,
  },
  {
    x: 50,
    y: 102,
    color: "#8D6E43",
    opacity: 0.68,
    w: 160,
    h: 34,
    fade: 64,
  },
];

const familyC2: Layer[] = [
  {
    x: 48,
    y: 6,
    color: "#685C60",
    opacity: 0.6,
    w: 150,
    h: 32,
    fade: 70,
  },
  {
    x: 54,
    y: 26,
    color: "#573845",
    opacity: 0.55,
    w: 140,
    h: 34,
    fade: 70,
  },
  {
    x: 50,
    y: 48,
    color: "#6B4D4C",
    opacity: 0.55,
    w: 150,
    h: 44,
    fade: 72,
  },
  {
    x: 46,
    y: 68,
    color: "#735935",
    opacity: 0.58,
    w: 150,
    h: 42,
    fade: 74,
  },
  {
    x: 50,
    y: 86,
    color: "#9B7948",
    opacity: 0.68,
    w: 150,
    h: 38,
    fade: 72,
  },
  {
    x: 50,
    y: 102,
    color: "#8D6E45",
    opacity: 0.7,
    w: 160,
    h: 34,
    fade: 64,
  },
];

// Card 4 / Card 9
const familyD: Layer[] = [
  {
    x: 50,
    y: 6,
    color: "#77543C",
    opacity: 0.62,
    w: 150,
    h: 32,
    fade: 70,
  },
  {
    x: 46,
    y: 24,
    color: "#745637",
    opacity: 0.5,
    w: 145,
    h: 34,
    fade: 70,
  },
  {
    x: 54,
    y: 42,
    color: "#5E442E",
    opacity: 0.55,
    w: 150,
    h: 38,
    fade: 72,
  },
  {
    x: 50,
    y: 58,
    color: "#4D2732",
    opacity: 0.7,
    w: 155,
    h: 44,
    fade: 70,
  },
  {
    x: 48,
    y: 78,
    color: "#5B444E",
    opacity: 0.55,
    w: 150,
    h: 40,
    fade: 74,
  },
  {
    x: 50,
    y: 100,
    color: "#6B6366",
    opacity: 0.55,
    w: 160,
    h: 34,
    fade: 66,
  },
];

const familyD2: Layer[] = [
  {
    x: 50,
    y: 6,
    color: "#77543B",
    opacity: 0.62,
    w: 150,
    h: 32,
    fade: 70,
  },
  {
    x: 46,
    y: 24,
    color: "#745638",
    opacity: 0.5,
    w: 145,
    h: 34,
    fade: 70,
  },
  {
    x: 54,
    y: 42,
    color: "#5E442F",
    opacity: 0.55,
    w: 150,
    h: 38,
    fade: 72,
  },
  {
    x: 50,
    y: 58,
    color: "#4C2632",
    opacity: 0.7,
    w: 155,
    h: 44,
    fade: 70,
  },
  {
    x: 48,
    y: 78,
    color: "#5C464F",
    opacity: 0.55,
    w: 150,
    h: 40,
    fade: 74,
  },
  {
    x: 50,
    y: 100,
    color: "#6B6367",
    opacity: 0.55,
    w: 160,
    h: 34,
    fade: 66,
  },
];

// Card 5
const cardFiveWide: Layer[] = [
  {
    x: 30,
    y: 14,
    color: "#6F4C3A",
    opacity: 0.55,
    w: 90,
    h: 46,
    fade: 72,
  },
  {
    x: 72,
    y: 10,
    color: "#6F4C3A",
    opacity: 0.5,
    w: 85,
    h: 42,
    fade: 74,
  },
  {
    x: 50,
    y: 45,
    color: "#45242D",
    opacity: 0.75,
    w: 130,
    h: 62,
    fade: 70,
  },
  {
    x: 40,
    y: 45,
    color: "#4A2B2F",
    opacity: 0.5,
    w: 90,
    h: 48,
    fade: 74,
  },
  {
    x: 50,
    y: 72,
    color: "#6C4D39",
    opacity: 0.5,
    w: 110,
    h: 40,
    fade: 74,
  },
  {
    x: 50,
    y: 96,
    color: "#5F493C",
    opacity: 0.55,
    w: 130,
    h: 34,
    fade: 68,
  },
  {
    x: 50,
    y: 104,
    color: "#453A3A",
    opacity: 0.5,
    w: 140,
    h: 30,
    fade: 64,
  },
];

const cardLayerSets: Layer[][] = [
  familyA,
  familyB,
  familyC,
  familyD,
  cardFiveWide,
  familyA,
  familyB2,
  familyC2,
  familyD2,
];

const cardGradients = cardLayerSets.map((layers) => ({
  collapsed: buildOmbre(layers),
  active: buildOmbre(intensify(layers)),
}));

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const CARD_DURATION = 400;
const REVEAL_DELAY = CARD_DURATION;
const REVEAL_DURATION = 200;
const HIDE_DURATION = 150;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen w-full bg-[#532439] text-[#F4F0E9]">
      <SocialIcons />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 pb-16 pt-[150px] md:px-[4%]">
        {/* PAGE TITLE */}
        <div className="flex justify-center text-center">
          <h1 className="flex items-baseline justify-center whitespace-nowrap uppercase leading-none tracking-[0.055em] text-[#F4F0E9]">
            <span
              className="futura-light"
              style={{
                fontSize: 52,
                lineHeight: 1,
              }}
            >
              Our
            </span>

            <span
              className="futura-medium"
              style={{
                fontSize: 48,
                lineHeight: 1,
                marginLeft: 16,
              }}
            >
              Process
            </span>
          </h1>
        </div>

        {/* PROCESS CARDS */}
        <div
          className="mx-auto mt-[72px] flex h-[360px] w-full items-stretch justify-center gap-[32px]"
          onMouseLeave={() => setActiveIndex(null)}
        >
          {processSteps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={step.number}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={(event) => {
                  if (
                    !event.currentTarget.parentElement?.contains(
                      event.relatedTarget as Node,
                    )
                  ) {
                    setActiveIndex(null);
                  }
                }}
                className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[7px] border border-white/[0.14] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.12),inset_0_-1px_0_rgba(0,0,0,.16),0_10px_30px_rgba(25,15,25,.10)] backdrop-blur-[14px] focus-visible:ring-1 focus-visible:ring-[#CBA356]/70"
                style={{
                  flex: isActive ? "0 0 360px" : "0 0 72px",

                  background: isActive
                    ? cardGradients[index].active
                    : cardGradients[index].collapsed,

                  transition: `flex-basis ${CARD_DURATION}ms ${EASE}, background ${CARD_DURATION}ms ease, box-shadow ${CARD_DURATION}ms ease`,
                }}
              >
                {/* -------------------------------------------------- */}
                {/* COLLAPSED CARD                                     */}
                {/* -------------------------------------------------- */}

                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity: isActive ? 0 : 1,

                    transition: `opacity ${
                      isActive ? HIDE_DURATION : REVEAL_DURATION
                    }ms ease ${isActive ? 0 : REVEAL_DELAY}ms`,

                    pointerEvents: isActive ? "none" : "auto",
                  }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-between py-[22px]">
                    <span className="sr-only">{step.number}</span>

                    <span
                      className="futura-light block w-[56px] text-center text-[10px] uppercase leading-[1.55] tracking-[0.25em] text-[#F4F0E9]"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {step.title}
                    </span>

                    <img
                      src={step.icon}
                      alt=""
                      aria-hidden="true"
                      className="h-[22px] w-[22px] object-contain opacity-90"
                    />
                  </div>
                </div>

                {/* -------------------------------------------------- */}
                {/* EXPANDED CARD                                      */}
                {/* -------------------------------------------------- */}

                <div
                  className="absolute inset-0"
                  style={{
                    opacity: isActive ? 1 : 0,

                    transform: isActive
                      ? "translateY(0)"
                      : "translateY(10px)",

                    transition: `opacity ${
                      isActive ? REVEAL_DURATION : HIDE_DURATION
                    }ms ease ${
                      isActive ? REVEAL_DELAY : 0
                    }ms, transform ${
                      isActive ? REVEAL_DURATION : HIDE_DURATION
                    }ms ${EASE} ${isActive ? REVEAL_DELAY : 0}ms`,

                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div className="flex h-full w-[360px] flex-col overflow-hidden rounded-[7px]">
                    {/* ------------------------------------------------ */}
                    {/* TOP IMAGE                                        */}
                    {/* ------------------------------------------------ */}

                    <div className="relative h-[175px] w-full shrink-0 overflow-hidden">
                      <img
                        src={step.image}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                      />

                      {/* IMAGE → CARD FADE */}
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[85px]"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 0%, rgba(66,28,42,0.2) 25%, rgba(66,28,42,0.65) 65%, #421C2A 100%)",
                        }}
                      />

                      {/* TOP DARKENING */}
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-[45px]"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(20,10,15,0.25), transparent)",
                        }}
                      />

                      {/* ICON */}
                      <div className="absolute right-[22px] top-[22px]">
                        <img
                          src={step.icon}
                          alt=""
                          aria-hidden="true"
                          className="h-[31px] w-[31px] object-contain opacity-90"
                        />
                      </div>
                    </div>

                    {/* ------------------------------------------------ */}
                    {/* TEXT CONTENT                                     */}
                    {/* ------------------------------------------------ */}

                    <div className="flex min-h-0 flex-1 flex-col px-[32px] pb-[22px] pt-[2px] md:px-[38px]">
                      <div className="mt-auto">
                        <h2 className="futura-medium text-[19px] uppercase leading-[1.25] tracking-[0.025em] text-[#CBA356]">
                          {step.title}
                        </h2>

                        <p className="futura-light mt-4 text-[11.5px] leading-[1.58] tracking-[0.01em] text-[#F4F0E9]">
                          {step.description}
                        </p>
                      </div>

                    
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-auto flex justify-center pt-14">
          <Link
            href="#"
            className="futura-light group inline-flex items-center rounded-full border border-[#CBA356]/50 bg-white/[0.055] px-9 py-3 text-[13px] tracking-wide text-[#F4F0E9] backdrop-blur-md transition-all duration-300 hover:bg-[#CBA356]/10"
          >
            Get your Story{" "}
            <span className="futura-bold ml-1">Scripted</span>

            <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
              &gt;&gt;
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}