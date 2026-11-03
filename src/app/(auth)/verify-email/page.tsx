import { Stage, VerifyEmailResult } from "@/app/components/auth";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; verified?: string; error?: string }>;
}) {
  const { token, verified, error } = await searchParams;

  return (
    <Stage>
      <VerifyEmailResult token={token} verified={verified === "1"} error={error} />
    </Stage>
  );
}
