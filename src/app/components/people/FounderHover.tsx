"use client";

import { useState } from "react";

export type Founder = {
  name: string;
  role: string;
  description: string[];
  image: string;
  bio: string[];
  position: "left" | "right";
};

type FounderHoverProps = {
  founders: Founder[];
};

export default function FounderHover({
  founders,
}: FounderHoverProps) {
  const [activeFounder, setActiveFounder] = useState<number | null>(null);

  const handleEnter = (index: number) => {
    if (activeFounder !== null) return;
    setActiveFounder(index);
  };

  const handleLeave = () => {
    setActiveFounder(null);
  };

  return (
    <div
      onMouseLeave={handleLeave}
      className="relative mx-auto h-[560px] w-full max-w-[1100px]"
    >
      {/* =========================================================
          DEFAULT BORDER
      ========================================================= */}

      <div
        className={`absolute bottom-[5%] left-0 right-0 h-[48%] border border-white/30 transition-opacity duration-500 ${
          activeFounder !== null ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* LEFT DEFAULT INFO */}

        <div className="absolute left-[1.2%] top-[9%]">
          <p className="futura-light text-[14px] text-[#e7ad55] md:text-[15px]">
            {founders[0].role}
          </p>

          <div className="futura-light mt-5 text-[14px] leading-[1.45] text-white md:text-[15px]">
            {founders[0].description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        {/* RIGHT DEFAULT INFO */}

        <div className="absolute right-[1.2%] top-[9%] text-right">
          <p className="futura-light text-[14px] text-[#e7ad55] md:text-[15px]">
            {founders[1].role}
          </p>

          <div className="futura-light mt-5 text-[14px] leading-[1.45] text-white md:text-[15px]">
            {founders[1].description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          LEFT PERSON IMAGE
      ========================================================= */}

      <div
        onMouseEnter={() => handleEnter(0)}
        className={`absolute bottom-[3%] left-[16%] z-30 h-[72%] w-[30%] overflow-visible ${
          activeFounder === 1
            ? "pointer-events-none"
            : "cursor-pointer"
        }`}
      >
        <img
          src={founders[0].image}
          alt={founders[0].name}
          className={`absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain transition-all duration-700 ${
            activeFounder === 0
              ? "scale-[1.04] opacity-100"
              : activeFounder === 1
                ? "scale-[0.95] opacity-0"
                : "scale-100 opacity-100"
          }`}
        />
      </div>

      {/* =========================================================
          RIGHT PERSON IMAGE
      ========================================================= */}

      <div
        onMouseEnter={() => handleEnter(1)}
        className={`absolute bottom-[5%] right-[16%] z-30 h-[72%] w-[30%] overflow-visible ${
          activeFounder === 0
            ? "pointer-events-none"
            : "cursor-pointer"
        }`}
      >
        <img
          src={founders[1].image}
          alt={founders[1].name}
          className={`absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain transition-all duration-700 ${
            activeFounder === 1
              ? "scale-[1.04] opacity-100"
              : activeFounder === 0
                ? "scale-[0.95] opacity-0"
                : "scale-100 opacity-100"
          }`}
        />
      </div>

      {/* =========================================================
          LEFT PERSON HOVER
          POSITION → IMAGE → PARAGRAPH
      ========================================================= */}

      <div
        className={`absolute inset-0 z-40 transition-opacity duration-500 ${
          activeFounder === 0
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* POSITION — LEFT */}

        <div className="absolute left-[1.2%] top-[18%] w-[25%] text-left">
          <p className="futura-light text-[14px] text-[#e7ad55] md:text-[15px]">
            {founders[0].role}
          </p>

          <div className="futura-light mt-5 text-left text-[14px] leading-[1.45] text-white md:text-[15px]">
            {founders[0].description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        {/* PARAGRAPH — RIGHT / LEFT ALIGNED */}

        <div className="absolute right-[1%] top-[17%] w-[43%]">
          <div className="futura-light text-left text-[14px] leading-[1.35] tracking-[0.015em] text-white/85 md:text-[15px]">
            {founders[0].bio.map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* NAME */}

        <h2 className="futura-bold absolute bottom-[0%] left-[16%] text-[14px] tracking-[0.01em] text-[#e7ad55] md:text-[15px]">
          {founders[0].name}
        </h2>
      </div>

      {/* =========================================================
          RIGHT PERSON HOVER
          PARAGRAPH → IMAGE → POSITION
      ========================================================= */}

      <div
        className={`absolute inset-0 z-40 transition-opacity duration-500 ${
          activeFounder === 1
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* PARAGRAPH — LEFT / RIGHT ALIGNED */}

        <div className="absolute left-[1%] top-[17%] w-[47%]">
          <div className="futura-light text-right text-[14px] leading-[1.35] tracking-[0.015em] text-white/85 md:text-[15px]">
            {founders[1].bio.map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* POSITION — RIGHT */}

        <div className="absolute right-[1.2%] top-[18%] w-[25%] text-right">
          <p className="futura-light text-[14px] text-[#e7ad55] md:text-[15px]">
            {founders[1].role}
          </p>

          <div className="futura-light mt-5 text-right text-[14px] leading-[1.45] text-white md:text-[15px]">
            {founders[1].description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        {/* NAME */}

        <h2 className="futura-bold absolute bottom-[0%] right-[18%] text-[14px] tracking-[0.01em] text-[#e7ad55] md:text-[15px]">
          {founders[1].name}
        </h2>
      </div>

      {/* =========================================================
          DEFAULT NAMES
      ========================================================= */}

      <div
        className={`absolute bottom-[0%] left-0 right-0 z-50 flex justify-center transition-opacity duration-400 ${
          activeFounder !== null
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }`}
      >
        <div className="flex w-[58%] justify-between">

          <h2 className="futura-bold text-[14px] tracking-[0.01em] text-[#e7ad55] md:text-[15px]">
            {founders[0].name}
          </h2>

          <h2 className="futura-bold text-[14px] tracking-[0.01em] text-[#e7ad55] md:text-[15px]">
            {founders[1].name}
          </h2>

        </div>
      </div>

    </div>
  );
}