"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * Close the mobile menu whenever the route changes.
   */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /*
   * Prevent the page behind the menu from scrolling.
   */
  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [menuOpen]);

  return (
    <header className="absolute left-0 top-0 z-[999] w-full">
      <nav
        className="
          flex
          items-center
          justify-between
          px-7
          pt-4
          pb-4
          text-white
          sm:px-8
          md:px-10
          lg:px-12
        "
      >

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          href="/"
          className="relative z-[1001] shrink-0"
          aria-label="Family Script Home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/assets/homepage/FS_logo.png"
            alt="Family Script"
            className="
              h-[78px]
              w-[78px]
              object-contain
              brightness-0
              invert
              max-sm:h-[62px]
              max-sm:w-[62px]
            "
          />
        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
            Visible only on desktop.
        ================================================== */}

        <div className="hidden items-center gap-12 lg:flex">

          <Link
            href="/people"
            className="
              futura-light
              text-[16px]
              tracking-wide
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            PEOPLE
          </Link>

          <Link
            href="/projects"
            className="
              futura-light
              text-[16px]
              tracking-wide
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            PROJECT
          </Link>

          <Link
            href="/purpose"
            className="
              futura-light
              text-[16px]
              tracking-wide
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            PURPOSE
          </Link>

          <Link
            href="/process"
            className="
              futura-light
              text-[16px]
              tracking-wide
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            PROCESS
          </Link>

          <Link
            href="/philosophy"
            className="
              futura-light
              text-[16px]
              tracking-wide
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            PHILOSOPHY
          </Link>

          <Link
            href="/products"
            className="
              futura-light
              text-[16px]
              tracking-wide
              transition-opacity
              duration-300
              hover:opacity-60
            "
          >
            PRODUCTS
          </Link>

        </div>

        {/* ==================================================
            MOBILE HAMBURGER
            Visible below md breakpoint.
        ================================================== */}

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="family-script-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="
            relative
            z-[1001]
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            lg:hidden
          "
        >
          <span className="relative block h-[18px] w-[20px]">

            {/* TOP LINE */}

            <span
              className={`
                absolute
                left-0
                block
                h-[1px]
                w-[18px]
                bg-[rgb(233_231_218)]
                transition-all
                duration-300
                ease-out
                ${
                  menuOpen
                    ? "top-[8px] rotate-45"
                    : "top-[2px]"
                }
              `}
            />

            {/* MIDDLE LINE */}

            <span
              className={`
                absolute
                left-0
                top-[8px]
                block
                h-[1px]
                w-[18px]
                bg-[rgb(233_231_218)]
                transition-all
                duration-300
                ease-out
                ${
                  menuOpen
                    ? "opacity-0"
                    : "opacity-100"
                }
              `}
            />

            {/* BOTTOM LINE */}

            <span
              className={`
                absolute
                left-0
                block
                h-[1px]
                w-[18px]
                bg-[rgb(233_231_218)]
                transition-all
                duration-300
                ease-out
                ${
                  menuOpen
                    ? "top-[8px] -rotate-45"
                    : "top-[14px]"
                }
              `}
            />

          </span>
        </button>
      </nav>

      {/* ====================================================
          MOBILE MENU
      ==================================================== */}

      <div
        id="family-script-mobile-menu"
        className={`
          fixed
          inset-0
          z-[1000]
          lg:hidden
          transition-all
          duration-500
          ease-out
          ${
            menuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >

        {/* ==================================================
            MENU BACKGROUND
        ================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-[rgb(56_44_59)]/95
            backdrop-blur-md
          "
        />

        {/* ==================================================
            MENU CONTENT
        ================================================== */}

        <div
          className={`
            relative
            flex
            h-full
            w-full
            items-center
            justify-center
            px-8
            transition-transform
            duration-500
            ease-out
            ${
              menuOpen
                ? "translate-y-0"
                : "-translate-y-5"
            }
          `}
        >
          <nav
            className="
              flex
              w-full
              max-w-[500px]
              flex-col
            "
            aria-label="Mobile navigation"
          >

            <Link
              href="/people"
              className="
                futura-light
                border-b
                border-[rgb(233_231_218)]/15
                py-4
                text-center
                text-[18px]
                tracking-[0.16em]
                text-[rgb(233_231_218)]
                transition-opacity
                duration-300
                hover:opacity-60
                sm:text-[20px]
              "
            >
              PEOPLE
            </Link>

            <Link
              href="/projects"
              className="
                futura-light
                border-b
                border-[rgb(233_231_218)]/15
                py-4
                text-center
                text-[18px]
                tracking-[0.16em]
                text-[rgb(233_231_218)]
                transition-opacity
                duration-300
                hover:opacity-60
                sm:text-[20px]
              "
            >
              PROJECT
            </Link>

            <Link
              href="/purpose"
              className="
                futura-light
                border-b
                border-[rgb(233_231_218)]/15
                py-4
                text-center
                text-[18px]
                tracking-[0.16em]
                text-[rgb(233_231_218)]
                transition-opacity
                duration-300
                hover:opacity-60
                sm:text-[20px]
              "
            >
              PURPOSE
            </Link>

            <Link
              href="/process"
              className="
                futura-light
                border-b
                border-[rgb(233_231_218)]/15
                py-4
                text-center
                text-[18px]
                tracking-[0.16em]
                text-[rgb(233_231_218)]
                transition-opacity
                duration-300
                hover:opacity-60
                sm:text-[20px]
              "
            >
              PROCESS
            </Link>

            <Link
              href="/philosophy"
              className="
                futura-light
                border-b
                border-[rgb(233_231_218)]/15
                py-4
                text-center
                text-[18px]
                tracking-[0.16em]
                text-[rgb(233_231_218)]
                transition-opacity
                duration-300
                hover:opacity-60
                sm:text-[20px]
              "
            >
              PHILOSOPHY
            </Link>

            <Link
              href="/products"
              className="
                futura-light
                py-4
                text-center
                text-[18px]
                tracking-[0.16em]
                text-[rgb(233_231_218)]
                transition-opacity
                duration-300
                hover:opacity-60
                sm:text-[20px]
              "
            >
              PRODUCTS
            </Link>

          </nav>
        </div>
      </div>
    </header>
  );
}