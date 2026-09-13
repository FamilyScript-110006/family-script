"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import productsData from "./products.json";
import PageGradientBackground from "../layout/PageGradientBackground";

gsap.registerPlugin(ScrollTrigger);

const BANNER_PHOTO = "/assets/Products/upper-img.png";

const INTRO_TEXT =
  "Indigo Chronicles is a meticulously curated hamper that encapsulates the essence of documentation in myriad forms. At its core lies the central idea of documenting memories and experiences, encompassing cultural nuances, customs, and emotional landscapes for posterity.";

const LIVE_CATALOG_URL = "https://familyscript.com/category/all-products";

const DEFAULT_PRODUCT_ID = "create";

type Segment = { title: string; description: string };
type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  segments: Segment[];
};

const PRODUCTS = productsData as Product[];

// Same 10-rect gradient-overlay darkening technique as
// Testimonials.tsx (linear-gradient(356.76deg, rgba(0,0,0,X) 2.81%,
// rgba(102,102,102,0) 71.6%) at 26% opacity), rescaled to this banner's
// 1440x356 box (measured Figma height) rather than testimonials' 1440x823
// canvas.
const GRADIENT_RECTS_BACK = [
  { width: 1456, height: 364, top: -6, left: 1 },
  { width: 1457, height: 363, top: -4, left: 1 },
  { width: 1456, height: 364, top: -6, left: 1 },
];
const GRADIENT_RECTS_FRONT = [
  { width: 1440, height: 354, top: 3, left: 1 },
  { width: 1440, height: 354, top: 3, left: 1 },
];

function ThumbnailCard({
  product,
  left,
  isActive,
  onHover,
}: {
  product: Product;
  left: number;
  isActive: boolean;
  onHover: () => void;
}) {
  return (
    <div className="absolute" style={{ top: 306, left, width: 243 }}>
      <div
        className=" rounded-[4px] transition-[filter] duration-300 ease-out"
        style={{
          width: 243,
          height: 182,
          filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
          cursor: "pointer",
        }}
        onMouseEnter={onHover}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <p
        className="futura-light mt-[20px] text-center text-[12px] leading-[13px] tracking-[0.05em] text-white"
        style={{ width: 243 }}
      >
        {product.name}
      </p>
    </div>
  );
}

export default function Products() {
  const bannerRef = useRef<HTMLImageElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState(DEFAULT_PRODUCT_ID);
  const activeProduct = PRODUCTS.find((p) => p.id === activeId) ?? PRODUCTS[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { yPercent: -5, scale: 1.08 },
          {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: bannerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          },
        );
      }

      [introRef, thumbsRef, exploreRef, ctaRef].forEach((ref) => {
        if (!ref.current) return;
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden bg-[#532439]">
      <PageGradientBackground />

      <div className="relative mx-auto" style={{ width: 1440 }}>
        {/* Banner — measured Figma height: ~356px. */}
        <div className="relative " style={{ width: 1440, height: 356 }}>
          <img
            ref={bannerRef}
            src={BANNER_PHOTO}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {GRADIENT_RECTS_BACK.map((rect, i) => (
            <div
              key={`back-${i}`}
              className="absolute"
              style={{
                ...rect,
                opacity: 0.26,
                background:
                  "linear-gradient(356.76deg, rgba(0, 0, 0, 1) 2.81%, rgba(102, 102, 102, 0) 71.6%)",
              }}
            />
          ))}
          {GRADIENT_RECTS_FRONT.map((rect, i) => (
            <div
              key={`front-${i}`}
              className="absolute"
              style={{
                ...rect,
                opacity: 0.26,
                background:
                  "linear-gradient(356.76deg, rgba(0, 0, 0, 0.5) 2.81%, rgba(102, 102, 102, 0) 71.6%)",
              }}
            />
          ))}
        </div>

        <div className="relative" style={{ minHeight: 1494 }}>
          {/* Intro paragraph — exact box per spec: 909x140 at (270, 450 from
              canvas top; here relative to the post-banner container, whose
              origin is the banner's measured bottom (356), so top: 94. */}
          <p
            ref={introRef}
            className="futura-light absolute text-center text-[24px] leading-[28px] tracking-[0.08em] text-[#FFF5E5]"
            style={{ width: 909, height: 140, top: 94, left: 270 }}
          >
            {INTRO_TEXT}
          </p>

          {/* Thumbnail row — 4 products, grayscale by default, colorized on
              hover. Hover state is sticky (stays on the last-hovered
              product rather than resetting on mouse-leave). */}
          <div ref={thumbsRef} className="contents">
            {PRODUCTS.map((product, i) => (
              <ThumbnailCard
                key={product.id}
                product={product}
                left={[97, 434, 771, 1115][i] ?? 97 + i * 337}
                isActive={product.id === activeId}
                onHover={() => setActiveId(product.id)}
              />
            ))}
          </div>

          {/* Explore detail panel — swaps with the active product. */}
          <div ref={exploreRef}>
            <div
              className="absolute  rounded-[8px]"
              style={{ top: 729, left: 97, width: 720, height: 539 }}
            >
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Heading + segment list share one absolutely-positioned
                column so the list always starts naturally below however
                many lines the product name wraps to, instead of the list
                sitting at its own fixed top and colliding with longer
                names (e.g. "Indigo Chronicles: Set of 3 Journals"). */}
            <div
              className="absolute text-white"
              style={{ top: 717, left: 859, width: 500 }}
            >
              <div className="futura-medium text-[24px] leading-[60px] tracking-[0.3em]">
                EXPLORE
              </div>
              <div className="futura-medium text-[45px] leading-[60px] tracking-[0.3em]">
                {activeProduct.name}
              </div>
              <div className="mt-8 flex flex-col gap-4">
                {activeProduct.segments.map((segment) => (
                  <p
                    key={segment.title}
                    className="text-[20px] leading-[28px] tracking-[0.05em] text-[#FFF5E5]"
                  >
                    <span className="futura-medium">{segment.title}: </span>
                    <span className="futura-light">{segment.description}</span>
                  </p>
                ))}
              </div>
            </div>

            <Link
              href={LIVE_CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="futura-medium absolute text-[24px] leading-[60px] tracking-[0.3em] text-white underline-offset-4 hover:underline"
              style={{ top: 1291, left: 97, width: 618, height: 48 }}
            >
              REFER EXISTING WEBSITE
            </Link>
          </div>

          {/* CTA */}
          <div
            ref={ctaRef}
            className="absolute flex justify-center"
            style={{ top: 1374, left: 0, width: 1440 }}
          >
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
        </div>
      </div>
    </main>
  );
}
