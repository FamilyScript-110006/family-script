import Hero from "../components/homepage/Hero";
import WhoAreWe from "../components/homepage/WhoAreWe";
import WhatWeDo from "../components/homepage/WhatWeDo";
import WhatWeOffer from "../components/homepage/WhatWeOffer";
import OurJourney from "../components/homepage/OurJourney";
import Testimonials from "../components/homepage/Testimonials";
import ContactSection from "../components/homepage/ContactSection";

import CTAButton from "../components/layout/CTAButton";

/* ============================================================
   METADATA
============================================================ */

export const metadata = {
  title: "Family Script | Record Your Story, Create a Legacy",
  description:
    "Family Script is a collaborative platform for documenting and preserving family histories. Celebrate your heritage and create lasting legacies.",
  openGraph: {
    title: "Family Script | Record Your Story, Create a Legacy",
    description:
      "A platform for documenting and preserving family histories.",
    url: "https://familyscript.com",
    siteName: "Family Script",
    type: "website",
  },
};

/* ============================================================
   HOMEPAGE
============================================================ */

export default function HomePage() {
  return (
    <main className="relative w-full overflow-hidden bg-black">
      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
          overflow-hidden
        "
      >
        <Hero />
      </section>

      {/* ======================================================
          WHO ARE WE SECTION
      ====================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
          overflow-hidden
        "
      >
        <WhoAreWe />
      </section>

      {/* ======================================================
          WHAT WE DO SECTION
      ====================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
          overflow-hidden
        "
      >
        <WhatWeDo />
      </section>

      {/* ======================================================
          WHAT WE OFFER SECTION
      ====================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
          overflow-hidden
        "
      >
        <WhatWeOffer />
      </section>

      {/* ======================================================
          OUR JOURNEY SECTION
      ====================================================== */}

      <section
        className="
          relative
          w-full
          overflow-hidden
        "
      >
        <OurJourney />
      </section>

      {/* ======================================================
          TESTIMONIALS SECTION
      ====================================================== */}

      <section
        className="
          relative
          h-screen
          min-h-screen
          w-full
          overflow-hidden
        "
      >
        <Testimonials />
      </section>

      {/* ======================================================
          CONTACT SECTION
      ====================================================== */}

      <section
        className="
          relative
          w-full
          overflow-hidden
        "
      >
        <ContactSection />
      </section>
    </main>
  );
}