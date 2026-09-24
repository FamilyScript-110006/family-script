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
    name: "Ms Reva Khanna, First Woman CA of Delhi Former President, DCWA",
    photo: "/assets/testimonials/REVA KHANNA.png",
  },
  {
    quote:
      "“Thanks a lot for whatever you are doing for us even though we live each moment in Uppa’s thoughts, I believe you are God send for this purpose.”",
    name: "Dr. Saleeqath, Doctor at Dr. Kutty’s Healthcare and Nura Clinic, Calicut",
    photo: "/assets/testimonials/SALEEQATH.jpg",
  },
  {
    quote:
      "“I’m happy with how the book turned out, it's truly magical. Thank you for bringing out the best in me and treating my story as your own. You made the process feel effortless and filled me with confidence. This book is one of my life's accomplishments. Your vision and dedication will inspire so many who hesitate to write or share.”",
    name: "Ms Renu Mehra, Board Member of Taravati Ram Gopal Mehra Foundation & Former District Chairperson, Rotary District, 309",
    photo: "/assets/testimonials/RENU MEHRA.png",
  },
  {
    quote:
      "“It was thanks to the patience and professionalism of the FS team that later helped me select special moments from our family occasions to craft a permanent pathway that we can travel through and renew the warp and weft of family bonds.”",
    name: "Ms Romonika D Sharan, Project Director, Policy & Communications at CSF",
    photo: "/assets/testimonials/ROMONIKA.png",
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

/* ============================================================
   DESKTOP TESTIMONIAL CARD
============================================================ */

function DesktopTestimonial({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="relative h-[400px] w-full">
      {/* Card border and content */}
      <div className="absolute inset-y-0 left-[72px] right-0 flex items-center rounded-[16px] border border-white/70 pl-[255px] pr-[45px] py-[30px]">
        <div className="flex h-full w-full flex-col justify-center">
          {/* Quote */}
          <p className="futura-light text-[clamp(14px,1.3vw,19px)] leading-[1.5] tracking-[0.01em] text-[#F4EDE9]">
            {testimonial.quote}
          </p>

          {/* Author */}
          <p className="futura-light mt-[18px] w-full text-right text-[13px] leading-[1.5] text-[#D2C6B2]">
            {testimonial.name}
          </p>
        </div>
      </div>

      {/* Image overlapping the card */}
      <div
        className="absolute left-0 top-1/2 z-10 h-[230px] w-[200px] -translate-y-1/2 overflow-hidden rounded-[12px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${testimonial.photo}")`,
        }}
      />
    </div>
  );
}

/* ============================================================
   MOBILE TESTIMONIAL CARD
============================================================ */

function MobileTestimonial({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="relative flex h-[410px] w-[min(300px,calc(100vw-40px))] flex-shrink-0 snap-center flex-col items-center justify-center rounded-[12px] border border-white/70 px-[22px] py-[24px] text-center">
      {/* Image */}
      <div
        className="h-[125px] w-[105px] flex-shrink-0 rounded-[9px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${testimonial.photo}")`,
        }}
      />

      {/* Name */}
      <p className="futura-light mt-[16px] w-full text-center text-[10px] leading-[1.5] text-[#D2C6B2]">
        {testimonial.name}
      </p>

      {/* Quote */}
      <p className="futura-light mt-[18px] w-full text-center text-[12px] leading-[1.55] tracking-[0.01em] text-[#FFF5E5]">
        {testimonial.quote}
      </p>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const desktopViewportRef = useRef<HTMLDivElement | null>(null);
  const mobileViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    let cleanupAutoScroll = () => {};

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
            toggleActions: "play none none reverse",
          },
        }
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
            toggleActions: "play none none reverse",
          },
        }
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
            toggleActions: "play none none reverse",
          },
        }
      );

      /* ======================================================
         HORIZONTAL AUTO-SCROLL
      ====================================================== */

      const viewports = [
        desktopViewportRef.current,
        mobileViewportRef.current,
      ].filter(
        (viewport): viewport is HTMLDivElement =>
          viewport !== null
      );

      const paused = new Set<HTMLDivElement>();

      const listeners = new Map<
        HTMLDivElement,
        {
          enter: () => void;
          leave: () => void;
        }
      >();

      const pauseAutoScroll = (viewport: HTMLDivElement) =>
        paused.add(viewport);

      const resumeAutoScroll = (viewport: HTMLDivElement) =>
        paused.delete(viewport);

      viewports.forEach((viewport) => {
        const enter = () => pauseAutoScroll(viewport);
        const leave = () => resumeAutoScroll(viewport);

        viewport.addEventListener("mouseenter", enter);
        viewport.addEventListener("mouseleave", leave);

        listeners.set(viewport, { enter, leave });
      });

      let animationFrame = 0;
      let lastTimestamp = performance.now();

      const autoScroll = (timestamp: number) => {
        const elapsed = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        viewports.forEach((viewport) => {
          if (paused.has(viewport)) return;

          const loopWidth =
            viewport === mobileViewportRef.current
              ? viewport.scrollWidth - viewport.clientWidth
              : viewport.scrollWidth / 2;

          const speed = 0.1;

          const nextPosition =
            viewport.scrollLeft + elapsed * speed;

          viewport.scrollLeft =
            nextPosition >= loopWidth
              ? nextPosition - loopWidth
              : nextPosition;
        });

        animationFrame =
          window.requestAnimationFrame(autoScroll);
      };

      animationFrame =
        window.requestAnimationFrame(autoScroll);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      cleanupAutoScroll = () => {
        window.cancelAnimationFrame(animationFrame);

        viewports.forEach((viewport) => {
          const listener = listeners.get(viewport);
          if (!listener) return;

          viewport.removeEventListener(
            "mouseenter",
            listener.enter
          );

          viewport.removeEventListener(
            "mouseleave",
            listener.leave
          );
        });
      };
    }, section);

    return () => {
      cleanupAutoScroll();
      ctx.revert();
    };
  }, []);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#2d0b1b] text-white"
    >
      {/* ======================================================
          BACKGROUND — MATCHES OUR JOURNEY
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#35101f] via-[#390e21] to-[#250817]" />

      {/* ======================================================
          DESKTOP
      ====================================================== */}

      <div className="relative z-10 hidden min-h-screen w-full md:block">
        {/* Heading */}
        <div className="testimonials-heading absolute left-1/2 top-[7%] w-full -translate-x-1/2 text-center">
          <h2 className="futura-medium text-[clamp(35px,3.5vw,50px)] leading-none tracking-[0.05em]">
            TESTIMONIALS
          </h2>
        </div>

        {/* Description */}
        <p className="testimonials-description futura-light absolute left-1/2 top-[17%] w-[min(740px,80%)] -translate-x-1/2 text-center text-[clamp(12px,1vw,15px)] leading-[1.45] tracking-[0.04em]">
          This is a tribute to our friends at Family Script,
          who have been unwavering pillars of support
          throughout our journey, alongside many others who
          have also played pivotal roles in our endeavors.
        </p>

        {/* Desktop testimonial viewport */}
        <div
          ref={desktopViewportRef}
          className="absolute left-1/2 top-[31%] h-[460px] w-full -translate-x-1/2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            ref={desktopTrackRef}
            className="flex w-max flex-row items-center gap-[24px] pb-[20px]"
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map(
              (testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="desktop-testimonial-card flex w-[min(1050px,calc(100vw-100px))] flex-shrink-0 justify-center"
                >
                  <DesktopTestimonial
                    testimonial={testimonial}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="absolute bottom-[4%] left-1/2 z-30 -translate-x-1/2">
          <CTAButton />
        </div>
      </div>

      {/* ======================================================
          MOBILE AND TABLET
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen w-full flex-col pb-[100px] md:hidden">
        {/* Mobile heading */}
        <div className="testimonials-heading flex justify-center pt-[50px]">
          <h2 className="futura-medium text-[21px] leading-none tracking-[0.07em]">
            TESTIMONIALS
          </h2>
        </div>

        {/* Mobile description */}
        <p className="testimonials-description futura-light mx-auto mt-[18px] w-[85%] text-center text-[12px] leading-[1.45] tracking-[0.03em]">
          This is a tribute to our friends at Family Script,
          who have been unwavering pillars of support
          throughout our journey, alongside many others who
          have also played pivotal roles in our endeavors.
        </p>

        {/* Mobile testimonial viewport */}
        <div
          ref={mobileViewportRef}
          className="mx-auto mt-[35px] h-[430px] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-[10px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max flex-row items-center gap-[15px] px-[20px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <MobileTestimonial
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-auto flex justify-center pt-6">
          <CTAButton />
        </div>
      </div>
    </section>
  );
}