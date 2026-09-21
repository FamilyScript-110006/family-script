import Link from "next/link";
import Image from "next/image";
import type { EventItem } from "../../../../data/events";
import { splitHeadingLines } from "../../../utils/splitHeading";
import EventDescription from "./EventDescription";

type EventDetailsProps = {
  event: EventItem;
};

export default function EventDetails({
  event,
}: EventDetailsProps) {
  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[rgb(56_44_59)]
        text-[rgb(233_231_218)]
      "
    >
      {/* ========================================================
          BACKGROUND IMAGE + OVERLAYS
          Existing visual treatment preserved.
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <Image
          src={event.coverImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[rgb(83_36_57)]/70" />

        <div className="absolute inset-0 bg-black/25" />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(83,36,59,0.15) 0%, rgba(56,44,59,0.35) 55%, rgba(20,16,20,0.92) 100%)",
          }}
        />
      </div>

      {/* ========================================================
          CONTENT CONTAINER
      ======================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          min-h-screen
          w-full
          max-w-[1550px]
          px-5
          pb-12
          pt-[112px]
          sm:px-7
          sm:pb-14
          sm:pt-[125px]
          md:px-[5%]
          md:pb-16
          md:pt-[145px]
          lg:px-[6%]
        "
      >

        {/* ======================================================
            BREADCRUMB
        ====================================================== */}

        <div
          className="
            mb-7
            flex
            flex-wrap
            items-center
            gap-2
            sm:mb-8
            md:mb-10
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

          <span className="text-[9px] text-[rgb(233_231_218)]/30 sm:text-[10px]">
            &gt;&gt;
          </span>

          <Link
            href="/projects"
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
            Projects
          </Link>

          <span className="text-[9px] text-[rgb(233_231_218)]/30 sm:text-[10px]">
            &gt;&gt;
          </span>

          <span
            className="
              futura-light
              max-w-[55%]
              truncate
              text-[9px]
              uppercase
              tracking-wide
              text-[rgb(233_231_218)]/45
              sm:text-[10px]
            "
          >
            {event.title}
          </span>
        </div>

        {/* ======================================================
            MAIN EVENT LAYOUT

            Mobile:
              info
              ↓
              2 × 2 gallery

            Desktop:
              info | gallery
        ====================================================== */}

        <div
          className="
            grid
            min-h-0
            grid-cols-1
            gap-10
            sm:gap-12
            lg:min-h-[calc(100vh-210px)]
            lg:grid-cols-[45%_55%]
            lg:gap-6
          "
        >

          {/* ====================================================
              LEFT — EVENT INFORMATION
          ==================================================== */}

          <div
            className="
              flex
              items-start
              lg:items-center
            "
          >
            <div
              className="
                w-full
                max-w-[650px]
              "
            >

              {/* EVENT TITLE */}

              <h1
                className="
                  futura-light
                  max-w-[95%]
                  text-[clamp(34px,8.5vw,46px)]
                  uppercase
                  leading-[0.98]
                  tracking-[0.015em]
                  text-[rgb(203_163_86)]
                  sm:text-[clamp(38px,5vw,52px)]
                  lg:text-[clamp(38px,3.1vw,58px)]
                "
              >
                {splitHeadingLines(event.title).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              {/* DESCRIPTION */}

              <EventDescription
                key={event.slug}
                paragraphs={event.description}
              />
            </div>
          </div>

          {/* ====================================================
              RIGHT — EVENT IMAGE GALLERY

              IMPORTANT:
              2 columns already existed from sm upward.
              We now deliberately keep 2 columns on mobile too,
              matching the supplied responsive reference.
          ==================================================== */}

          <div
            className="
              flex
              items-start
              lg:items-center
            "
          >
            <div
              className="
                grid
                w-full
                grid-cols-2
                gap-3
                sm:gap-5
                md:gap-6
                lg:gap-7
              "
            >
              {event.images
                .slice(0, 4)
                .map((image, index) => (
                  <div
                    key={`${event.slug}-${index}`}
                    className="
                      group
                      relative
                      aspect-[1.25/1]
                      w-full
                      overflow-hidden
                      border
                      border-[rgb(233_231_218)]/80
                      bg-[rgb(56_44_59)]/40
                    "
                  >
                    <Image
                      src={image}
                      alt={`${event.title} ${index + 1}`}
                      fill
                      sizes="
                        (max-width: 640px) 44vw,
                        (max-width: 1024px) 45vw,
                        27vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.035]
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[rgb(83_36_57)]/10
                        transition-colors
                        duration-500
                        group-hover:bg-transparent
                      "
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}