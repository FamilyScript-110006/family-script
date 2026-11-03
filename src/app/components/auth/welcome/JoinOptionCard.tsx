import Link from "next/link";

/* ============================================================
   JOIN OPTION CARD  (Family / Friends / Institution)

   Default : cream card with a hand-drawn illustration.
   Hover   : the purple wave rises from the bottom edge (0.3s ease-out,
             same as the Figma prototype) and stops where the design shows
             it: tucked into the lower-right corner, most of it still
             below / outside the card (the card clips the rest).
   Click   : goes to the sign-in screen.
============================================================ */

export type JoinType = "family" | "friends" | "institution";

type Illustration = {
  src: string;
  width: number;
  height: number;
};

const ILLUSTRATIONS: Record<JoinType, Illustration> = {
  family: { src: "/auth/cards/family.png", width: 190, height: 175 },
  friends: { src: "/auth/cards/friends.png", width: 174, height: 172 },
  institution: { src: "/auth/cards/institution.png", width: 171, height: 176 },
};

/* Where the wave rests on hover, in card pixels (card is 244 x 266). */
const WAVE_LEFT = -1;
const WAVE_TOP =80;

type JoinOptionCardProps = {
  type: JoinType;
  title: string;
  description: string;
};

export default function JoinOptionCard({
  type,
  title,
  description,
}: JoinOptionCardProps) {
  const art = ILLUSTRATIONS[type];

  return (
    <Link
      href={`/sign-in?type=${type}`}
      className="group pointer-events-auto relative flex h-[266px] w-[244px] shrink-0 cursor-pointer flex-col items-start justify-end gap-[10px] overflow-hidden rounded-[31px] border border-solid border-[rgba(233,231,218,0.3)] bg-soft-ivory px-[24px] py-[20px] shadow-[5px_2px_29.2px_0px_rgba(0,0,0,0.05)] outline-none"
    >
      {/* Wave: parked below the card, rises into the lower-right corner on
          hover / focus. Resting position (WAVE_LEFT / WAVE_TOP, measured from
          the Figma hover state) leaves only the corner visible; the card's
          overflow-hidden crops the rest. Nudge those two numbers if needed. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/auth/wave.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-0 h-[243px] w-[244px] max-w-none translate-y-[110%] transition-transform duration-300 ease-out will-change-transform group-hover:translate-y-0 group-focus-visible:translate-y-0"
        style={{ left: WAVE_LEFT, top: WAVE_TOP }}
      />

      {/* Illustration (already cropped to its box in the export from Figma) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={art.src}
        alt=""
        draggable={false}
        className="pointer-events-none relative z-10 shrink-0 mix-blend-multiply"
        style={{ width: art.width, height: art.height }}
      />

      {/* Title row + description */}
      <div className="relative z-10 flex w-full shrink-0 flex-col items-start gap-[5px]">
        <div className="flex w-full items-center justify-between">
          <span className="futura-medium whitespace-nowrap text-[19px] tracking-[3.4px] text-dark-burgundy">
            {title}
          </span>

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0 text-dark-burgundy"
          >
            <path
              fill="currentColor"
              d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
            />
          </svg>
        </div>

        <span className="futura-light w-full text-[12px] text-[#3b3b3b]">
          {description}
        </span>
      </div>
    </Link>
  );
}
