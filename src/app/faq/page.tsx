// app/faq/page.tsx

import FaqAccordion from "../components/faq/FaqAccordion";
import { FAQ_ITEMS } from "./faqData";

export default function FaqPage() {
  return (
    <main
      className="relative min-h-screen w-full px-4 pb-16 pt-28 sm:px-6 sm:pt-32 md:px-12 md:pb-20 md:pt-40"
      style={{
        background: `
          linear-gradient(
            to bottom,
            rgba(104, 104, 104, 0.55) 0%,
            rgba(104, 104, 104, 0.2) 28%,
            rgba(104, 104, 104, 0.03) 50%,
            rgba(104, 104, 104, 0.2) 72%,
            rgba(104, 104, 104, 0.55) 100%
          ),
          #e9e7da
        `,
      }}
    >
      <h1 className="futura-light mb-8 text-center text-[32px] tracking-wide text-muted-purple sm:text-[38px] md:mb-14 md:text-[56px]">
        FAQ
      </h1>

      <FaqAccordion items={FAQ_ITEMS} />
    </main>
  );
}