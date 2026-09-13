import Link from "next/link";
import Image from "next/image";
import type { EventItem } from "../../../../data/events";

type EventDetailsProps = {
  event: EventItem;
};

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[rgb(56_44_59)] text-[rgb(233_231_218)]">
      {/* Background image + overlays */}
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

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[1550px] px-[6%] pb-16 pt-[145px]">
        {/* Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="futura-light text-[10px] uppercase tracking-wide text-[rgb(233_231_218)]/40 transition-colors duration-300 hover:text-[rgb(233_231_218)]/75"
          >
            Home
          </Link>
          <span className="text-[10px] text-[rgb(233_231_218)]/30">
            &gt;&gt;
          </span>
          <Link
            href="/projects"
            className="futura-light text-[10px] uppercase tracking-wide text-[rgb(233_231_218)]/40 transition-colors duration-300 hover:text-[rgb(233_231_218)]/75"
          >
            Projects
          </Link>
          <span className="text-[10px] text-[rgb(233_231_218)]/30">
            &gt;&gt;
          </span>
          <span className="futura-light text-[10px] uppercase tracking-wide text-[rgb(233_231_218)]/45">
            {event.title}
          </span>
        </div>

        <div className="grid min-h-[calc(100vh-210px)] grid-cols-1 gap-14 lg:grid-cols-[45%_55%] lg:gap-6">
          {/* Left — event info */}
          <div className="flex items-center">
            <div className="w-full max-w-[650px]">
              <h1 className="futura-light text-[clamp(38px,3.1vw,58px)] uppercase leading-[1] tracking-[0.015em] text-[rgb(203_163_86)]">
                {event.title}
              </h1>

              {event.description.length > 0 && (
                <div className="mt-12 max-w-[600px] space-y-6">
                  {event.description.map((paragraph, index) => (
                    <p
                      key={index}
                      className="futura-light text-[clamp(14px,1vw,17px)] leading-[1.5] tracking-[0.02em] text-[rgb(233_231_218)]/80"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — 4-image layout */}
          <div className="flex items-center">
            <div className="grid w-full grid-cols-1 gap-7 sm:grid-cols-2">
              {event.images.slice(0, 4).map((image, index) => (
                <div
                  key={`${event.slug}-${index}`}
                  className="group relative aspect-[1.25/1] w-full overflow-hidden border border-[rgb(233_231_218)]/80 bg-[rgb(56_44_59)]/40"
                >
                  <Image
                    src={image}
                    alt={`${event.title} ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 27vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[rgb(83_36_57)]/10 transition-colors duration-500 group-hover:bg-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}