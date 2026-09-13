import Link from "next/link";
import Image from "next/image";
import { events } from "../../../../data/events";

export default function EventsGrid() {
  return (
    <section
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#32141f]
        text-[rgb(233_231_218)]
      "
    >
      {/* =========================================================
          BACKGROUND
          Existing gradient preserved exactly.
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Top burgundy */}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #431827 0%, #3b1724 38%, #2b1821 72%, #171319 100%)",
          }}
        />

        {/* Subtle center glow */}

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(119,57,65,0.12), transparent 55%)",
          }}
        />

        {/* Bottom darkness */}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 55%, rgba(10,8,10,0.32) 100%)",
          }}
        />
      </div>

      {/* =========================================================
          CONTENT CONTAINER
      ========================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1500px]
          px-5
          pb-14
          pt-[108px]
          sm:px-7
          sm:pb-16
          sm:pt-[125px]
          md:px-[6%]
          md:pb-20
          md:pt-[145px]
          lg:px-[7.2%]
        "
      >

        {/* ======================================================
            BREADCRUMB
        ====================================================== */}

        <div
          className="
            mb-5
            flex
            items-center
            gap-2
            sm:mb-6
          "
        >
          <Link
            href="/"
            className="
              futura-light
              text-[9px]
              uppercase
              tracking-wide
              text-[rgb(233_231_218)]/40
              transition-colors
              duration-300
              hover:text-[rgb(233_231_218)]/75
              sm:text-[10px]
            "
          >
            Home
          </Link>

          <span className="futura-light text-[9px] text-[rgb(233_231_218)]/30 sm:text-[10px]">
            &gt;&gt;
          </span>

          <span
            className="
              futura-light
              text-[9px]
              uppercase
              tracking-wide
              text-[rgb(233_231_218)]/45
              sm:text-[10px]
            "
          >
            Events
          </span>
        </div>

        {/* ======================================================
            HEADING
        ====================================================== */}

        <div
          className="
            mb-7
            sm:mb-8
          "
        >
          <h1
            className="
              futura-light
              text-[clamp(38px,10vw,58px)]
              uppercase
              leading-none
              tracking-[0.01em]
              text-[rgb(203_163_86)]
            "
          >
            Events
          </h1>

          <p
            className="
              futura-light
              mt-3
              max-w-[520px]
              text-[12px]
              leading-[1.5]
              tracking-[0.02em]
              text-[rgb(210_198_178)]
              sm:mt-4
              sm:text-[14px]
              md:text-[clamp(14px,1vw,17px)]
            "
          >
            From memories and archives to beautifully
            crafted events,
            <br className="hidden sm:block" />
            we preserve stories that matter.
          </p>
        </div>

        {/* ======================================================
            EVENT GRID

            Mobile   → 1 column
            Tablet   → 2 columns
            Desktop  → 3 columns

            Existing card visual effects preserved.
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-x-6
            gap-y-7
            sm:grid-cols-2
            sm:gap-x-7
            sm:gap-y-8
            lg:grid-cols-3
            lg:gap-x-12
            lg:gap-y-8
          "
        >
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/projects/events/${event.slug}`}
              className="group block"
            >
              <div
                className="
                  relative
                  aspect-[1.48/1]
                  w-full
                  overflow-hidden
                  bg-[rgb(56_44_59)]
                "
              >
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    33vw
                  "
                  className="
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
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[rgb(83_36_57)]/10
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />
              </div>

              <p
                className="
                  futura-light
                  mt-2
                  text-[10px]
                  uppercase
                  tracking-[0.08em]
                  text-[rgb(233_231_218)]
                  transition-colors
                  duration-300
                  group-hover:text-[rgb(203_163_86)]
                  sm:text-[11px]
                "
              >
                {event.title}
              </p>
            </Link>
          ))}
        </div>

        {/* ======================================================
            CTA
        ====================================================== */}

        <div
          className="
            mt-10
            flex
            justify-center
            sm:mt-12
          "
        >
          <Link
            href="/contact"
            className="
              futura-light
              rounded-full
              bg-[rgb(210_198_178)]/35
              px-5
              py-2
              text-[12px]
              tracking-[0.03em]
              text-[rgb(233_231_218)]
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:bg-[rgb(210_198_178)]/50
              sm:px-6
              sm:text-[15px]
            "
          >
            Get your Story{" "}
            <span className="futura-bold">
              Scripted
            </span>{" "}
            &gt;&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}