// app/template.tsx
//
// Next.js remounts template.tsx on every navigation (unlike
// layout.tsx), which is what makes it usable as a "the new route has
// mounted" signal — App Router has no router-events API otherwise.
// This mounts above page.tsx for every route including dynamic
// [slug] segments, so nothing route-specific is needed here.

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePageTransitionContext } from "./components/transition/PageTransitionContext";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { notifyRouteMounted } = usePageTransitionContext();

  useEffect(() => {
    // Double rAF: a single rAF callback can still run before the
    // frame it was scheduled in has actually been displayed. Waiting
    // two frames is the standard guarantee that at least one real
    // paint has completed before the page-transition controller takes
    // its "after" screenshot.
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notifyRouteMounted(pathname);
      });
    });

    return () => cancelAnimationFrame(raf1);
  }, [pathname, notifyRouteMounted]);

  return <>{children}</>;
}
