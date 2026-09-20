// app/components/policy/PolicyPageWrapper.tsx

export default function PolicyPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="relative w-full min-h-screen pt-40 pb-24 px-6 md:px-16 lg:px-24"
      style={{
        background: `
          linear-gradient(
            to bottom,
            rgba(104, 104, 104, 0.55) 0%,
            rgba(104, 104, 104, 0.2) 28%,
            rgba(104, 104, 104, 0.03) 50%,
            rgba(104, 104, 104, 0.2) 72%,
            rgba(104, 104, 104, 0.55) 100%
          ),
          #e9e7da
        `,
      }}
    >
      <div className="max-w-[900px]">{children}</div>
    </main>
  );
}