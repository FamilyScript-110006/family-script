"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import productsData from "./products.json";
import CTAButton from "../layout/CTAButton";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   BRAND PALETTE
   Muted Purple #382C3B · Dark Burgundy #480424
   Antique Gold #CBA356 · Warm Beige #D2C6B2 · Soft Ivory #E9E7DA
   (gold/beige/ivory are applied as literal Tailwind arbitrary
   values below — [#CBA356] etc. — rather than as JS constants,
   since they're used in one-off className strings, not logic.)
   ========================================================= */

const MUTED_PURPLE = "#382C3B";
const DARK_BURGUNDY = "#480424";

const INTRO_TEXT =
  "Indigo Chronicles is a meticulously curated hamper that encapsulates the essence of documentation in myriad forms. At its core lies the central idea of documenting memories and experiences, encompassing cultural nuances, customs, and emotional landscapes for posterity.";

const LIVE_CATALOG_URL = "https://familyscript.com/category/all-products";

/* =========================================================
   BANNER
   ========================================================= */

const BANNER_HEIGHT = 356;
const BANNER_PHOTO = "/assets/Products/upper-img.png";

/* =========================================================
   TYPES
   ========================================================= */

type Segment = {
  title: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  image: string;
  gallery?: string[];
  description: string;
  segments: Segment[];
};

const PRODUCTS = productsData as Product[];

// All four products get a full stacked EXPLORE panel,
// matching the Figma page (Indigo Chronicles, Cherish,
// Create, Celebrate).
const EXPLORE_IDS = ["indigo-chronicles", "cherish", "create", "celebrate"];

/* =========================================================
   ATMOSPHERIC OMBRÉ GRADIENT
   ========================================================= */

type Layer = {
  x: number;
  y: number;
  color: string;
  opacity: number;
  w?: number;
  h?: number;
  fade?: number;
};

const BASE = DARK_BURGUNDY;

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function buildOmbre(layers: Layer[], base: string = BASE): string {
  const radials = layers
    .map((layer) => {
      const w = layer.w ?? 140;
      const h = layer.h ?? 55;
      const fade = layer.fade ?? 72;

      return `radial-gradient(
        ellipse ${w}% ${h}% at ${layer.x}% ${layer.y}%,
        rgba(${hexToRgb(layer.color)}, ${layer.opacity}) 0%,
        transparent ${fade}%
      )`;
    })
    .join(",\n");

  return `${radials},\n${base}`;
}

const pageGradientLayers: Layer[] = [
  { x: 50, y: 4, color: "#000000", opacity: 0.75, w: 160, h: 30, fade: 65 },
  { x: 45, y: 18, color: MUTED_PURPLE, opacity: 0.55, w: 150, h: 42, fade: 70 },
  { x: 55, y: 34, color: DARK_BURGUNDY, opacity: 0.6, w: 150, h: 46, fade: 72 },
  { x: 50, y: 52, color: "#000000", opacity: 0.5, w: 155, h: 44, fade: 74 },
  { x: 50, y: 70, color: MUTED_PURPLE, opacity: 0.5, w: 150, h: 38, fade: 70 },
  { x: 50, y: 92, color: "#000000", opacity: 0.85, w: 165, h: 42, fade: 60 },
];

/* =========================================================
   BANNER OVERLAY — a single soft plum-toned gradient, dark
   at the top (where the nav sits) fading to clear toward the
   bottom of the banner, matching the Figma reference.
   ========================================================= */

function BannerOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(${hexToRgb(DARK_BURGUNDY)}, 0.55) 0%,
          rgba(${hexToRgb(MUTED_PURPLE)}, 0.25) 45%,
          rgba(${hexToRgb(MUTED_PURPLE)}, 0.15) 100%
        )`,
      }}
    />
  );
}

/* =========================================================
   PRODUCT THUMBNAIL (hover-to-preview, purely visual now —
   no longer drives the EXPLORE section since that's stacked)
   ========================================================= */

function ThumbnailCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  const scrollToExplore = () => {
    document
      .getElementById(`explore-${product.id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={scrollToExplore}
      className="w-[243px] shrink-0 text-left"
      aria-label={`Jump to ${product.name}`}
    >
      <div
        className="h-[182px] w-[243px] overflow-hidden rounded-[4px] transition-[filter] duration-300 ease-out cursor-pointer"
        style={{ filter: hovered ? "grayscale(0%)" : "grayscale(100%)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="futura-light mt-[20px] text-center text-[12px] leading-[13px] tracking-[0.05em] text-white">
        {product.name}
      </p>
    </button>
  );
}

/* =========================================================
   FULL EXPERIENCE — single pre-designed brochure image, not
   a hand-built grid. Drop the flattened design export at
   /public/assets/Products/indigo-brochure.png.
   ========================================================= */

function FullExperience() {
  return (
    <div className="relative mt-[64px] w-full overflow-hidden rounded-[8px]">
      <img
        src="/assets/Products/indigo-brochure.png"
        alt="The full Indigo Chronicles experience — postcards, journal spreads, and a look inside Cherish, Create and Celebrate"
        className="h-auto w-full"
      />
    </div>
  );
}

/* =========================================================
   EXPLORE PANEL — one per product, alternating image/text
   side, with a lightweight local carousel over `gallery`.
   ========================================================= */

function ExplorePanel({
  product,
  reverse,
  registerRef,
}: {
  product: Product;
  reverse: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setIndex((i) => (i + 1) % gallery.length);

  const imageBlock = (
    <div className="relative w-full md:w-1/2">
      <div className="overflow-hidden rounded-[8px]" style={{ height: 480 }}>
        <img
          src={gallery[index]}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Falls back to the product's main image if a
            // numbered gallery file isn't uploaded yet, so
            // clicking next/prev never shows a dead broken-
            // image icon.
            if (e.currentTarget.src !== window.location.origin + product.image) {
              e.currentTarget.src = product.image;
            }
          }}
        />
      </div>

      {gallery.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[28px] text-white/80 hover:text-white"
          >
            &lt;
          </button>
          <button
            aria-label="Next image"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[28px] text-white/80 hover:text-white"
          >
            &gt;
          </button>
        </>
      )}
    </div>
  );

  const textBlock = (
    <div className="w-full text-white md:w-1/2 md:px-[5%]">
      <div className="futura-medium text-[24px] leading-[60px] tracking-[0.3em]">
        EXPLORE
      </div>
      <div className="futura-medium text-[45px] leading-[60px] tracking-[0.3em]">
        {product.name.split(":")[0].toUpperCase()}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {product.segments.map((segment) => (
          <p
            key={segment.title}
            className="text-[20px] leading-[28px] tracking-[0.05em] text-[#E9E7DA]"
          >
            <span className="futura-medium">{segment.title}: </span>
            <span className="futura-light">{segment.description}</span>
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={registerRef}
      id={`explore-${product.id}`}
      className={`mt-[96px] flex w-full flex-col gap-[48px] scroll-mt-[100px] md:items-start ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {imageBlock}
      {textBlock}
    </div>
  );
}

/* =========================================================
   PRODUCTS PAGE
   ========================================================= */

export default function Products() {
  const headingRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const exploreRefs = useRef<(HTMLDivElement | null)[]>([]);

  const exploreProducts = PRODUCTS.filter((p) => EXPLORE_IDS.includes(p.id));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [
        headingRef.current,
        introRef.current,
        thumbsRef.current,
        experienceRef.current,
        ...exploreRefs.current,
        ctaRef.current,
      ].filter(Boolean) as HTMLElement[];

      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
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
    <main
      className="relative min-h-screen w-full overflow-x-hidden text-white"
      style={{ background: buildOmbre(pageGradientLayers, BASE) }}
    >
      {/* TOP FADE — subtle, tinted to match the page, not pure black */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[100] h-[150px]"
        style={{
          background: `linear-gradient(to bottom, rgba(${hexToRgb(
            MUTED_PURPLE,
          )}, 0.45), transparent)`,
        }}
      />

      {/* BANNER */}
      <div className="relative w-full overflow-hidden" style={{ height: BANNER_HEIGHT }}>
        <img
          src={BANNER_PHOTO}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <BannerOverlay />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-[97px] pb-[120px]">
        {/* OUR PRODUCTS heading */}
        <div ref={headingRef} className="pt-[94px] text-center">
          <h1 className="futura-light text-[48px] tracking-[0.15em] text-white">
            OUR <span className="futura-bold">PRODUCTS</span>
          </h1>
        </div>

        {/* INTRO */}
        <p
          ref={introRef}
          className="futura-light mx-auto text-center text-[24px] leading-[28px] tracking-[0.08em] text-[#E9E7DA]"
          style={{ width: "63.125%", maxWidth: 909, paddingTop: 40 }}
        >
          {INTRO_TEXT}
        </p>

        {/* PRODUCT THUMBNAILS */}
        <div
          ref={thumbsRef}
          className="mt-[80px] flex w-full flex-wrap justify-center gap-x-[57px] gap-y-[40px]"
        >
          {PRODUCTS.map((product) => (
            <ThumbnailCard key={product.id} product={product} />
          ))}
        </div>

        {/* FULL EXPERIENCE MOSAIC */}
        <div ref={experienceRef}>
          <FullExperience />
        </div>

        {/* STACKED EXPLORE PANELS, alternating sides */}
        {exploreProducts.map((product, i) => (
          <ExplorePanel
            key={product.id}
            product={product}
            reverse={i % 2 === 1}
            registerRef={(el) => {
              exploreRefs.current[i] = el;
            }}
          />
        ))}

        {/* Existing-site reference link */}
        <div className="mt-[48px] flex justify-center">
          <Link
            href={LIVE_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="futura-medium w-fit text-[16px] tracking-[0.3em] text-white underline-offset-4 hover:underline"
          >
            REFER EXISTING WEBSITE
          </Link>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-[96px] flex w-full justify-center">
          <CTAButton />
        </div>
      </div>

      {/* BOTTOM FADE — subtle, tinted to match the page, not pure black */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[100] h-[170px]"
        style={{
          background: `linear-gradient(to top, rgba(${hexToRgb(
            DARK_BURGUNDY,
          )}, 0.5), transparent)`,
        }}
      />
    </main>
  );
}
