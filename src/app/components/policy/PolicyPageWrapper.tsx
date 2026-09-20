// app/components/policy/PolicyPageWrapper.tsx

export default function PolicyPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="
        relative min-h-screen w-full
        px-4 pb-16 pt-28
        sm:px-6 sm:pt-32 sm:pb-20
        md:px-16 md:pt-40
        lg:px-24 lg:pb-24
      "
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
      <div className="mx-auto w-full max-w-[900px]">
        {children}
      </div>
    </main>
  );
}