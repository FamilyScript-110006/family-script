// app/components/policy/PolicySection.tsx

export type PolicyBlock = {
  heading?: string;
  paragraphs: string[];
};

export default function PolicySection({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <div key={index}>
          {block.heading && (
            <p className="futura-bold uppercase text-dark-burgundy text-[13px] md:text-[14px] tracking-wide mb-2">
              {block.heading}
            </p>
          )}

          {block.paragraphs.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              className="futura-light text-dark-burgundy text-[13px] md:text-[14px] leading-[1.7] mb-3"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}