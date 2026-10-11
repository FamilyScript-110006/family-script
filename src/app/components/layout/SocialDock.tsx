"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FiFacebook, FiInstagram, FiLink, FiX, FiYoutube } from "react-icons/fi";

/* ============================================================
   DATA
============================================================ */

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/19jksRm2nh/",
    Icon: FiFacebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/familyscript?vrfl=MW4xNzk5aXhyeW1qYg==",
    Icon: FiInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@familyscript",
    Icon: FiYoutube,
  },
];

const HIDE_AFTER_MS = 5000;

const ICON_BUTTON = "social-dock-icon";

/* ============================================================
   SOCIAL DOCK
   - Desktop: icons sit on the right edge, fade out after 5s and
     come back when the pointer enters the area (or on focus).
   - Mobile: no hover, so a small share button holds the icons.
     Tap to open; closes after 5s, on scroll, or on outside tap.
============================================================ */

export default function SocialDock() {
  const pathname = usePathname();

  /* ---------------- desktop ---------------- */
  const [desktopVisible, setDesktopVisible] = useState(true);
  const desktopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDesktopTimer = () => {
    if (desktopTimer.current) clearTimeout(desktopTimer.current);
  };

  const showDesktop = useCallback((autoHide: boolean) => {
    if (desktopTimer.current) clearTimeout(desktopTimer.current);
    setDesktopVisible(true);
    if (autoHide) {
      desktopTimer.current = setTimeout(
        () => setDesktopVisible(false),
        HIDE_AFTER_MS,
      );
    }
  }, []);

  // Show on every page load / navigation, then fade after 5s
  useEffect(() => {
    showDesktop(true);
    return clearDesktopTimer;
  }, [pathname, showDesktop]);

  /* ---------------- mobile ---------------- */
  const [open, setOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const mobileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    mobileTimer.current = setTimeout(() => setOpen(false), HIDE_AFTER_MS);

    const close = () => setOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!mobileRef.current?.contains(e.target as Node)) close();
    };

    window.addEventListener("scroll", close, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      if (mobileTimer.current) clearTimeout(mobileTimer.current);
      window.removeEventListener("scroll", close);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <>
      {/* ================= DESKTOP / TABLET ================= */}

      <div
        className="social-dock-desktop"
        onMouseEnter={() => showDesktop(false)}
        onMouseLeave={() => showDesktop(true)}
        onFocus={() => showDesktop(false)}
        onBlur={() => showDesktop(true)}
      >
        <div className="social-dock-list" data-visible={desktopVisible}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Family Script on ${label}`}
              tabIndex={desktopVisible ? 0 : -1}
              className={ICON_BUTTON}
            >
              <Icon size={16} color="#3b0a1f" />
            </a>
          ))}
        </div>
      </div>

      {/* ================= MOBILE ================= */}

      <div
        ref={mobileRef}
        className="social-dock-mobile"
      >
        <div className="social-dock-mobile-list" data-open={open}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Family Script on ${label}`}
              tabIndex={open ? 0 : -1}
              className={ICON_BUTTON}
            >
              <Icon size={16} color="#3b0a1f" />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close social links" : "Open social links"}
          aria-expanded={open}
          className="social-dock-toggle"
          data-open={open}
        >
          {open ? <FiX size={15} /> : <FiLink size={14} />}
        </button>
      </div>
    </>
  );
}
