// app/faq/page.tsx

import FaqAccordion from "../components/faq/FaqAccordion";
import { FAQ_ITEMS } from "./faqData";

export default function FaqPage() {
  return (
    <main
      className="relative w-full min-h-screen pt-40 pb-20 px-6 md:px-12"
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
      <h1 className="futura-light text-center text-[42px] md:text-[56px] tracking-wide text-muted-purple mb-10 md:mb-14">
        FAQ
      </h1>

      <FaqAccordion items={FAQ_ITEMS} />
    </main>
  );
}