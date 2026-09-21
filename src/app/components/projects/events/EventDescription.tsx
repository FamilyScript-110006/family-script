"use client";

import { useState } from "react";

type EventDescriptionProps = {
  paragraphs: string[];
};

/**
 * Shows the first paragraph only; "Read more" reveals the rest.
 * Single-paragraph (or empty) descriptions get no toggle.
 *
 * The parent should pass key={event.slug} so the expanded state
 * resets when navigating between events.
 */
export default function EventDescription({ paragraphs }: EventDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (paragraphs.length === 0) return null;

  const hasMore = paragraphs.length > 1;
  const visible = expanded ? paragraphs : paragraphs.slice(0, 1);

  return (
    <div
      className="
        mt-8
        max-w-[600px]
        sm:mt-10
        lg:mt-12
      "
    >
      <div className="space-y-5 sm:space-y-6">
        {visible.map((paragraph, index) => (
          <p
            key={index}
            className="
              futura-light
              text-[12px]
              leading-[1.48]
              tracking-[0.02em]
              text-[rgb(233_231_218)]/80
              sm:text-[13px]
              md:text-[14px]
              lg:text-[clamp(14px,1vw,17px)]
              lg:leading-[1.5]
            "
          >
            {paragraph}
          </p>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="
            futura-light
            mt-4
            cursor-pointer
            text-[12px]
            tracking-wide
            text-[rgb(233_231_218)]/55
            transition-colors
            duration-300
            hover:text-[rgb(203_163_86)]
            sm:mt-5
          "
        >
          {expanded ? "Read less <<" : "Read more >>"}
        </button>
      )}
    </div>
  );
}
