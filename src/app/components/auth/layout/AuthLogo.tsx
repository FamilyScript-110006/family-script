/* Top-left corner of the page, 72px. */
export default function AuthLogo() {
  return (
    <div className="absolute left-[48px] top-[38px] size-[72px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon/favicon.svg"
        alt="Family Script"
        draggable={false}
        className="size-full object-contain object-bottom"
      />
    </div>
  );
}
