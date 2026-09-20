"use client";

import { useEffect, useRef, useState } from "react";

export default function SocialIcons() {
  const [hidden, setHidden] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHideTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setHidden(true);
    }, 5000);
  };

  const showIcons = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setHidden(false);
  };

  useEffect(() => {
    startHideTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`global-social-wrapper ${
        hidden ? "social-hidden" : ""
      }`}
      onMouseEnter={showIcons}
      onMouseLeave={startHideTimer}
    >
      <div className="global-social-icons">

        {/* ==================================================
            FACEBOOK
        ================================================== */}

        <a
          href="#"
          aria-label="Facebook"
          className="global-social-link"
        >
          <svg viewBox="0 0 20 20" className="social-svg">
            <mask id="facebook-mask">
              <rect
                width="20"
                height="20"
                fill="white"
              />

              <path
                d="M11.55 17.5V10.85H13.8L14.15 8.25H11.55V6.6C11.55 5.85 11.8 5.35 12.85 5.35H14.25V3.05C13.6 2.95 12.95 2.9 12.3 2.9C9.75 2.9 8.1 4.45 8.1 7.1V8.25H6V10.85H8.1V17.5H11.55Z"
                fill="black"
              />
            </mask>

            <circle
              cx="10"
              cy="10"
              r="9.5"
              fill="white"
              mask="url(#facebook-mask)"
            />
          </svg>
        </a>

        {/* ==================================================
            INSTAGRAM
        ================================================== */}

        <a
          href="#"
          aria-label="Instagram"
          className="global-social-link"
        >
          <svg viewBox="0 0 20 20" className="social-svg">
            <mask id="instagram-mask">
              <rect
                width="20"
                height="20"
                fill="white"
              />

              <rect
                x="5"
                y="5"
                width="10"
                height="10"
                rx="3"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
              />

              <circle
                cx="10"
                cy="10"
                r="2.5"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
              />

              <circle
                cx="13.3"
                cy="6.7"
                r="0.8"
                fill="black"
              />
            </mask>

            <circle
              cx="10"
              cy="10"
              r="9.5"
              fill="white"
              mask="url(#instagram-mask)"
            />
          </svg>
        </a>

        {/* ==================================================
            YOUTUBE
        ================================================== */}

        <a
          href="#"
          aria-label="YouTube"
          className="global-social-link"
        >
          <svg
            viewBox="0 0 20 20"
            className="social-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White outer circle */}
            <circle
              cx="10"
              cy="10"
              r="9.5"
              fill="white"
            />

            {/* YouTube rounded rectangle */}
            <rect
              x="5.2"
              y="6.2"
              width="10"
              height="7"
              rx="1.8"
              fill="#8a827d"
            />

            {/* White play button */}
            <path
              d="M9 8.5L12.2 10L9 11.5V8.5Z"
              fill="white"
            />
          </svg>
        </a>

      </div>
    </div>
  );
}