import { Stage, VerifyEmailPending } from "@/app/components/auth";

export default async function VerifyEmailPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; sent?: string }>;
}) {
  const { email, sent } = await searchParams;

  return (
    <Stage>
      <VerifyEmailPending email={email} justSent={sent === "1"} />
    </Stage>
  );
}
