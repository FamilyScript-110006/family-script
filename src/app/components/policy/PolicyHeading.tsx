// app/components/policy/PolicyHeading.tsx

export default function PolicyHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="futura-bold text-left text-[36px] md:text-[48px] tracking-wide text-dark-burgundy mb-8 md:mb-10">
      {children}
    </h2>
  );
}