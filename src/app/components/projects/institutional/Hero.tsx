"use client";

import Link from "next/link";
import PageGradientBackground from "../../layout/PageGradientBackground";

const institutionalProjects = [
  {
    name: "VASANT VALLEY SCHOOL",
    image: "/assets/projects/institutional/VASANT VALLEY SCHOOL.jpg",
    href: "/projects/institutional/vasant-valley-school",
  },
  {
    name: "STAPATI ARCHITECTS",
    image: "/assets/projects/institutional/STAPATI.jpg",
    href: "/projects/institutional/stapati-architects",
  },
];

export default function Hero() {
  return (
    <section
      className="
        relative
        min-h-screen
        w-full
        bg-[#532439]
        text-white
      "
    >
      <PageGradientBackground />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          min-h-screen
          w-full
          max-w-[1500px]
          px-6
          pb-20
          pt-24

          sm:px-8
          sm:pt-28

          md:px-[6%]
          md:pt-[7%]
        "
      >
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-wrap
            items-center
            gap-2

            md:mb-10
          "
        >
          <Link
            href="/"
            className="
              futura-light
              text-[10px]
              uppercase
              tracking-wide
              text-white/35
              transition-colors
              duration-300
              hover:text-white/70

              md:text-[13px]
            "
          >
            Home
          </Link>

          <span
            className="
              futura-light
              text-[10px]
              text-white/30

              md:text-[13px]
            "
          >
            &gt;&gt;
          </span>

          <Link
            href="/projects"
            className="
              futura-light
              text-[10px]
              uppercase
              tracking-wide
              text-white/35
              transition-colors
              duration-300
              hover:text-white/70

              md:text-[13px]
            "
          >
            Projects
          </Link>

          <span
            className="
              futura-light
              text-[10px]
              text-white/30

              md:text-[13px]
            "
          >
            &gt;&gt;
          </span>

          <span
            className="
              futura-light
              text-[10px]
              uppercase
              tracking-wide
              text-white/35

              md:text-[13px]
            "
          >
            Institutional
          </span>
        </div>

        {/* =================================================
            INTRO
        ================================================= */}

        <div className="max-w-[650px]">
          <h1
            className="
              futura-bold
              text-[44px]
              uppercase
              leading-none
              tracking-[0.01em]
              text-[#e7ad55]

              sm:text-[54px]

              md:text-[64px]

              lg:text-[68px]
            "
          >
            Institutional
          </h1>

          <p
            className="
              futura-light
              mt-7
              max-w-[620px]
              text-[15px]
              leading-[1.6]
              tracking-wide
              text-white/65

              sm:text-[17px]

              md:mt-9
              md:text-[19px]
            "
          >
            From institutions and their people to the practices and
            philosophies that shape them, we preserve stories of
            collective legacy.
          </p>
        </div>

        {/* =================================================
            INSTITUTIONAL PROJECT GRID
        ================================================= */}

        <div
          className="
            mt-12
            grid
            grid-cols-1
            gap-10

            sm:grid-cols-2

            md:mt-16
            md:gap-x-[4.5%]
            md:gap-y-10
          "
        >
          {institutionalProjects.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group block"
            >
              {/* IMAGE */}

              <div
                className="
                  relative
                  aspect-[1.35/1]
                  w-full
                  overflow-visible
                "
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="
                    h-full
                    w-full
                    object-cover
                    grayscale
                    transition-all
                    duration-700
                    ease-out
                    group-hover:scale-[1.03]
                    group-hover:grayscale-0
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/5
                    transition-colors
                    duration-500
                    group-hover:bg-black/0
                  "
                />
              </div>

              {/* NAME */}

              <div className="mt-4">
                <h2
                  className="
                    futura-light
                    text-[15px]
                    uppercase
                    tracking-[0.16em]
                    text-white

                    md:text-[18px]

                    lg:text-[20px]
                  "
                >
                  {project.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}