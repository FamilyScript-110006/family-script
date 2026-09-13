"use client";

import Link from "next/link";

const projects = [
  {
    title: "BIOGRAPHICAL",
    image: "/assets/PROJECTS/BIOGRAPHICAL.png",
    href: "/projects/biographical",
  },
  {
    title: "INSTITUTIONAL",
    image: "/assets/projects/INSTITUTIONAL.png",
    href: "/projects/institutional",
  },
  {
    title: "EVENTS",
    image: "/assets/projects/EVENTS.png",
    href: "/projects/events",
  },
];

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#32141f] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #431827 0%, #3b1724 38%, #2b1821 72%, #171319 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(119,57,65,0.12), transparent 55%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 55%, rgba(10,8,10,0.32) 100%)",
          }}
        />
      </div>

      {/* =========================================================
          DESKTOP VERSION
      ========================================================= */}

      <section className="relative z-10 mx-auto hidden min-h-screen w-full max-w-[1500px] px-8 pb-24 pt-28 md:block md:px-[6%] md:pt-[7%]">
        {/* BREADCRUMB */}

        <div className="mb-10 flex items-center gap-2">
          <Link
            href="/"
            className="futura-light text-[12px] uppercase tracking-wide text-white/35 transition-colors duration-300 hover:text-white/70 md:text-[13px]"
          >
            Home
          </Link>

          <span className="futura-light text-[12px] text-white/30 md:text-[13px]">
            &gt;&gt;
          </span>

          <span className="futura-light text-[12px] uppercase tracking-wide text-white/35 md:text-[13px]">
            Projects
          </span>
        </div>

        {/* INTRO */}

        <div className="max-w-[650px]">
          <p className="futura-light text-[14px] uppercase tracking-[0.48em] text-white/90 md:text-[18px]">
            Beyond The
          </p>

          <h1 className="futura-bold mt-3 text-[52px] uppercase leading-none tracking-[0.01em] text-[#e7ad55] md:text-[64px] lg:text-[68px]">
            Projects
          </h1>

          <p className="futura-light mt-9 max-w-[620px] text-[17px] leading-[1.6] tracking-wide text-white/65 md:text-[19px]">
            From concept to completion, we preserve the people, purpose, and
            journey of every project.
          </p>
        </div>

        {/* PROJECT GRID */}

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-3 md:gap-x-[6%] md:gap-y-0">
          {projects.map((project) => (
            <Link
              key={project.title}
              href={project.href}
              className="group block"
            >
              <div className="relative aspect-[1.35/1] w-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                />

                <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/0" />
              </div>

              <div className="mt-5 text-center">
                <h2 className="futura-light text-[18px] uppercase tracking-[0.35em] text-white md:text-[20px]">
                  {project.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          MOBILE VERSION
      ========================================================= */}

      <section className="relative z-10 min-h-screen w-full px-[15px] pb-16 pt-25 md:hidden">
        {/* BREADCRUMB */}

        <div className="mb-10 flex items-center gap-[5px]">
          <Link
            href="/"
            className="futura-light text-[10px] uppercase tracking-[0.08em] text-white/40"
          >
            Home
          </Link>

          <span className="futura-light text-[10px] text-white/25">
            &gt;&gt;
          </span>

          <span className="futura-light text-[10px] uppercase tracking-[0.08em] text-white/40">
            Projects
          </span>
        </div>

        {/* INTRO */}

        <div className="mb-16">
          <p className="futura-medium text-[20px] uppercase tracking-[0.34em] text-white/85">
            Beyond The
          </p>

          <h1 className="futura-bold mt-1 text-[60px] uppercase leading-none tracking-[0.01em] text-[#e7ad55]">
            Projects
          </h1>

          <p className="futura-light mt-6 max-w-[280px] text-[16px] leading-[1.6] tracking-[0.03em] text-white/60">
            From concept to completion, we preserve the people, purpose, and journey of every project.
          </p>
        </div>

        {/* =====================================================
            MOBILE PROJECTS
        ===================================================== */}

        <div className="flex flex-col gap-12">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <Link
                key={project.title}
                href={project.href}
                className={`group flex w-full items-center ${
                  isEven ? "justify-end" : "justify-start"
                }`}
              >
                {/* LEFT TEXT FOR EVEN */}

                {isEven && (
                  <div className="flex w-[42%] justify-center pr-8">
                    <h2 className="futura-light text-center text-[20px] uppercase leading-[1.2] tracking-[0.22em] text-white">
                      {project.title}
                    </h2>
                  </div>
                )}

                {/* IMAGE */}

                <div className="relative w-[50%] overflow-visible">
                  <div className="aspect-[1.35/1] w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/0" />
                  </div>
                </div>

                {/* RIGHT TEXT FOR ODD */}

                {!isEven && (
                  
                  <div className="flex w-[42%] justify-center pl-7">
                    <h2 className="futura-light text-center text-[20px] uppercase leading-[1.2] tracking-[0.22em] text-white">
                      {project.title}
                    </h2>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* GET STARTED */}

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="futura-light rounded-full border border-white/20 px-5 py-2 text-[10px] tracking-[0.08em] text-white/70 transition-colors duration-300 hover:bg-white/10"
          >
            Get your Story Started
          </Link>
        </div>
      </section>
    </main>
  );
}