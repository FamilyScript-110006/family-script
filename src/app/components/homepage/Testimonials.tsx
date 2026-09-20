"use client";

import CTAButton from "../layout/CTAButton";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   TESTIMONIAL DATA
============================================================ */

const TESTIMONIALS = [
  {
    quote:
      "“Over these past few months, they have become like friends of mine, spending hours listening to me, asking the right questions, and making me revisit my deepest memories. The comfort I felt with them was immense and helped me talk like I was talking to myself. Their professionalism, sensitivity, and quality of work is truly commendable.”",

    name:
      "Ms Reva Khanna, First Woman CA of Delhi Former President, DCWA",

    photo: "/assets/testimonials/REVA KHANNA.png",
  },

  {
    quote:
      "“Thanks a lot for whatever you are doing for us even though we live each moment in Uppa’s thoughts, I believe you are God send for this purpose.”",

    name:
      "Dr. Saleeqath, Doctor at Dr. Kutty’s Healthcare and Nura Clinic, Calicut",

    photo: "/assets/testimonials/SALEEQATH.jpg",
  },

  {
    quote:
      "“I’m happy with how the book turned out, it's truly magical. Thank you for bringing out the best in me and treating my story as your own. You made the process feel effortless and filled me with confidence. This book is one of my life's accomplishments. Your vision and dedication will inspire so many who hesitate to write or share.”",

    name:
      "Ms Renu Mehra, Board Member of Taravati Ram Gopal Mehra Foundation & Former District Chairperson, Rotary District, 309",

    photo: "/assets/testimonials/RENU MEHRA.png",
  },

  {
    quote:
      "“It was thanks to the patience and professionalism of the FS team that later helped me select special moments from our family occasions to craft a permanent pathway that we can travel through and renew the warp and weft of family bonds.”",

    name:
      "Ms Romonika D Sharan, Project Director, Policy & Communications at CSF",

    photo: "/assets/testimonials/ROMONIKA.png",
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

/* ============================================================
   DESKTOP TESTIMONIAL CARD
============================================================ */

function DesktopTestimonial({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const imageLeft = index % 2 === 0;

  return (
    <div
      className={`
        relative
        h-[208px]
        w-[780px]
        max-w-[calc(100vw-100px)]
        rounded-[15px]
        border
        border-white/80
        ${
          imageLeft
            ? "mr-[40px]"
            : "ml-[40px]"
        }
      `}
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div
        className={`
          absolute
          top-[12px]
          h-[183px]
          w-[158px]
          rounded-[15px]
          bg-cover
          bg-center
          bg-no-repeat
          ${
            imageLeft
              ? "left-[-60px]"
              : "right-[-60px]"
          }
        `}
        style={{
          backgroundImage: `url("${testimonial.photo}")`,
        }}
      />

      {/* ======================================================
          QUOTE
      ====================================================== */}

      <div
        className={`
          absolute
          top-[30px]
          ${
            imageLeft
              ? "left-[205px] right-[35px]"
              : "left-[35px] right-[205px]"
          }
        `}
      >
        <p
          className={`
            futura-light
            text-[15px]
            leading-[1.5]
            tracking-[0.04em]
            text-[#FFF5E5]
            ${
              imageLeft
                ? "text-left"
                : "text-right"
            }
          `}
        >
          {testimonial.quote}
        </p>
      </div>

      {/* ======================================================
          NAME
      ====================================================== */}

      <p
        className={`
          futura-light
          absolute
          bottom-[18px]
          max-w-[300px]
          text-[11px]
          leading-[1.35]
          text-[#D2C6B2]
          ${
            imageLeft
              ? "right-[35px] text-right"
              : "left-[35px] text-left"
          }
        `}
      >
        {testimonial.name}
      </p>
    </div>
  );
}

/* ============================================================
   MOBILE TESTIMONIAL CARD
============================================================ */

function MobileTestimonial({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const imageLeft = index % 2 === 0;

  return (
    <div
      className="
        relative
        mx-auto
        h-[100px]
        w-[calc(100%-28px)]
        flex-shrink-0
        rounded-[8px]
        border
        border-white/70
      "
    >
      {/* ======================================================
          PHOTO
      ====================================================== */}

      <div
        className={`
          absolute
          top-[8px]
          h-[82px]
          w-[60px]
          rounded-[6px]
          bg-cover
          bg-center
          bg-no-repeat
          ${
            imageLeft
              ? "left-[8px]"
              : "right-[8px]"
          }
        `}
        style={{
          backgroundImage: `url("${testimonial.photo}")`,
        }}
      />

      {/* ======================================================
          QUOTE
      ====================================================== */}

      <div
        className={`
          absolute
          top-[9px]
          ${
            imageLeft
              ? "left-[76px] right-[8px]"
              : "left-[8px] right-[76px]"
          }
        `}
      >
        <p
          className={`
            futura-light
            text-[10px]
            leading-[1.35]
            tracking-[0.015em]
            text-[#FFF5E5]
            ${
              imageLeft
                ? "text-left"
                : "text-right"
            }
          `}
        >
          {testimonial.quote}
        </p>
      </div>

      {/* ======================================================
          NAME
      ====================================================== */}

      <p
        className={`
          futura-light
          absolute
          bottom-[6px]
          max-w-[180px]
          text-[6px]
          leading-[1.2]
          text-[#D2C6B2]
          ${
            imageLeft
              ? "right-[8px] text-right"
              : "left-[8px] text-left"
          }
        `}
      >
        {testimonial.name}
      </p>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Testimonials() {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  const desktopTrackRef =
    useRef<HTMLDivElement | null>(null);

  const desktopViewportRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    const viewport =
      desktopViewportRef.current;

    const track =
      desktopTrackRef.current;

    if (!section || !viewport || !track) {
      return;
    }

    const ctx = gsap.context(() => {
      /* ======================================================
         HEADING ANIMATION
      ====================================================== */

      gsap.fromTo(
        ".testimonials-heading",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions:
              "play none none reverse",
          },
        },
      );

      /* ======================================================
         DESCRIPTION ANIMATION
      ====================================================== */

      gsap.fromTo(
        ".testimonials-description",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions:
              "play none none reverse",
          },
        },
      );

      /* ======================================================
         DESKTOP CARDS
      ====================================================== */

      gsap.fromTo(
        ".desktop-testimonial-card",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions:
              "play none none reverse",
          },
        },
      );

      /* ======================================================
         DESKTOP INTERNAL SCROLL
      ====================================================== */

      const getMaxScroll = () =>
        Math.max(
          0,
          track.scrollHeight -
            viewport.clientHeight,
        );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",

        end: () =>
          `+=${Math.max(
            1,
            getMaxScroll(),
          )}`,

        pin: true,

        scrub: true,

        anticipatePin: 1,

        invalidateOnRefresh: true,

        onUpdate: (self) => {
          const maxScroll =
            getMaxScroll();

          gsap.set(track, {
            y:
              -maxScroll *
              self.progress,
          });
        },
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        bg-[#460A26]
        text-white
      "
    >
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <div
          className="
            absolute
            inset-0
          "
          style={{
            background:
              "linear-gradient(356.76deg, rgba(0,0,0,0.35) 2.81%, rgba(102,102,102,0) 71.6%)",
          }}
        />

        <div
          className="
            absolute
            inset-0
          "
          style={{
            background:
              "linear-gradient(to bottom, rgba(83,36,57,0.88) 0%, rgba(83,36,57,0.72) 40%, rgba(83,36,57,0.45) 100%)",
          }}
        />
      </div>

      {/* ======================================================
          DESKTOP
      ====================================================== */}

      <div
        className="
          relative
          z-10
          hidden
          h-full
          w-full
          md:block
        "
      >
        {/* ==================================================
            HEADING
        ================================================== */}

        <div
          className="
            testimonials-heading
            absolute
            left-1/2
            top-[7%]
            w-full
            -translate-x-1/2
            text-center
          "
        >
          <h2
            className="
              futura-medium
              text-[clamp(35px,3.5vw,50px)]
              leading-none
              tracking-[0.05em]
            "
          >
            TESTIMONIALS
          </h2>
        </div>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <p
          className="
            testimonials-description
            futura-light
            absolute
            left-1/2
            top-[17%]
            w-[min(740px,80%)]
            -translate-x-1/2
            text-center
            text-[clamp(12px,1vw,15px)]
            leading-[1.45]
            tracking-[0.04em]
          "
        >
          This is a tribute to our friends at Family
          Script, who have been unwavering pillars of
          support throughout our journey, alongside
          many others who have also played pivotal
          roles in our endeavors.
        </p>

        {/* ==================================================
            DESKTOP TESTIMONIAL VIEWPORT
        ================================================== */}

        <div
          ref={desktopViewportRef}
          className="
            absolute
            left-1/2
            top-[31%]
            h-[55%]
            w-full
            -translate-x-1/2
            overflow-hidden
          "
        >
          <div
            ref={desktopTrackRef}
            className="
              flex
              w-full
              flex-col
              gap-[12px]
              pb-[20px]
            "
          >
            {TESTIMONIALS.map(
              (testimonial, index) => (
                <div
                  key={index}
                  className="
                    desktop-testimonial-card
                    flex
                    w-full
                    flex-shrink-0
                    justify-center
                  "
                >
                  <DesktopTestimonial
                    testimonial={testimonial}
                    index={index}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {/* ==================================================
            DESKTOP CTA
        ================================================== */}

        <div
          className="
            absolute
            bottom-[4%]
            left-1/2
            z-30
            -translate-x-1/2
          "
        >
          <CTAButton />
        </div>
      </div>

      {/* ======================================================
          MOBILE
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          flex-col
          md:hidden
        "
      >
        {/* ==================================================
            MOBILE HEADING
        ================================================== */}

        <div
          className="
            testimonials-heading
            flex
            justify-center
            pt-[50px]
          "
        >
          <h2
            className="
              futura-medium
              text-[21px]
              leading-none
              tracking-[0.07em]
            "
          >
            TESTIMONIALS
          </h2>
        </div>

        {/* ==================================================
            MOBILE DESCRIPTION
        ================================================== */}

        <p
          className="
            testimonials-description
            futura-light
            mx-auto
            mt-[18px]
            w-[78%]
            text-center
            text-[12px]
            leading-[1.45]
            tracking-[0.03em]
          "
        >
          This is a tribute to our friends at Family
          Script, who have been unwavering pillars of
          support throughout our journey, alongside
          many others who have also played pivotal
          roles in our endeavors.
        </p>

        {/* ==================================================
            MOBILE TESTIMONIAL AREA

            3 CARDS ARE VISIBLE.
            4TH CARD IS SCROLLABLE.
        ================================================== */}

        <div
          className="
            mx-auto
            mt-[35px]
            h-[330px]
            w-full
            overflow-y-auto
            overflow-x-hidden
            pb-[10px]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div
            className="
              flex
              w-full
              flex-col
              gap-[15px]
            "
          >
            {TESTIMONIALS.map(
              (testimonial, index) => (
                <MobileTestimonial
                  key={index}
                  testimonial={testimonial}
                  index={index}
                />
              ),
            )}
          </div>
        </div>

        {/* ==================================================
            MOBILE CTA
        ================================================== */}

        <div
          className="
            absolute
            bottom-[15px]
            left-1/2
            z-30
            -translate-x-1/2
          "
        >
          <CTAButton />
        </div>
      </div>
    </section>
  );
}