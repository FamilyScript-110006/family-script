"use client";

import Link from "next/link";

const people = [
  {
    name: "AKHIL BAKSHI",
    image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/cover.jpg",
    href: "/projects/biographical/akhil-bakshi",
  },
  {
    name: "REVA KHANNA",
    image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/cover.jpg",
    href: "/projects/biographical/reva-khanna",
  },
  {
    name: "DR. V KUTTY",
    image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/cover.jpg",
    href: "/projects/biographical/dr-v-k-kutty",
  },
  {
    name: "RENU MEHRA",
    image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/cover.png",
    href: "/projects/biographical/renu-mehra",
  },
  {
    name: "SUDHA GUPTA",
    image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/cover.jpg",
    href: "/projects/biographical/sudha-gupta",
  },
  {
    name: "SUDHA RAINA",
    image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/cover.png",
    href: "/projects/biographical/sudha-raina",
  },
  {
    name: "VINOD KUMAR KHANNA",
    image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/cover.png",
    href: "/projects/biographical/vinod-kumar-khanna",
  },
  {
    name: "BELA DEVI",
    image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/cover.png",
    href: "/projects/biographical/bela-devi",
  },
  {
    name: "SULAKHYANA PATTANAYAK",
    image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/cover.png",
    href: "/projects/biographical/sulakhyana-pattanayak",
  },
  {
    name: "DR. K D BHARGAVA",
    image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/cover.png",
    href: "/projects/biographical/dr-k-d-bhargava",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-x-hidden bg-[#480424] text-white">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

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

      {/* =====================================================
          DESKTOP VERSION
      ===================================================== */}

      <section className="relative z-10 mx-auto hidden min-h-screen w-full max-w-[1500px] px-6 pb-20 pt-24 md:block md:px-[6%] md:pt-[7%]">
        {/* BREADCRUMB */}

        <div className="mb-10 flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="futura-light text-[10px] uppercase tracking-wide text-white/35 transition-colors duration-300 hover:text-white/70 md:text-[13px]"
          >
            Home
          </Link>

          <span className="futura-light text-[10px] text-white/30 md:text-[13px]">
            &gt;&gt;
          </span>

          <Link
            href="/projects"
            className="futura-light text-[10px] uppercase tracking-wide text-white/35 transition-colors duration-300 hover:text-white/70 md:text-[13px]"
          >
            Projects
          </Link>

          <span className="futura-light text-[10px] text-white/30 md:text-[13px]">
            &gt;&gt;
          </span>

          <span className="futura-light text-[10px] uppercase tracking-wide text-white/35 md:text-[13px]">
            Biographical
          </span>
        </div>

        {/* INTRO */}

        <div className="max-w-[650px]">
          <h1 className="futura-bold text-[44px] uppercase leading-none tracking-[0.01em] text-[#e7ad55] sm:text-[54px] md:text-[64px] lg:text-[68px]">
            Biographical
          </h1>

          <p className="futura-light mt-7 max-w-[620px] text-[15px] leading-[1.6] tracking-wide text-white/65 sm:text-[17px] md:mt-9 md:text-[19px]">
            From memories and archives to beautifully crafted biographies,
            <br className="hidden md:block" />
            we preserve stories that matter.
          </p>
        </div>

        {/* PEOPLE GRID */}

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-16 md:grid-cols-3 md:gap-x-[4.5%] md:gap-y-10 lg:grid-cols-5 lg:gap-y-8">
          {people.map((person) => (
            <Link key={person.name} href={person.href} className="group block">
              <div className="relative aspect-[1.35/1] w-full">
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/0" />
              </div>

              <div className="mt-4 text-center">
                <h2 className="futura-light text-[15px] uppercase tracking-[0.16em] text-white md:text-[18px] lg:text-[20px]">
                  {person.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          MOBILE VERSION
      ===================================================== */}

      <section className="relative z-10 min-h-screen w-full px-[15px] pb-16 pt-20 md:hidden">
        {/* BREADCRUMB */}

        <div className="mb-7 flex items-center gap-[5px]">
          <Link
            href="/"
            className="futura-light text-[7px] uppercase tracking-[0.08em] text-white/40"
          >
            Home
          </Link>

          <span className="futura-light text-[7px] text-white/25">
            &gt;&gt;
          </span>

          <Link
            href="/projects"
            className="futura-light text-[7px] uppercase tracking-[0.08em] text-white/40"
          >
            Projects
          </Link>

          <span className="futura-light text-[7px] text-white/25">
            &gt;&gt;
          </span>

          <span className="futura-light text-[7px] uppercase tracking-[0.08em] text-white/40">
            Biographical
          </span>
        </div>

        {/* TITLE */}

        <div>
          <h1 className="futura-bold text-[25px] uppercase leading-none tracking-[0.01em] text-[#e7ad55]">
            Biographical
          </h1>

          <p className="futura-light mt-3 max-w-[230px] text-[7px] leading-[1.5] tracking-[0.03em] text-white/60">
            From memories and archives to beautifully crafted biographies, we
            preserve stories that matter.
          </p>
        </div>

        {/* =====================================================
            MOBILE PEOPLE GRID
        ===================================================== */}

        <div className="mt-7 grid grid-cols-2 gap-x-[9px] gap-y-7">
          {people.map((person) => (
            <Link
              key={person.name}
              href={person.href}
              className="group block min-w-0"
            >
              {/* IMAGE */}

              <div className="relative aspect-[1.35/1] w-full overflow-visible">
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.035] group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/0" />
              </div>

              {/* NAME */}

              <div className="mt-[6px] text-center">
                <h2 className="futura-light text-[5.5px] uppercase leading-[1.25] tracking-[0.17em] text-white">
                  {person.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {/* GET STARTED */}

        <div className="mt-9 flex justify-center">
          <Link
            href="/"
            className="futura-light rounded-full border border-white/20 px-4 py-[4px] text-[6px] tracking-[0.08em] text-white/70 transition-colors duration-300 hover:bg-white/10"
          >
            Get your Story Started
          </Link>
        </div>
      </section>
    </section>
  );
}