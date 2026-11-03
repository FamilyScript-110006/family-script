import { SignInForm, Stage } from "@/app/components/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <Stage>
      <SignInForm reason={reason} />
    </Stage>
  );
}
