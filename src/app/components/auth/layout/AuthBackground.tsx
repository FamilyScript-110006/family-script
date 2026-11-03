/* ============================================================
   AUTH BACKGROUND

   Two layers that sit around the photo arc:

   - AuthBackdrop : solid burgundy (behind the arc)
   - AuthGlow     : grey fade + golden glow (in front of the arc,
                    so the lower tiles melt into the background)

   Both fill the whole viewport, whatever its shape.
============================================================ */

export function AuthBackdrop() {
  return <div className="absolute inset-0 z-0 bg-dark-burgundy" />;
}

export function AuthGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Fills the full viewport width; ~65% of the height from the bottom. */}
      <div className="absolute inset-x-0 bottom-0 h-[64.6%] bg-gradient-to-t from-[#606060] from-[30.769%] to-[rgba(102,102,102,0)]" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/auth/overlay.svg"
        alt=""
        draggable={false}
        className="absolute inset-0 size-full object-cover object-bottom"
      />
    </div>
  );
}
