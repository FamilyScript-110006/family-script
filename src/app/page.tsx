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
        id="who-are-we"
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
        id="what-we-do"
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
      ================================================== */}

      <section
        id="testimonials"
        className="relative w-full"
      >
        <Testimonials />
      </section>

      {/* ==================================================
          CONTACT + FOOTER

          ContactSection is the final section.
      ================================================== */}

      <ContactSection />
    </main>
  );
}