// components/layout/PageGradientBackground.tsx
//
// The site's standard dark-page backdrop treatment. Confirmed against
// the Figma source (People | Founders frame, Dev Mode inspection) —
// it's the same "356.76deg black-fading-to-transparent" darkening
// rect already used for the Testimonials/Products banner overlays
// (linear-gradient(356.76deg, rgba(0,0,0,1) 2.81%, rgba(102,102,102,0)
// 71.6%) at 26% layer opacity), not a bespoke glow/vignette recipe.
//
// A full-frame copy of that rect darkens the TOP edge (gradient angle
// flipped 180°, i.e. +180 = 176.76deg, so the dark stop lands at the
// top instead of the bottom), and two bottom-anchored copies (stacked
// twice, matching the Figma source's own duplication) darken the
// BOTTOM edge — leaving the middle at the plain base color, per spec:
// dark at the top/bottom edges, the approved hex in the middle.
//
// Percentage-based sizing (not Figma's absolute pixel numbers, which
// were tuned to one specific frame height) so this scales correctly
// across pages of different heights.

const BASE = "#532439";

function darkenGradient(angleDeg: number): string {
  return `linear-gradient(${angleDeg}deg, rgba(0,0,0,1) 2.81%, rgba(102,102,102,0) 71.6%)`;
}

export default function PageGradientBackground({
  includeBase = true,
}: {
  // Set false on pages with their own background already (e.g. a
  // cover photo) — the darkening rects still render, just without
  // the opaque base-color layer that would otherwise hide it.
  includeBase?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* BASE COLOR */}
      {includeBase && (
        <div className="absolute inset-0" style={{ background: BASE }} />
      )}

      {/* TOP DARKENING */}
      <div
        className="absolute inset-0"
        style={{ opacity: 0.26, background: darkenGradient(176.76) }}
      />

      {/* BOTTOM DARKENING — stacked twice for extra intensity there
          specifically, matching the Figma source. */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "55%", opacity: 0.26, background: darkenGradient(356.76) }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "55%", opacity: 0.26, background: darkenGradient(356.76) }}
      />
    </div>
  );
}
