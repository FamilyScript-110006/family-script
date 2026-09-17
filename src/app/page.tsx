// app/page.tsx

import Hero from "./components/homepage/Hero";

import WhoAreWe from "./components/homepage/WhoAreWe";
import WhatWeDo from "./components/homepage/WhatWeDo";
import WhatWeOffer from "./components/homepage/WhatWeOffer";
import OurJourney from "./components/homepage/OurJourney";
import Testimonials from "./components/homepage/Testimonials";
import ContactSection from "./components/homepage/ContactSection";

import SocialIcons from "./components/layout/SocialIcos";

export default function Home() {
  return (
    <main className="relative w-full">
      {/* ==================================================
          SOCIAL MEDIA
      ================================================== */}

      <SocialIcons />

      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
        "
      >
        <Hero />
      </section>

      {/* ==================================================
          WHO ARE WE
      ================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
        "
      >
        <WhoAreWe />
      </section>

      {/* ==================================================
          WHAT WE DO
      ================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
        "
      >
        <WhatWeDo />
      </section>

      {/* ==================================================
          WHAT WE OFFER
      ================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
        "
      >
        <WhatWeOffer />
      </section>

      {/* ==================================================
          OUR JOURNEY
      ================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
        "
      >
        <OurJourney />
      </section>

      {/* ==================================================
          TESTIMONIALS

          Grows to fit its real content (variable-length
          testimonials) — not forced to one viewport.
      ================================================== */}

      <section className="relative w-full">
        <Testimonials />
      </section>

      {/* ==================================================
          CONTACT + FOOTER

          IMPORTANT:

          ContactSection ITSELF is the final section.

          ContactSection contains:

            Contact viewport
                   +
            Footer
      ================================================== */}

      <ContactSection />
    </main>
  );
}
