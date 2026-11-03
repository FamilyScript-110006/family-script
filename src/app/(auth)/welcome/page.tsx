import Link from "next/link";

import { JoinOptionCard, Stage } from "@/app/components/auth";

/* ============================================================
   WELCOME SCREEN   (/welcome)

   Figma: FS_Website_Wireframing -> Welcome Screen (1303:982)

   Top of the page : logo, heading, subtitle
   Bottom of the page : the three cards, then the CTA button
   (the bottom group is pinned to the bottom edge so the page
   fills the screen at any height).
============================================================ */

export default function WelcomePage() {
  return (
    <Stage>
      {/* "Select how you'd like to join and get started." */}
      <p className="futura-light absolute left-1/2 top-[386px] w-[403px] -translate-x-1/2 -translate-y-1/2 text-center text-[20px] text-antique-gold">
        Select how you&rsquo;d like to join and get started.
      </p>

      {/* Three cards, 244 x 266, 32px apart, centered. */}
      <div className="absolute bottom-[103px] left-1/2 flex -translate-x-1/2 items-center gap-[32px]">
        <JoinOptionCard
          type="family"
          title="FAMILY"
          description="Bring your family closer"
        />
        <JoinOptionCard
          type="friends"
          title="FRIENDS"
          description="Stay connected with your people"
        />
        <JoinOptionCard
          type="institution"
          title="INSTITUTION"
          description="Connect with your community"
        />
      </div>

      {/* "Start your Journey with Family Script" */}
      <Link
        href="/sign-in"
        className="futura-light pointer-events-auto absolute bottom-[22px] left-1/2 flex h-[44px] w-[412px] -translate-x-1/2 items-center justify-center rounded-full bg-soft-ivory text-[18px] !text-dark-burgundy outline-none transition-transform duration-200 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]"
      >
        Start your Journey with Family Script
      </Link>
    </Stage>
  );
}
