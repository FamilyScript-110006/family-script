"use client";

import Link from "next/link";
import type { Project } from "../../../data/projects";
import PageGradientBackground from "../layout/PageGradientBackground";

type ProjectDetailsProps = {
  project: Project;
};

export default function ProjectDetails({
  project,
}: ProjectDetailsProps) {
  const gallery = project.gallery;

  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#3c1a26]
        text-white
        md:bg-transparent
      "
    >
      {/* =========================================================
          DESKTOP BACKGROUND ONLY
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 hidden md:block">
        <img
          src={project.coverImage}
          alt=""
          className="h-full w-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(64,24,38,0.86) 0%, rgba(61,24,38,0.84) 40%, rgba(45,20,29,0.94) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(72,29,44,0.18) 0%, rgba(35,16,25,0.18) 100%)",
          }}
        />

        {/* Same top/bottom darkening rects as every other non-homepage
            page — no base-color layer here, so the cover photo (and
            the tint layers above) stay visible underneath. */}
        <PageGradientBackground includeBase={false} />
      </div>

      {/* =========================================================
          DESKTOP VERSION
      ========================================================= */}

      <section
        className="
          relative
          z-10
          mx-auto
          hidden
          min-h-screen
          w-full
          max-w-[1350px]
          px-5
          pb-10
          pt-24
          sm:px-7
          sm:pt-28
          md:block
          md:px-8
          md:pt-28
          lg:px-10
          lg:pt-28
        "
      >
        {/* BREADCRUMB */}

        <div className="mb-6 flex items-center gap-2 md:mb-7">
          <Link
            href="/"
            className="
              futura-light
              text-[9px]
              uppercase
              tracking-wide
              text-white/45
              transition-colors
              hover:text-white
              md:text-[11px]
            "
          >
            Home
          </Link>

          <span className="futura-light text-[9px] text-white/25 md:text-[11px]">
            &gt;&gt;
          </span>

          <Link
            href="/projects"
            className="
              futura-light
              text-[9px]
              uppercase
              tracking-wide
              text-white/45
              transition-colors
              hover:text-white
              md:text-[11px]
            "
          >
            Projects
          </Link>

          <span className="futura-light text-[9px] text-white/25 md:text-[11px]">
            &gt;&gt;
          </span>

          <span
            className="
              futura-light
              text-[9px]
              uppercase
              tracking-wide
              text-white/30
              md:text-[11px]
            "
          >
            {project.category}
          </span>
        </div>

        {/* DESKTOP CONTENT */}

        <div
          className="
            flex
            w-full
            flex-col
            gap-10
            lg:flex-row
            lg:items-start
            lg:gap-12
          "
        >
          {/* LEFT SIDE */}

          <div
            className="
              mt-8
              flex
              w-full
              shrink-0
              flex-col
              justify-start
              md:mt-12
              lg:mt-6
              lg:w-[42%]
              lg:pt-10
            "
          >
            <h1
              className="
                futura-light
                max-w-[470px]
                text-[32px]
                uppercase
                leading-[0.92]
                tracking-[0.015em]
                text-[#e3a94f]
                sm:text-[40px]
                md:text-[46px]
                lg:text-[50px]
                xl:text-[54px]
              "
            >
              {project.title}
            </h1>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-2
                lg:mt-6
              "
            >
              <span
                className="
                  futura-light
                  text-[10px]
                  uppercase
                  tracking-wide
                  text-white/75
                  md:text-[11px]
                  lg:text-[12px]
                "
              >
                {project.subtitle}
              </span>

              {project.location && (
                <span
                  className="
                    futura-light
                    text-[10px]
                    uppercase
                    tracking-wide
                    text-white/75
                    md:text-[11px]
                    lg:text-[12px]
                  "
                >
                  {project.location}
                </span>
              )}
            </div>

            <div
              className="
                mt-7
                max-w-[480px]
                space-y-5
                lg:mt-8
                lg:space-y-5
              "
            >
              {project.description.map((paragraph, index) => (
                <p
                  key={index}
                  className="
                    futura-light
                    text-[11px]
                    leading-[1.5]
                    tracking-wide
                    text-white/80
                    sm:text-[12px]
                    md:text-[13px]
                    lg:text-[14px]
                  "
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6">
              <span
                className="
                  futura-light
                  text-[9px]
                  tracking-wide
                  text-white/45
                "
              >
                Read more &gt;&gt;
              </span>
            </div>
          </div>

          {/* DESKTOP GALLERY */}

          <div className="w-full lg:w-[58%]">
            <div
              className="
                mx-auto
                grid
                w-full
                grid-cols-3
                gap-2
                md:gap-2.5
                lg:gap-3
              "
            >
              <GalleryImage
                src={gallery[0]?.image}
                alt={`${project.title} - 1`}
                className="
                  col-start-1
                  row-start-1
                  aspect-[1.40/0.87]
                "
              />

              <GalleryImage
                src={gallery[1]?.image}
                alt={`${project.title} - 2`}
                className="
                  col-start-2
                  row-start-1
                  aspect-[1.40/0.87]
                "
              />

              <GalleryImage
                src={gallery[2]?.image}
                alt={`${project.title} - 3`}
                className="
                  col-start-3
                  row-start-1
                  aspect-[1.40/0.87]
                "
              />

              <div
                className="
                  col-start-1
                  row-span-2
                  row-start-2
                  flex
                  items-center
                  justify-center
                  overflow-visible
                "
              >
                {project.bookImage && (
                  <img
                    src={project.bookImage}
                    alt={`${project.title} book`}
                    className={`
                      h-full
                      w-full

                      ${
                        project.slug === "dr-v-k-kutty"
                          ? "scale-[3]"
                          : project.slug === "vinod-kumar-khanna"
                          ? "scale-[1.35]"
                          : project.slug === "vasant-valley-school"
                          ? "scale-[1.85]"
                          : project.slug === "stapati-architects"
                          ? "scale-[2]"
                          : "scale-[1.40]"
                      }

                      translate-x-[50%]
                      object-contain
                      drop-shadow-[0_12px_15px_rgba(0,0,0,0.45)]
                      transition-transform
                      duration-700
                      ease-out
                      hover:-translate-y-2
                      hover:translate-x-[50%]
                    `}
                  />
                )}
              </div>

              <GalleryImage
                src={gallery[3]?.image}
                alt={`${project.title} - 4`}
                className="
                  col-start-3
                  row-start-2
                  aspect-[1.2/0.9]
                "
              />

              <GalleryImage
                src={gallery[4]?.image}
                alt={`${project.title} - 5`}
                className="
                  col-start-3
                  row-start-3
                  aspect-[1.2/0.9]
                "
              />

              <GalleryImage
                src={gallery[5]?.image}
                alt={`${project.title} - 6`}
                className="
                  col-start-1
                  row-start-4
                  aspect-[1.40/0.87]
                "
              />

              <GalleryImage
                src={gallery[6]?.image}
                alt={`${project.title} - 7`}
                className="
                  col-start-2
                  row-start-4
                  aspect-[1.40/0.87]
                "
              />

              <GalleryImage
                src={gallery[7]?.image}
                alt={`${project.title} - 8`}
                className="
                  col-start-3
                  row-start-4
                  aspect-[1.40/0.87]
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MOBILE VERSION
      ========================================================= */}

      <section
        className="
          relative
          z-10
          block
          min-h-screen
          w-full
          overflow-hidden
          md:hidden
        "
        style={{
          /*
           * SAME BACKGROUND FEEL AS THE PROJECTS PAGE
           *
           * TOP + SIDES = darker burgundy
           * CENTER = slightly lighter burgundy
           * BOTTOM = darker burgundy
           *
           * This removes the obvious #532439 block
           * and blends the colours smoothly.
           */
          background: `
            radial-gradient(
              ellipse at center,
              #421d2b 0%,
              #3f1b29 38%,
              #381923 68%,
              #23141c 100%
            )
          `,
        }}
      >
        {/* SPACE FOR EXISTING NAVBAR */}

        <div className="h-[58px] w-full" />

        {/* MOBILE CONTENT */}

        <div
          className="
            relative
            z-10
            w-full
            px-[18px]
            pb-8
            pt-[33px]
          "
        >
          {/* BOOK NAME - TOP */}

          <div className="mb-[10px]">
            <h1
              className="
                futura-bold
                text-[40px]
                uppercase
                leading-[1.02]
                tracking-[0.05em]
                text-[#e3a94f]
              "
            >
              {project.title}
            </h1>
          </div>

          {/* PERSON NAME + LOCATION */}

          <div className="mb-[18px]">
            <div className="flex items-center gap-[80px]">
              <span
                className="
                  futura-bold
                  text-[12px]
                  uppercase
                  tracking-[0.1em]
                  text-white/80
                "
              >
                {project.subtitle}
              </span>

              {project.location && (
                <span
                  className="
                    futura-light
                    text-[10px]
                    uppercase
                    tracking-[0.08em]
                    text-white/65
                  "
                >
                  {project.location}
                </span>
              )}
            </div>
          </div>

          {/* FIRST DESCRIPTION */}

          {project.description.length > 0 && (
            <div className="mb-[13px]">
              <p
                className="
                  futura-light
                  text-[12px]
                  leading-[1.5]
                  tracking-[0.01em]
                  text-white/85
                "
              >
                {project.description[0]}
              </p>
            </div>
          )}

          {/* BOOK IMAGE */}

          {project.bookImage && (
            <div
              className="
                my-[18px]
                flex
                w-full
                items-center
                justify-center
              "
            >
              <img
                src={project.bookImage}
                alt={`${project.title} book`}
                className={`
                  h-auto
                  w-[145px]
                  object-contain
                  drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]

                  ${
                    project.slug === "dr-v-k-kutty"
                      ? "scale-[1.45]"
                      : project.slug === "vinod-kumar-khanna"
                      ? "scale-[0.95]"
                      : project.slug === "vasant-valley-school"
                      ? "scale-[1.1]"
                      : project.slug === "stapati-architects"
                      ? "scale-[1.15]"
                      : "scale-[1]"
                  }
                `}
              />
            </div>
          )}

          {/* REMAINING DESCRIPTION */}

          {project.description.length > 1 && (
            <div className="space-y-[11px]">
              {project.description.slice(1).map((paragraph, index) => (
                <p
                  key={index}
                  className="
                    futura-light
                    text-[12px]
                    leading-[1.5]
                    tracking-[0.01em]
                    text-white/85
                  "
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* MOBILE GALLERY */}

          <div className="mt-[18px] grid grid-cols-2 gap-[9px]">
            {gallery.map((item, index) => (
              <div
                key={`${item.image}-${index}`}
                className="
                  group
                  relative
                  aspect-[1.55/1]
                  w-full
                  overflow-hidden
                "
              >
                <img
                  src={item.image}
                  alt={`${project.title} - ${index + 1}`}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.04]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-black/5
                    transition-colors
                    duration-500
                    group-hover:bg-transparent
                  "
                />
              </div>
            ))}
          </div>

          {/* GET STARTED */}

          <div className="mt-7 flex justify-center">
            <Link
              href="/"
              className="
                futura-light
                rounded-full
                border
                border-white/20
                px-4
                py-[5px]
                text-[6px]
                tracking-[0.08em]
                text-white/70
                transition-colors
                duration-300
                hover:bg-white/10
              "
            >
              Get your Story Started
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SOCIAL ICONS - DESKTOP ONLY
      ========================================================= */}

      <div
        className="
          fixed
          bottom-5
          right-4
          z-30
          hidden
          flex-col
          items-center
          gap-3
          text-white
          md:flex
          md:bottom-6
          md:right-6
        "
      >
        <span className="text-[12px]">f</span>
        <span className="text-[12px]">◎</span>
        <span className="text-[12px]">▶</span>
      </div>
    </main>
  );
}

/* =============================================================
   GALLERY IMAGE COMPONENT
============================================================= */

type GalleryImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

function GalleryImage({
  src,
  alt,
  className = "",
}: GalleryImageProps) {
  if (!src) {
    return (
      <div
        className={`
          overflow-hidden
          bg-white/5
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        group
        relative
        overflow-visible
        ${className}
      `}
    >
      <img
        src={src}
        alt={alt}
        className="
          h-full
          w-full
          object-cover
          transition-transform
          duration-700
          ease-out
          group-hover:scale-[1.04]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/5
          transition-colors
          duration-500
          group-hover:bg-transparent
        "
      />
    </div>
  );
}