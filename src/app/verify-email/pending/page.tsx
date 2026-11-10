import { Stage, VerifyEmailCode } from "@/app/components/auth";

export default async function VerifyEmailPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; sent?: string }>;
}) {
  const { email, sent } = await searchParams;

  return (
    <Stage>
      <VerifyEmailCode email={email} sent={sent === "1"} />
    </Stage>
  );
}
