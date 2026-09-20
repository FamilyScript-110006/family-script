"use client";

import React from "react";

const JOURNEY_IMAGE = "/assets/journey/journey.jpg";

type JourneyItem = {
  year: string;
  text: string;
  position: "top" | "bottom";
  image?: string;

  textTop?: string;
  textLeft?: string;
};

const journeyItems: JourneyItem[] = [
  {
    year: "2015",
    text: "Two friends, Kshitij and Rishi, envisioned bringing memories out of wardrobes to celebrate family legacies, giving birth to Family Script.",
    position: "bottom",
    image: "/assets/OurJourney/2019.jpg",
    textTop: "135px",
    textLeft: "40px",
  },

  {
    year: "2017",
    text: "Incubated at IGDTUW-Anveshan Foundation and formally registered as Prarabdha Info Solutions Private Limited, marking Family Script’s first institutional milestone.",
    position: "top",
    image: "/assets/OurJourney/2017.jpg",
    textTop: "20px",
    textLeft: "-40px",
  },

  {
    year: "2018",
    text: "Selected among India’s top 16 from 400 applicants, Family Script received three months of entrepreneurship training and mentorship from the University of Texas at Austin, USA.",
    position: "bottom",
    image: "/assets/OurJourney/2018.jpeg",
    textTop: "245px",
    textLeft: "-19px",
  },

  {
    year: "2019",
    text: "Our first 8+ analogue projects tested the waters, transforming personal milestones and intimate family memories into meaningful, tangible legacies.",
    position: "top",
    image: "/assets/OurJourney/2019.jpg",
    textTop: "130px",
    textLeft: "-10px",
  },

  {
    year: "2020 - 2022",
    text: "A period of reflection and family time, amidst difficult circumstances, deepened our belief in preserving oral histories before they are lost.",
    position: "bottom",
    image: "/assets/OurJourney/2020-2022.jpg",
    textTop: "220px",
    textLeft: "-15px",
  },

  {
    year: "2023",
    text: "Family Script became a daily pursuit as Meenakshi joined as Director, a young team came together, and Family Script 2.0 was launched.",
    position: "top",
    image: "/assets/OurJourney/2023.jpg",
    textTop: "70px",
    textLeft: "-50px",
  },

  {
    year: "2023-2026",
    text: "28+ projects completed across biographies, memoirs, institutional histories, practice histories, and diverse forms of legacy documentation.",
    position: "bottom",
    image: "/assets/OurJourney/2023-2026.jpeg",
    textTop: "290px",
    textLeft: "-50px",
  },

  {
    year: "2024",
    text: "Exhibited Family Script projects and Indigo Chronicles, a set of three journals to Create, Cherish and Celebrate life, at DCWA’s Diplomatic Bazaar; bringing life documentation and legacy-making to a wider audience.",
    position: "top",
    image: "/assets/OurJourney/2024.jpg",
    textTop: "100px",
    textLeft: "-10px",
  },

  {
    year: "2025",
    text: "Family Script won the UX India 2025 Design Pitch Competition, emerging among 149 global entries and pitching to leading investors in Hyderabad.",
    position: "bottom",
    image: "/assets/OurJourney/2025.jpeg",
    textTop: "330px",
    textLeft: "170px",
  },

  {
    year: "2026",
    text: "Showcased Family Script’s Digital Model at the India Impact AI Summit 2026, representing Delhi Government-promoted startups and opening new institutional opportunities.",
    position: "top",
    image: "/assets/OurJourney/2026.jpeg",
    textTop: "70px",
    textLeft: "-45px",
  },
];

export default function OurJourney() {
  const positions = [
    "2%",
    "15%",
    "23%",
    "31%",
    "44%",
    "57%",
    "66%",
    "76%",
    "84%",
    "96%",
  ];

  return (
    <section
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#461929]
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-[#461929]" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #4b1b2d 0%, #46182a 45%, #421528 100%)",
        }}
      />

      {/* =====================================================
          DESKTOP VERSION
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          hidden
          min-h-screen
          w-full
          max-w-[1200px]
          flex-col
          px-4
          pt-[5px]
          md:flex
        "
      >
        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="text-center">
          <h1
            className="
              m-8
              text-[35px]
              font-light
              leading-[1]
              tracking-[3px]
              text-white
            "
          >
            OUR
          </h1>

          <h2
            className="
              mt-[-20px]
              text-[43px]
              font-light
              leading-none
              tracking-[2px]
              text-white
            "
          >
            JOURNEY
          </h2>
        </div>

        {/* ===================================================
            TIMELINE
        =================================================== */}

        <div className="relative mt-[18px] h-[450px] w-full">
          {/* Main horizontal line */}

          <div
            className="
              absolute
              left-[3%]
              right-[3%]
              top-[200px]
              h-px
              bg-white/40
            "
          />

          {/* Future Vision */}

          <div
            className="
              absolute
              left-[1133px]
              top-[191px]
              whitespace-nowrap
              text-[12px]
              font-light
              tracking-[1.2px]
              text-white
            "
          >
            Future Vision
          </div>

          {/* =================================================
              TIMELINE ITEMS
          ================================================= */}

          <div className="absolute inset-x-[2%] top-0 h-full">
            {journeyItems.map((item, index) => (
              <div
                key={`${item.year}-${index}`}
                className="
                  absolute
                  top-0
                  h-full
                  w-[115px]
                "
                style={{
                  left: positions[index],
                  transform: "translateX(-50%)",
                }}
              >
                {/* =================================================
                    TOP ITEMS
                ================================================= */}

                {item.position === "top" && (
                  <>
                    {/* TOP WRITING */}

                    <div
                      className="
                        absolute
                        w-[135px]
                        -translate-x-1/2
                        text-center
                      "
                      style={{
                        top: item.textTop,
                        left: item.textLeft || "50%",
                      }}
                    >
                      <p
                        className="
                          whitespace-pre-line
                          text-[9px]
                          font-light
                          leading-[1.15]
                          tracking-[0.45px]
                          text-[#b99850]
                        "
                      >
                        {item.text}
                      </p>
                    </div>

                    {/* TOP IMAGE */}

                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className={`
                          absolute
                          left-1/2
                          h-[72px]
                          w-[72px]
                          -translate-x-1/2
                          object-cover
                          ${
                            [1, 7].includes(index)
                              ? "top-[10px]"
                              : "top-[50px]"
                          }
                        `}
                      />
                    )}

                    {/* TOP CONNECTOR */}

                    {item.image && (
                      <div
                        className={`
                          absolute
                          left-1/2
                          w-px
                          -translate-x-1/2
                          bg-white/55
                          ${
                            [1, 7].includes(index)
                              ? "top-[80px] h-[120px]"
                              : "top-[122px] h-[78px]"
                          }
                        `}
                      />
                    )}

                    {/* TOP YEAR */}

                    <div
                      className={`
                        absolute
                        top-[187px]
                        whitespace-nowrap
                        text-[11px]
                        font-light
                        tracking-[2px]
                        text-white
                        ${
                          index === 0
                            ? "left-[18px]"
                            : "left-1/2 -translate-x-1/2"
                        }
                      `}
                    >
                      {item.year}
                    </div>
                  </>
                )}

                {/* =================================================
                    BOTTOM ITEMS
                ================================================= */}

                {item.position === "bottom" && (
                  <>
                    {/* BOTTOM YEAR */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-[187px]
                        -translate-x-1/2
                        whitespace-nowrap
                        text-[11px]
                        font-light
                        tracking-[2px]
                        text-white
                      "
                    >
                      {item.year}
                    </div>

                    {/* BOTTOM CONNECTOR */}

                    <div
                      className={`
                        absolute
                        left-1/2
                        top-[200px]
                        w-px
                        -translate-x-1/2
                        bg-white/55
                        ${
                          [2, 8].includes(index)
                            ? "h-[110px]"
                            : "h-[76px]"
                        }
                      `}
                    />

                    {/* BOTTOM IMAGE */}

                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className={`
                          absolute
                          left-1/2
                          h-[72px]
                          w-[72px]
                          -translate-x-1/2
                          object-cover
                          ${
                            [2, 8].includes(index)
                              ? "top-[310px]"
                              : "top-[276px]"
                          }
                        `}
                      />
                    )}

                    {/* BOTTOM WRITING */}

                    <div
                      className="
                        absolute
                        w-[145px]
                        -translate-x-1/2
                        text-center
                      "
                      style={{
                        top: item.textTop,
                        left: item.textLeft || "50%",
                      }}
                    >
                      <p
                        className="
                          whitespace-pre-line
                          text-[9px]
                          font-light
                          leading-[1.15]
                          tracking-[0.35px]
                          text-[#b99850]
                        "
                      >
                        {item.text}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================
            DESKTOP BUTTON
        =================================================== */}

        <div className="mt-[-50px] flex justify-center">
          <button
            type="button"
            className="
              rounded-full
              bg-[#6c5260]
              px-[16px]
              py-[4px]
              text-[12px]
              font-light
              tracking-[0.4px]
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:bg-[#795c6c]
            "
          >
            Get your Story Scripted&nbsp; &gt;&gt;
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE VERSION
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          flex-col
          px-[7px]
          pt-[22px]
          md:hidden
        "
      >
        {/* ===================================================
            MOBILE TITLE
        =================================================== */}

        <div className="text-center">
          <h1
            className="
              text-[23px]
              font-light
              leading-none
              tracking-[2px]
            "
          >
            OUR
          </h1>

          <h2
            className="
              mt-[5px]
              text-[29px]
              font-light
              leading-none
              tracking-[1.5px]
            "
          >
            JOURNEY
          </h2>
        </div>

        {/* ===================================================
            MOBILE TIMELINE
        =================================================== */}

        <div
          className="
            relative
            mx-auto
            mt-[18px]
            h-[530px]
            w-full
            max-w-[390px]
          "
        >
          {/* =================================================
              MAIN HORIZONTAL LINE
          ================================================= */}

          <div
            className="
              absolute
              left-[2%]
              right-[2%]
              top-[240px]
              h-px
              bg-white/40
            "
          />

          {/* =================================================
              FUTURE VISION
          ================================================= */}

          <div
            className="
              absolute
              right-[-5%]
              top-[235px]
              translate-x-1/2
              whitespace-nowrap
              text-[5px]
              font-light
              tracking-[0.5px]
              text-white
            "
          >
            Future Vision
          </div>

          {/* =================================================
              MOBILE ITEMS
          ================================================= */}

          <div className="absolute inset-x-[1%] top-0 h-full">
            {journeyItems.map((item, index) => {
              const left = `${2 + index * 10.65}%`;

              return (
                <div
                  key={`mobile-${item.year}-${index}`}
                  className="
                    absolute
                    top-0
                    h-full
                    w-[10%]
                  "
                  style={{
                    left,
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* =================================================
                      TOP ITEM
                  ================================================= */}

                  {item.position === "top" && (
                    <>
                      {/* TOP TEXT */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-[60px]
                          w-[58px]
                          -translate-x-1/2
                          text-center
                        "
                      >
                        <p
                          className="
                            text-[5px]
                            font-light
                            leading-[1.18]
                            tracking-[0.05px]
                            text-[#b99850]
                          "
                        >
                          {item.text}
                        </p>
                      </div>

                      {/* TOP IMAGE */}

                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="
                            absolute
                            left-1/2
                            top-[125px]
                            h-[38px]
                            w-[38px]
                            -translate-x-1/2
                            object-cover
                          "
                        />
                      )}

                      {/* TOP CONNECTOR */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-[163px]
                          h-[77px]
                          w-px
                          -translate-x-1/2
                          bg-white/50
                        "
                      />

                      {/* TOP YEAR */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-[226px]
                          -translate-x-1/2
                          whitespace-nowrap
                          text-[5.5px]
                          font-light
                          tracking-[0.5px]
                          text-white
                        "
                      >
                        {item.year}
                      </div>
                    </>
                  )}

                  {/* =================================================
                      BOTTOM ITEM
                  ================================================= */}

                  {item.position === "bottom" && (
                    <>
                      {/* BOTTOM YEAR */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-[247px]
                          -translate-x-1/2
                          whitespace-nowrap
                          text-[5.5px]
                          font-light
                          tracking-[0.5px]
                          text-white
                        "
                      >
                        {item.year}
                      </div>

                      {/* BOTTOM CONNECTOR */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-[240px]
                          h-[58px]
                          w-px
                          -translate-x-1/2
                          bg-white/50
                        "
                      />

                      {/* BOTTOM IMAGE */}

                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="
                            absolute
                            left-1/2
                            top-[298px]
                            h-[38px]
                            w-[38px]
                            -translate-x-1/2
                            object-cover
                          "
                        />
                      )}

                      {/* BOTTOM TEXT */}

                      <div
                        className="
                          absolute
                          left-1/2
                          top-[350px]
                          w-[62px]
                          -translate-x-1/2
                          text-center
                        "
                      >
                        <p
                          className="
                            text-[5px]
                            font-light
                            leading-[1.18]
                            tracking-[0.05px]
                            text-[#b99850]
                          "
                        >
                          {item.text}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            MOBILE BUTTON
        =================================================== */}

        <div
          className="
            mt-[-110px]
            flex
            justify-center
            pb-[10px]
          "
        >
          <button
            type="button"
            className="
              rounded-full
              bg-[#6c5260]
              px-[13px]
              py-[4px]
              text-[9px]
              font-light
              tracking-[0.3px]
              text-white
              shadow-sm
            "
          >
            Get your Story Scripted&nbsp; &gt;&gt;
          </button>
        </div>
      </div>
    </section>
  );
}