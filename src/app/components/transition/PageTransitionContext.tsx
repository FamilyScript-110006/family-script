// components/transition/PageTransitionContext.tsx
//
// Small context that lets the root `template.tsx` (which Next.js
// remounts on every navigation, unlike layout.tsx) tell
// PageTransitionProvider "the new route has mounted and painted" —
// there is no router-events API in App Router, so this is the
// mount-detection mechanism the whole transition sequencing depends on.

"use client";

import { createContext, useContext } from "react";

export interface PageTransitionContextValue {
  notifyRouteMounted: (pathname: string) => void;
}

const noop = () => {};

export const PageTransitionContext =
  createContext<PageTransitionContextValue>({
    notifyRouteMounted: noop,
  });

export function usePageTransitionContext() {
  return useContext(PageTransitionContext);
}
