import {
  AuthBackdrop,
  AuthGlow,
  AuthHeading,
  AuthLogo,
  PhotoArc,
  Stage,
} from "@/app/components/auth";

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[2000] overflow-hidden bg-dark-burgundy">
      <AuthBackdrop />
      <PhotoArc />
      <AuthGlow />

      <div className="absolute inset-0 z-30">
        <Stage>
          <AuthLogo />
          <AuthHeading />
        </Stage>
      </div>

      <div className="absolute inset-0 z-40">{children}</div>
    </div>
  );
}
