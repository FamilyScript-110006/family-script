
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import productsData from "./products.json";
import CTAButton from "../layout/CTAButton";

gsap.registerPlugin(ScrollTrigger);

const INTRO_TEXT =
  "Discover meaningful ways to preserve memories, celebrate milestones, and share your family's story.";

const LIVE_CATALOG_URL =
  "https://familyscript.com/category/all-products";

const BANNER_PHOTO = "/assets/Products/upper-img.png";

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

const EXPLORE_IDS = [
  "indigo-chronicles",
  "cherish",
  "create",
  "celebrate",
];

function BannerOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background:
          "linear-gradient(to bottom, rgba(53,16,31,0.55) 0%, rgba(57,14,33,0.22) 50%, rgba(37,8,23,0.12) 100%)",
      }}
    />
  );
}

function ThumbnailCard({ product }: { product: Product }) {
  const scrollToExplore = () => {
    document
      .getElementById(`explore-${product.id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={scrollToExplore}
      className="w-full max-w-[243px] shrink-0 text-left sm:w-[calc(50%-12px)] md:w-[220px] lg:w-[243px]"
      aria-label={`Jump to ${product.name}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <p className="futura-light mt-3 text-center text-xs leading-5 tracking-wide text-white sm:text-sm">
        {product.name}
      </p>
    </button>
  );
}

function FullExperience() {
  return (
    <div className="relative mt-10 w-full overflow-hidden rounded-lg sm:mt-14 lg:mt-16">
      <img
        src="/assets/Products/indigo-brochure.png"
        alt="The Indigo Chronicles experience, including postcards and journal spreads"
        className="h-auto w-full"
      />
    </div>
  );
}


function ExplorePanel({
  product,
  reverse,
  registerRef,
}: {
  product: Product;
  reverse: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const gallery =
    product.gallery?.length ? product.gallery : [product.image];

  const [index, setIndex] = useState(0);

  const goPrev = () =>
    setIndex((i) => (i - 1 + gallery.length) % gallery.length);

  const goNext = () =>
    setIndex((i) => (i + 1) % gallery.length);

  const imageBlock = (
    <div className="relative w-full md:w-1/2">
      <div className="h-[200px] overflow-hidden rounded-lg sm:h-[240px] md:h-[280px] lg:h-[320px]">
        <img
          src={gallery[index]}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            if (
              e.currentTarget.src !==
              window.location.origin + product.image
            ) {
              e.currentTarget.src = product.image;
            }
          }}
        />
      </div>

      {gallery.length > 1 && (
        <>
          {/* Previous Image */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#CBA356]/50 bg-[#35101f]/85 text-[#E9E7DA] shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#CBA356] hover:bg-[#CBA356] hover:text-[#35101f] sm:left-4 sm:h-11 sm:w-11"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Next Image */}
          <button
            type="button"
            aria-label="Next image"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#CBA356]/50 bg-[#35101f]/85 text-[#E9E7DA] shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#CBA356] hover:bg-[#CBA356] hover:text-[#35101f] sm:right-4 sm:h-11 sm:w-11"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );

  const textBlock = (
    <div className="flex w-full flex-col text-white md:w-1/2 md:px-5 lg:px-8">
      <p className="futura-medium text-xs tracking-[0.2em] text-[#D2C6B2] sm:text-sm">
        EXPLORE
      </p>

      <h2 className="futura-medium mt-2 text-xl leading-tight tracking-wide sm:text-2xl md:text-3xl">
        {product.name.split(":")[0].toUpperCase()}
      </h2>

      {/* Scrollable product content */}
      <div className="mt-4 max-h-[180px] overflow-y-auto overscroll-contain pr-3 sm:max-h-[210px] md:max-h-[230px] lg:max-h-[260px]">
        <div className="flex flex-col gap-3">
          {product.segments.map((segment) => (
            <p
              key={segment.title}
              className="text-xs leading-5 tracking-wide text-[#E9E7DA] sm:text-sm sm:leading-6"
            >
              <span className="futura-medium">
                {segment.title}:{" "}
              </span>
              <span className="futura-light">
                {segment.description}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={registerRef}
      id={`explore-${product.id}`}
      className={`mt-10 flex w-full scroll-mt-24 flex-col gap-5 sm:mt-12 sm:gap-6 md:mt-16 md:items-center md:gap-8 lg:mt-20 ${reverse ? "md:flex-row-reverse" : "md:flex-row"
        }`}
    >
      {imageBlock}
      {textBlock}
    </div>
  );
}


export default function Products() {
  const headingRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const exploreRefs = useRef<(HTMLDivElement | null)[]>([]);

  const exploreProducts = PRODUCTS.filter((p) =>
    EXPLORE_IDS.includes(p.id)
  );

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
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#35101f] via-[#390e21] to-[#250817] text-white">
      {/* Banner */}
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[280px] md:h-[320px] lg:h-[356px]">
        <img
          src={BANNER_PHOTO}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <BannerOverlay />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 sm:pb-20 md:px-10 md:pb-24 lg:px-16 xl:px-24">
        {/* Heading */}
        <div
          ref={headingRef}
          className="pt-10 text-center sm:pt-14 md:pt-16 lg:pt-20"
        >
          <h1 className="futura-light text-2xl tracking-[0.1em] sm:text-3xl md:text-4xl lg:text-5xl">
            OUR <span className="futura-bold">PRODUCTS</span>
          </h1>
        </div>

        {/* Intro */}
        <p
          ref={introRef}
          className="futura-light mx-auto max-w-3xl pt-5 text-center text-sm leading-6 tracking-wide text-[#E9E7DA] sm:pt-6 sm:text-base sm:leading-7 md:pt-8 md:text-lg lg:text-xl"
        >
          {INTRO_TEXT}
        </p>

        {/* Product thumbnails */}
        <div
          ref={thumbsRef}
          className="mt-8 grid grid-cols-2 justify-items-center gap-x-4 gap-y-7 sm:mt-10 sm:gap-x-6 sm:gap-y-8 md:mt-14 md:grid-cols-3 lg:mt-16 lg:grid-cols-4 lg:gap-x-8"
        >
          {PRODUCTS.map((product) => (
            <ThumbnailCard key={product.id} product={product} />
          ))}
        </div>

        {/* Full experience */}
        <div ref={experienceRef}>
          <FullExperience />
        </div>

        {/* Explore sections */}
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

        {/* Existing catalog */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href={LIVE_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="futura-medium text-center text-xs tracking-[0.15em] text-white underline-offset-4 transition hover:underline sm:text-sm sm:tracking-[0.2em] md:text-base"
          >
            REFER EXISTING WEBSITE
          </Link>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="mt-14 flex w-full justify-center sm:mt-16 md:mt-20"
        >
          <CTAButton />
        </div>
      </div>
    </main>
  );
}
