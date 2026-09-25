"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SocialIcons from "../layout/SocialIcos";

interface ProcessStep {
  title: string;
  description: string;
  number: string;
  icon: string;
  imageDesktop: string;
  imageMobile: string;
}

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "CONDUCTION AND RECORDING THE INTERVIEWS",
    description:
      "In this initial phase, Family Script conducts physical interviews, ensuring a meticulous capture of personal narratives and oral histories. Through these interactions, interviewers extract narratives, emotions, and memories from participants, laying the groundwork for the documentation process.",
    icon: "/process-icons/process-1.svg",
    imageDesktop: "/assets/process/01_DESKTOP.jpg",
    imageMobile: "/assets/process/01_DESKTOP.jpg",
  },
  {
    number: "02",
    title: "TRANSCRIPTION OF INTERVIEWS",
    description:
      "Following the interviews, transcription transforms audio recordings into written text. This crucial step ensures accessibility and facilitates further analysis and content generation, providing a textual foundation for the subsequent stages of the process.",
    icon: "/process-icons/process-2.svg",
    imageDesktop: "/assets/process/02_DESKTOP.png",
    imageMobile: "/assets/process/02_DESKTOP.png",
  },
  {
    number: "03",
    title: "ARCHIVAL ASSESSMENT",
    description:
      "Family Script conducts archival assessments, examining photographs, letters, handwritten notes, documents and any material memory available. These artifacts are evaluated, ensuring their preservation and integration into the narrative framework.",
    icon: "/process-icons/process-3.svg",
    imageDesktop: "/assets/process/03_DESKTOP.jpeg",
    imageMobile: "/assets/process/03_DESKTOP.jpeg",
  },
  {
    number: "04",
    title: "NARRATIVE DEVELOPMENT",
    description:
      "Through conceptualization, storyboarding, and narrative development, Family Script breathes life into raw data. Skilled storytellers weave together disparate elements, crafting comprehensive narratives that resonate with depths and entirety their essence.",
    icon: "/process-icons/process-4.svg",
    imageDesktop: "/assets/process/04_DESKTOP.jpeg",
    imageMobile: "/assets/process/04_MOBILE.jpeg",
  },
  {
    number: "05",
    title: "DATA SEGREGATION AND CHAPTERIZATION",
    description:
      "Data segmentation and chapterization form the backbone of narrative organization. By categorizing and structuring content, we create a cohesive framework, facilitating seamless transitions and enhancing readability for both books and videos.",
    icon: "/process-icons/process-5.svg",
    imageDesktop: "/assets/process/05_DESKTOP.jpeg",
    imageMobile: "/assets/process/05_DESKTOP.jpeg",
  },
  {
    number: "06",
    title: "DESIGN DEVELOPMENT - CREATING VISUAL COHESION",
    description:
      "Layout generation and formatting transform textual content into visually engaging formats. Attention to detail is paramount as we design layouts, selecting fonts, colors, and imagery to communicate content and enhance aesthetic appeal.",
    icon: "/process-icons/process-6.svg",
    imageDesktop: "/assets/process/06_DESKTOP.png",
    imageMobile: "/assets/process/06_DESKTOP.png",
  },
  {
    number: "07",
    title: "FINAL ASSESSMENT AND QUALITY CHECK",
    description:
      "Rigorous quality checks ensure that every aspect of the project meets the exacting standards. From narrative coherence to visual presentation, meticulous scrutiny guarantees a final product of unparalleled excellence in tandem with the client's choice.",
    icon: "/process-icons/process-7.svg",
    imageDesktop: "/assets/process/07_DESKTOP.jpeg",
    imageMobile: "/assets/process/07_DESKTOP.jpeg",
  },
  {
    number: "08",
    title: "COMPILATION OF BOOKS AND VIDEOS",
    description:
      "In this pivotal stage, Family Script compiles books and videos, integrating multimodal content into cohesive deliverables. Seamlessly weaving together textual narratives, visual elements, and audiovisual components, the final products emerge as immersive and captivating experiences.",
    icon: "/process-icons/process-8.svg",
    imageDesktop: "/assets/process/08_DESKTOP.jpeg",
    imageMobile: "/assets/process/08_DESKTOP.jpeg",
  },
  {
    number: "09",
    title: "PRODUCT DELIVERY",
    description:
      "With the completion of the production process, we deliver the finished products to the clients. Whether in printed form or digital format, each deliverable represents the culmination of meticulous planning, creative vision, and dedication to preserving and sharing stories.",
    icon: "/process-icons/process-9.svg",
    imageDesktop: "/assets/process/09_DESKTOP.jpeg",
    imageMobile: "/assets/process/09_DESKTOP.jpeg",
  },
];

/* ------------------------------------------------------------------ */
/* ATMOSPHERIC OMBRÉ SYSTEM                                           */
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
/* CARD GRADIENT FAMILIES                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* MOBILE GRADIENTS                                                   */
/* ------------------------------------------------------------------ */

const mobileCollapsedGradients = [
  "linear-gradient(90deg, #585556 0%, #5C414B 22%, #4D293C 45%, #573842 68%, #6A5D60 100%)",
  "linear-gradient(90deg, #686162 0%, #5F444F 22%, #4D293C 46%, #57373F 70%, #71543F 100%)",
  "linear-gradient(90deg, #695F62 0%, #5D4952 20%, #51303F 43%, #644735 68%, #926a3d 100%)",
  "linear-gradient(90deg, #65504A 0%, #5D3B42 23%, #612f44 46%, #57383F 70%, #5F575B 100%)",
  "linear-gradient(90deg, #7a554a 0%, #533338 24%, #42232E 48%, #5a423b 72%, #6b524b 100%)",
  "linear-gradient(90deg, #61585b 0%, #5C414B 22%, #4D293C 45%, #573842 68%, #6A5D60 100%)",
  "linear-gradient(90deg, #6A6062 0%, #5F444F 22%, #4D293C 46%, #57373F 70%, #67564F 100%)",
  "linear-gradient(90deg, #685D61 0%, #5D4551 22%, #50303E 45%, #644735 68%, #845F3E 100%)",
  "linear-gradient(90deg, #654D46 0%, #5C3940 23%, #4B2735 47%, #56383F 70%, #5F575B 100%)",
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const CARD_DURATION = 400;
const REVEAL_DELAY = CARD_DURATION;
const REVEAL_DURATION = 200;
const HIDE_DURATION = 150;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <main
      className="relative min-h-screen w-full text-[#F4F0E9]"
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
   <div className="pointer-events-none absolute left-0 top-0 z-10 h-40 w-full bg-gradient-to-b from-black/40 via-black/15 to-transparent md:h-56" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-[22px] pb-10 pt-[55px] sm:px-6 sm:pt-[70px] md:px-[4%] md:pb-16 md:pt-[150px]">

        {/* PAGE TITLE */}

        <div className="flex justify-center text-center">
          <h1 className="flex items-baseline justify-center whitespace-nowrap uppercase leading-none tracking-[0.055em] text-[#F4F0E9]">
            <span
              className="futura-light"
              style={{
                fontSize: "clamp(32px, 8vw, 51px)",
                lineHeight: 1,
              }}
            >
              Our
            </span>

            <span
              className="futura-medium"
              style={{
                fontSize: "clamp(37px, 9vw, 58px)",
                lineHeight: 1,
                marginLeft: "clamp(9px, 2.5vw, 16px)",
              }}
            >
              Process
            </span>
          </h1>
        </div>

        {/* PROCESS CARDS */}

        <div
          className="
            mx-auto
            mt-[30px]
            flex
            w-[250px]
            flex-col
            items-center
            justify-start
            gap-[12px]

            md:mt-[72px]
            md:h-[400px]
            md:w-full
            md:max-w-[1000px]
            md:flex-row
            md:items-stretch
            md:justify-center
            md:gap-[32px]
          "
          onMouseLeave={() => {
            if (canHover) setActiveIndex(null);
          }}
        >
          {processSteps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={step.number}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                onMouseEnter={() => {
                  if (canHover) setActiveIndex(index);
                }}
                onClick={() =>
                  setActiveIndex((current) =>
                    current === index ? null : index,
                  )
                }
                onFocus={() => {
                  if (canHover) setActiveIndex(index);
                }}
                onBlur={(event) => {
                  if (!canHover) return;
                  if (
                    !event.currentTarget.parentElement?.contains(
                      event.relatedTarget as Node,
                    )
                  ) {
                    setActiveIndex(null);
                  }
                }}
                className="
                  group
                  relative
                  w-full
                  cursor-pointer
                  overflow-hidden
                  rounded-[5px]
                  border
                  border-white/[0.14]
                  outline-none
                  shadow-[inset_0_1px_0_rgba(255,255,255,.12),inset_0_-1px_0_rgba(0,0,0,.16),0_10px_30px_rgba(25,15,25,.10)]
                  backdrop-blur-[14px]
                  focus-visible:ring-1
                  focus-visible:ring-[#CBA356]/70

                  h-[58px]

                  md:min-h-0
                  md:min-w-0
                  md:h-full
                  md:w-auto
                  md:[--active-card-size:360px]
                  md:[--collapsed-card-size:72px]

                  [--active-card-size:150px]
                  [--collapsed-card-size:42px]
                "
                style={{
                  flex: isActive
                    ? "0 0 var(--active-card-size)"
                    : "0 0 var(--collapsed-card-size)",

                  transition: `
                    flex-basis ${CARD_DURATION}ms ${EASE},
                    background ${CARD_DURATION}ms ease,
                    box-shadow ${CARD_DURATION}ms ease
                  `,
                }}
              >
                {/* MOBILE GRADIENT */}

                <div
                  className="pointer-events-none absolute inset-0 md:hidden"
                  style={{
                    background: mobileCollapsedGradients[index],
                  }}
                />

                {/* DESKTOP GRADIENT */}

                <div
                  className="pointer-events-none absolute inset-0 hidden md:block"
                  style={{
                    background: isActive
                      ? cardGradients[index].active
                      : cardGradients[index].collapsed,
                  }}
                />

                {/* ================================================= */}
                {/* COLLAPSED CARD                                    */}
                {/* ================================================= */}

                <div
                  className="absolute inset-0"
                  style={{
                    opacity: isActive ? 0 : 1,
                    transition: `opacity ${
                      isActive ? HIDE_DURATION : REVEAL_DURATION
                    }ms ease ${isActive ? 0 : REVEAL_DELAY}ms`,
                    pointerEvents: isActive ? "none" : "auto",
                  }}
                >
                  <div className="relative h-full w-full">

                    <span className="sr-only">
                      {step.number}
                    </span>

                    {/* ================================================= */}
                    {/* MOBILE TITLE - LEFT ALIGNED                        */}
                    {/* ================================================= */}

                    <div className="absolute left-[10px] top-1/2 -translate-y-1/2 md:hidden">
                    <span className="futura-medium block w-[150px] text-left text-[7px] uppercase leading-[1.2] tracking-[0.22em] text-[#F4F0E9]">
  {step.title}
</span>
                    </div>

                    {/* ================================================= */}
                    {/* DESKTOP TITLE                                     */}
                    {/* ================================================= */}

                    <div className="absolute left-1/2 top-[22px] hidden -translate-x-1/2 md:block">
                      <span
                        className="futura-light block text-[12px] uppercase leading-[1.55] tracking-[0.25em] text-[#F4F0E9]"
                        style={{
                          writingMode: "vertical-rl",
                          height: "250px",
                          width: "max-content",
                          maxWidth: "60px",
                          textAlign: "left",
                        }}
                      >
                        {step.title}
                      </span>
                    </div>

                    {/* ICON */}

                    <img
                      src={step.icon}
                      alt=""
                      aria-hidden="true"
                      className="
                        absolute
                        right-[7px]
                        top-1/2
                        h-[10px]
                        w-[10px]
                        -translate-y-1/2
                        object-contain
                        opacity-90

                        md:bottom-[22px]
                        md:left-1/2
                        md:right-auto
                        md:top-auto
                        md:h-[22px]
                        md:w-[22px]
                        md:-translate-x-1/2
                        md:translate-y-0
                      "
                    />

                  </div>
                </div>

                {/* ================================================= */}
                {/* EXPANDED CARD                                      */}
                {/* ================================================= */}

                <div
                  className="absolute inset-0 z-20"
                  style={{
                    opacity: isActive ? 1 : 0,

                    transform: isActive
                      ? "translateY(0)"
                      : "translateY(10px)",

                    transition: `
                      opacity ${
                        isActive ? REVEAL_DURATION : HIDE_DURATION
                      }ms ease ${
                        isActive ? REVEAL_DELAY : 0
                      }ms,

                      transform ${
                        isActive ? REVEAL_DURATION : HIDE_DURATION
                      }ms ${EASE} ${
                        isActive ? REVEAL_DELAY : 0
                      }ms
                    `,

                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >

                  {/* ================================================= */}
                  {/* MOBILE EXPANDED CARD                              */}
                  {/* ================================================= */}

                  <div className="flex h-full w-full flex-col overflow-hidden rounded-[5px] md:hidden">

                    {/* IMAGE */}

                    <div className="relative h-[58%] min-h-0 w-full shrink-0 overflow-hidden">

                      <img
                        src={step.imageMobile}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      {/* IMAGE FADE */}

                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28px]"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 0%, rgba(66,28,42,0.3) 45%, rgba(66,28,42,0.8) 100%)",
                        }}
                      />

                      {/* TOP DARKENING */}

                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-[20px]"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(20,10,15,0.3), transparent)",
                        }}
                      />

                      {/* ICON */}

                      <div className="absolute right-[8px] top-[8px]">
                        <img
                          src={step.icon}
                          alt=""
                          aria-hidden="true"
                          className="h-[11px] w-[11px] object-contain opacity-90"
                        />
                      </div>

                    </div>

                    {/* TEXT */}

                    <div
                      className="relative z-30 flex min-h-0 flex-1 w-full flex-col overflow-hidden px-[9px] pb-[7px] pt-[6px]"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(78,38,48,0.98) 0%, rgba(89,46,49,0.98) 45%, rgba(103,67,48,0.98) 100%)",
                      }}
                    >

                      <h2 className="futura-medium shrink-0 text-[8px] uppercase leading-[1.25] tracking-[0.025em] text-[#CBA356]">
                        {step.title}
                      </h2>

                      <p className="futura-light mt-[4px] overflow-hidden text-[6px] leading-[1.4] tracking-[0.01em] text-[#F4F0E9]">
                        {step.description}
                      </p>

                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* DESKTOP EXPANDED CARD                             */}
                  {/* ================================================= */}

                  <div className="hidden h-full w-full md:flex md:flex-col">

                    <div className="relative h-[175px] w-full shrink-0 overflow-hidden rounded-[7px]">

                      <img
                        src={step.imageDesktop}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                      />

                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[85px]"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 0%, rgba(66,28,42,0.2) 25%, rgba(66,28,42,0.65) 65%, #421C2A 100%)",
                        }}
                      />

                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-[45px]"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(20,10,15,0.25), transparent)",
                        }}
                      />

                      <div className="absolute right-[22px] top-[22px]">
                        <img
                          src={step.icon}
                          alt=""
                          aria-hidden="true"
                          className="h-[31px] w-[31px] object-contain opacity-90"
                        />
                      </div>

                    </div>

                    <div className="flex min-h-0 flex-1 flex-col px-[38px] pb-[18px] pt-[2px]">

                      <div className="mt-[20px]">

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

        {/* ========================================================= */}
        {/* CTA                                                       */}
        {/* ========================================================= */}

        <div className="mt-auto flex justify-center pt-8 md:pt-14">
          <Link href="#" className="global-cta">
            Get your Story Scripted&nbsp;&nbsp;&gt;&gt;
          </Link>
        </div>

      </section>
    </main>
  );
}