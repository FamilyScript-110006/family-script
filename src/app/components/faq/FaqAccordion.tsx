// app/components/faq/FaqAccordion.tsx

"use client";

import { useState } from "react";
import type { FaqItem } from "../../faq/faqData";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="mx-auto w-full max-w-[950px] space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-md bg-dark-burgundy"
          >
            {/* ===== QUESTION (always visible, click target) ===== */}
            <button
              type="button"
              onClick={() => handleToggle(index)}
              aria-expanded={isOpen}
              className="
                flex w-full items-center justify-between gap-4
                px-6 py-5 md:px-8 md:py-6
                text-left
                futura-light
                text-[15px] md:text-[17px]
                text-soft-ivory
              "
            >
              <span>{item.question}</span>

              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`
                  h-4 w-4 flex-shrink-0 text-soft-ivory
                  transition-transform duration-300
                  ${isOpen ? "rotate-180" : "rotate-0"}
                `}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={`
                grid transition-all duration-300 ease-in-out
                ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
              `}
            >
              <div className="overflow-hidden px-6 md:px-8">
                <div className="pb-5 md:pb-6 futura-light text-[13px] md:text-[14px] leading-[1.6] text-soft-ivory/85">
                  {item.answer.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-1" : undefined}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}