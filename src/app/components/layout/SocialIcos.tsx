"use client";

export default function SocialIcons() {
  return (
    <>
      {/* Invisible hover area */}
      <div className="fixed bottom-0 right-0 z-40 h-40 w-20" />

      {/* Social Icons */}
      <div className="fixed bottom-8 right-7 z-50 flex flex-col items-center gap-3">
        {/* Facebook */}
        <a
          href="#"
          aria-label="Facebook"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-[#222] text-white"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="#"
          aria-label="Instagram"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-[#222] text-white"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="#"
          aria-label="YouTube"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-[#222] text-white"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.5 15.5v-7l6 3.5-6 3.5Z" />
          </svg>
        </a>
      </div>
    </>
  );
}