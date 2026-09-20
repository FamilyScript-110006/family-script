// app/components/policy/PolicySection.tsx

export type PolicyBlock = {
  heading?: string;
  paragraphs: string[];
};

export default function PolicySection({
  blocks,
}: {
  blocks: PolicyBlock[];
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {blocks.map((block, index) => (
        <div key={index}>
          {block.heading && (
            <p className="futura-bold mb-2 text-[11px] uppercase tracking-wide text-dark-burgundy sm:text-[12px] md:text-[14px]">
              {block.heading}
            </p>
          )}

          {block.paragraphs.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              className="futura-light mb-3 text-[11.5px] leading-[1.65] text-dark-burgundy sm:text-[12.5px] md:text-[14px] md:leading-[1.7]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}