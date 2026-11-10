//src/app/components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth/client";

const FALLBACK_PROFILE_IMAGE =
  "https://picsum.photos/seed/family-script-profile/96/96";

const WORK_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Products", href: "/products" },
];

const APPROACH_LINKS = [
  { label: "Purpose", href: "/purpose" },
  { label: "Process", href: "/process" },
  { label: "Philosophy", href: "/philosophy" },
];

function NavigationDropdown({
  label,
  items,
  group,
  open,
  onToggle,
  mobile = false,
  onNavigate,
}: {
  label: string;
  items: Array<{ label: string; href: string }>;
  group: string;
  open: boolean;
  onToggle: (group: string) => void;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className={mobile ? "w-full" : "relative"}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => onToggle(group)}
        className={
          mobile
            ? "mobile-menu-link flex w-full items-center justify-center gap-2 py-4 text-center futura-light text-[18px] tracking-[0.16em] text-soft-ivory transition-colors duration-300 hover:text-antique-gold sm:text-[20px]"
            : "futura-light flex items-center gap-2 text-[16px] tracking-wide text-white transition-opacity duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-antique-gold"
        }
      >
        {label}
        <span
          aria-hidden="true"
          className={`text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      <div
        aria-hidden={!open}
        className={
          mobile
            ? `grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`
            : `invisible absolute left-0 top-full z-[1100] min-w-36 translate-y-2 bg-dark-burgundy py-2 text-soft-ivory opacity-0 shadow-xl transition-[opacity,transform,visibility] duration-300 ease-out ${open ? "visible translate-y-0 opacity-100" : "pointer-events-none"}`
        }
      >
        <div className={mobile ? "flex min-h-0 flex-col overflow-hidden" : "flex flex-col"}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                onNavigate?.();
              }}
              tabIndex={open ? undefined : -1}
              className={
                mobile
                  ? "mobile-menu-link nav-dropdown-link py-3 text-center futura-light text-[16px] tracking-wide transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold"
                  : "nav-dropdown-link block px-4 py-2 text-sm capitalize transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-antique-gold"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileMenu({ image, name }: { image?: string | null; name: string }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setLoggingOut(true);
    setLogoutError("");

    try {
      const { error } = await authClient.signOut();
      if (error) {
        setLogoutError("Could not log out. Please try again.");
        setLoggingOut(false);
        return;
      }

      window.location.assign("/");
    } catch {
      setLogoutError("Could not log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Open user menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="user-profile-menu"
        title="User menu"
        onClick={() => {
          setOpen((current) => !current);
          setLogoutError("");
        }}
        className="inline-flex size-10 shrink-0 overflow-hidden rounded-full border border-white/70 transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Image
          src={image || FALLBACK_PROFILE_IMAGE}
          width={40}
          height={40}
          unoptimized
          alt={`${name}'s profile`}
          className="size-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_PROFILE_IMAGE;
          }}
        />
      </button>
      {open && (
        <div
          id="user-profile-menu"
          className="absolute right-0 top-full z-[1100] mt-3 w-56 rounded-xl border border-[#241f1a]/15 bg-[#f7f4ed] p-2 text-[#241f1a] shadow-xl"
        >
          <p className="truncate px-3 py-2 text-sm text-[#5f5951]">{name}</p>
          <div className="my-1 border-t border-[#241f1a]/10" />
          <Link
            href="/candidate-dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#241f1a]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8a6a2f]"
          >
            Candidate dashboard
          </Link>
          <Link
            href="/candidate-dashboard/settings"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#241f1a]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8a6a2f]"
          >
            User settings
          </Link>
          <div className="my-1 border-t border-[#241f1a]/10" />
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#241f1a]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8a6a2f]"
          >
            Home
          </Link>
          <div className="my-1 border-t border-[#241f1a]/10" />
          {logoutError && (
            <p role="alert" className="px-3 py-2 text-sm text-red-700">
              {logoutError}
            </p>
          )}
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleSignOut}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-800 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8a6a2f] disabled:cursor-wait disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openNavigation, setOpenNavigation] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();

  /*
   * Close the mobile menu whenever the route changes.
   */
  useEffect(() => {
    setMenuOpen(false);
    setOpenNavigation(null);
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
          {isHome ? (
            <span
              className="
                futura-light
                flex
                h-[78px]
                items-center
                whitespace-nowrap
                text-[24px]
                uppercase
                tracking-[0.32em]
                text-white
                max-sm:h-[62px]
                max-sm:text-[18px]
              "
            >
              Family Script
            </span>
          ) : (
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
          )}
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

          <NavigationDropdown
            label="OUR WORK"
            items={WORK_LINKS}
            group="work"
            open={openNavigation === "work"}
            onToggle={(group) =>
              setOpenNavigation((current) => (current === group ? null : group))
            }
          />
          <NavigationDropdown
            label="OUR APPROACH"
            items={APPROACH_LINKS}
            group="approach"
            open={openNavigation === "approach"}
            onToggle={(group) =>
              setOpenNavigation((current) => (current === group ? null : group))
            }
          />

          <div className="flex w-24 justify-end">
            {isPending ? (
              <span aria-hidden="true" className="h-10 w-10" />
            ) : session?.user ? (
              <ProfileMenu image={session.user.image} name={session.user.name} />
            ) : (
              <Link
                href="/welcome"
                className="futura-medium inline-flex w-full items-center justify-center bg-antique-gold px-3 py-2.5 text-sm font-semibold tracking-[0.12em] text-dark-burgundy shadow-md transition-colors duration-300 hover:bg-[#ddb96e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-antique-gold"
              >
                SIGN IN
              </Link>
            )}
          </div>

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
                bg-soft-ivory
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
                bg-soft-ivory
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
                bg-soft-ivory
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
            bg-dark-burgundy/95
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
                mobile-menu-link
                futura-light
                border-b
                border-soft-ivory/15
                py-4
                text-center
                text-[18px]
                tracking-[0.16em]
                text-soft-ivory
                transition-opacity
                duration-300
                hover:opacity-60
                sm:text-[20px]
              "
            >
              PEOPLE
            </Link>

            <NavigationDropdown
              label="OUR WORK"
              items={WORK_LINKS}
              group="work"
              open={openNavigation === "work"}
              onToggle={(group) =>
                setOpenNavigation((current) => (current === group ? null : group))
              }
              mobile
              onNavigate={() => {
                setOpenNavigation(null);
                setMenuOpen(false);
              }}
            />
            <NavigationDropdown
              label="OUR APPROACH"
              items={APPROACH_LINKS}
              group="approach"
              open={openNavigation === "approach"}
              onToggle={(group) =>
                setOpenNavigation((current) => (current === group ? null : group))
              }
              mobile
              onNavigate={() => {
                setOpenNavigation(null);
                setMenuOpen(false);
              }}
            />

            {isPending ? (
              <span aria-hidden="true" className="mx-auto mt-4 h-10 w-36" />
            ) : session?.user ? (
              <div className="flex justify-center py-4">
                <ProfileMenu image={session.user.image} name={session.user.name} />
              </div>
            ) : (
              <Link
                href="/welcome"
                className="futura-medium mx-auto mt-4 inline-flex min-w-36 items-center justify-center bg-antique-gold px-6 py-3 text-center text-sm font-semibold tracking-[0.12em] text-dark-burgundy shadow-md transition-colors duration-300 hover:bg-[#ddb96e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-antique-gold"
              >
                SIGN IN
              </Link>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}