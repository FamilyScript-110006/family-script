import Link from "next/link";
import Image from "next/image";
import { events } from "../../../../data/events";

export default function EventsGrid() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#32141f] text-[rgb(233_231_218)]">
      {/* =========================================================
          BACKGROUND — exact copy of Projects page Hero gradient
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

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-[7%] pb-20 pt-[145px] lg:px-[7.2%]">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/"
            className="futura-light text-[10px] uppercase tracking-wide text-[rgb(233_231_218)]/40 transition-colors duration-300 hover:text-[rgb(233_231_218)]/75"
          >
            Home
          </Link>
          <span className="futura-light text-[10px] text-[rgb(233_231_218)]/30">
            &gt;&gt;
          </span>
          <span className="futura-light text-[10px] uppercase tracking-wide text-[rgb(233_231_218)]/45">
            Events
          </span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="futura-light text-[clamp(42px,3.1vw,58px)] uppercase leading-none tracking-[0.01em] text-[rgb(203_163_86)]">
            Events
          </h1>
          <p className="futura-light mt-4 max-w-[520px] text-[clamp(14px,1vw,17px)] leading-[1.5] tracking-[0.02em] text-[rgb(210_198_178)]">
            From memories and archives to beautifully crafted events,
            <br className="hidden sm:block" />
            we preserve stories that matter.
          </p>
        </div>

        {/* Event grid */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-8">
          {events.map((event) => (
            <Link key={event.slug} href={`/projects/events/${event.slug}`} className="group block">
              <div className="relative aspect-[1.48/1] w-full overflow-hidden bg-[rgb(56_44_59)]">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-[rgb(83_36_57)]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <p className="futura-light mt-2 text-[11px] uppercase tracking-[0.08em] text-[rgb(233_231_218)] transition-colors duration-300 group-hover:text-[rgb(203_163_86)]">
                {event.title}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/contact"
            className="futura-light rounded-full bg-[rgb(210_198_178)]/35 px-6 py-2 text-[15px] tracking-[0.03em] text-[rgb(233_231_218)] transition-all duration-300 hover:bg-[rgb(210_198_178)]/50 hover:scale-[1.02]"
          >
            Get your Story <span className="futura-bold">Scripted</span> &gt;&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}