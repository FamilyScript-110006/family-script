import { redirect } from "next/navigation";

import { Stage, VerifyEmailCode } from "@/app/components/auth";

export default async function VerifyEmailCodePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; sent?: string }>;
}) {
  const { email, sent } = await searchParams;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/sign-up");
  }

  return (
    <Stage>
      <VerifyEmailCode email={email} sent={sent === "1"} />
    </Stage>
  );
}
