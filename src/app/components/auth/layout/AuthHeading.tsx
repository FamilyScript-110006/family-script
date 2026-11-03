/*
 * "Record & discover stories that matter"
 * Centered horizontally, 299 from the top of the stage, 365px wide so
 * it breaks onto two lines exactly like the design.
 */
export default function AuthHeading() {
  return (
    <h1
      className="absolute left-1/2 top-[299px] w-[365px] -translate-x-1/2 -translate-y-1/2 text-center text-[50px] font-medium leading-[54px]"
      style={{ fontFamily: '"futura-pt", "Futura", sans-serif' }}
    >
      <span className="text-warm-beige">Record &amp; discover</span>{" "}
      <span className="text-soft-ivory">stories that matter</span>
    </h1>
  );
}
