"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import productsData from "./products.json";

gsap.registerPlugin(ScrollTrigger);

const INTRO_TEXT =
  "Indigo Chronicles is a meticulously curated hamper that encapsulates the essence of documentation in myriad forms. At its core lies the central idea of documenting memories and experiences, encompassing cultural nuances, customs, and emotional landscapes for posterity.";

const LIVE_CATALOG_URL = "https://familyscript.com/category/all-products";

const DEFAULT_PRODUCT_ID = "create";

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
  description: string;
  segments: Segment[];
};

const PRODUCTS = productsData as Product[];

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

const BASE = "#2A0E19";

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

/* =========================================================
   PAGE GRADIENT
   ========================================================= */

const pageGradientLayers: Layer[] = [
  { x: 50, y: 4, color: "#000000", opacity: 0.75, w: 160, h: 30, fade: 65 },
  { x: 45, y: 18, color: "#7A2E52", opacity: 0.65, w: 150, h: 42, fade: 70 },
  { x: 55, y: 34, color: "#5C2140", opacity: 0.55, w: 150, h: 46, fade: 72 },
  { x: 50, y: 52, color: "#000000", opacity: 0.5, w: 155, h: 44, fade: 74 },
  { x: 50, y: 70, color: "#6B2648", opacity: 0.6, w: 150, h: 38, fade: 70 },
  { x: 50, y: 92, color: "#000000", opacity: 0.85, w: 165, h: 42, fade: 60 },
];

/* =========================================================
   BANNER DARKENING GRADIENTS
   ========================================================= */

const GRADIENT_RECTS_BACK = [
  { height: 364, top: -6 },
  { height: 363, top: -4 },
  { height: 364, top: -6 },
];

const GRADIENT_RECTS_FRONT = [
  { height: 354, top: 3 },
  { height: 354, top: 3 },
];

/* =========================================================
   PRODUCT THUMBNAIL
   Normal flow now (was: absolute top/left computed per-index,
   which is what let the thumbnail labels spill into the
   Explore section below it).
   ========================================================= */

function ThumbnailCard({
  product,
  isActive,
  onHover,
}: {
  product: Product;
  isActive: boolean;
  onHover: () => void;
}) {
  return (
    <div className="w-[243px] shrink-0">
      <div
        className="
          h-[182px]
          w-[243px]
          overflow-hidden
          rounded-[4px]
          transition-[filter]
          duration-300
          ease-out
          cursor-pointer
        "
        style={{
          filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
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
        className="
          futura-light
          mt-[20px]
          text-center
          text-[12px]
          leading-[13px]
          tracking-[0.05em]
          text-white
        "
      >
        {product.name}
      </p>
    </div>
  );
}

/* =========================================================
   BANNER OVERLAY
   ========================================================= */

function BannerOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {GRADIENT_RECTS_BACK.map((rect, i) => (
        <div
          key={`back-${i}`}
          className="absolute left-0 w-full"
          style={{
            height: rect.height,
            top: rect.top,
            opacity: 0.26,
            background:
              "linear-gradient(356.76deg, rgba(0, 0, 0, 1) 2.81%, rgba(102, 102, 102, 0) 71.6%)",
          }}
        />
      ))}

      {GRADIENT_RECTS_FRONT.map((rect, i) => (
        <div
          key={`front-${i}`}
          className="absolute left-0 w-full"
          style={{
            height: rect.height,
            top: rect.top,
            opacity: 0.26,
            background:
              "linear-gradient(356.76deg, rgba(0, 0, 0, 0.5) 2.81%, rgba(102, 102, 102, 0) 71.6%)",
          }}
        />
      ))}

      <div
        className="absolute inset-x-0 bottom-0 h-[150px]"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
        }}
      />
    </div>
  );
}

/* =========================================================
   PRODUCTS PAGE
   ========================================================= */

export default function Products() {
  const introRef = useRef<HTMLParagraphElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState(DEFAULT_PRODUCT_ID);

  const activeProduct =
    PRODUCTS.find((product) => product.id === activeId) ?? PRODUCTS[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    <main
      className="relative min-h-screen w-full overflow-x-hidden text-white"
      style={{ background: buildOmbre(pageGradientLayers, BASE) }}
    >
      {/* TOP BLACK FADE */}
      <div
        className="
          pointer-events-none
          absolute inset-x-0 top-0 z-[100]
          h-[150px]
          bg-gradient-to-b from-black via-black/70 to-transparent
        "
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

      {/* CONTENT — normal document flow, spacing via padding/gap instead
          of absolute top offsets, so each section's real height pushes
          the next section down rather than everything stacking at 0. */}
      <div className="relative mx-auto w-full max-w-[1440px] px-[97px] pb-[120px]">
        {/* INTRO */}
        <p
          ref={introRef}
          className="
            futura-light
            mx-auto
            text-center
            text-[24px]
            leading-[28px]
            tracking-[0.08em]
            text-[#FFF5E5]
          "
          style={{
            width: "63.125%",
            maxWidth: 909,
            paddingTop: 94,
          }}
        >
          {INTRO_TEXT}
        </p>

        {/* PRODUCT THUMBNAILS */}
        <div
          ref={thumbsRef}
          className="
            mt-[80px]
            flex
            w-full
            flex-wrap
            justify-center
            gap-x-[57px]
            gap-y-[40px]
          "
        >
          {PRODUCTS.map((product) => (
            <ThumbnailCard
              key={product.id}
              product={product}
              isActive={product.id === activeId}
              onHover={() => setActiveId(product.id)}
            />
          ))}
        </div>

        {/* EXPLORE SECTION */}
        <div
          ref={exploreRef}
          className="
            mt-[96px]
            flex
            w-full
            flex-col
            gap-[48px]
            md:flex-row
            md:items-start
          "
        >
          {/* Product image + existing-site link, stacked */}
          <div className="flex w-full flex-col gap-[24px] md:w-1/2">
            <div className="overflow-hidden rounded-[8px]" style={{ height: 539 }}>
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="h-full w-full object-cover"
              />
            </div>

            <Link
              href={LIVE_CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                futura-medium
                w-fit
                text-[24px]
                leading-[60px]
                tracking-[0.3em]
                text-white
                underline-offset-4
                hover:underline
              "
            >
              REFER EXISTING WEBSITE
            </Link>
          </div>

          {/* Product information */}
          <div className="w-full text-white md:w-1/2 md:pl-[5%]">
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
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-[96px] flex w-full justify-center">
          <Link
            href="#"
            className="
              futura-light
              group
              inline-flex
              w-fit
              items-center
              rounded-full
              border border-white/30
              bg-white/[0.08]
              px-8 py-3
              text-[13px]
              tracking-wide
              text-white
              backdrop-blur-md
              transition-all duration-300
              hover:bg-white/[0.15]
            "
          >
            Get your Story{" "}
            <span className="futura-bold ml-1">Scripted</span>
            <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
              &gt;&gt;
            </span>
          </Link>
        </div>
      </div>

      {/* BOTTOM BLACK FADE */}
      <div
        className="
          pointer-events-none
          absolute inset-x-0 bottom-0 z-[100]
          h-[170px]
          bg-gradient-to-t from-black via-black/65 to-transparent
        "
      />
    </main>
  );
}