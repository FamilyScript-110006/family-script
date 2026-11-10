import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

const FALLBACK_PROFILE_IMAGE =
  "https://picsum.photos/seed/family-script-profile/96/96";

export default async function CandidateSettingsPage() {
  const { data: session, error } = await auth.getSession();

  if (error) {
    throw new Error(
      `Could not verify the Neon Auth session (${error.status} ${error.code}).`,
    );
  }

  if (!session?.user || !session.session) {
    redirect("/sign-in");
  }

  const { user } = session;

  return (
    <main className="min-h-screen bg-[#f7f4ed] px-6 pb-20 pt-32 text-[#241f1a] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <p className="futura-medium text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
          Account
        </p>
        <h1 className="futura-light mt-3 text-4xl sm:text-5xl">
          User settings
        </h1>
        <section className="mt-10 rounded-2xl border border-[#241f1a]/15 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-4 border-b border-[#241f1a]/10 pb-6">
            <Image
              src={user.image || FALLBACK_PROFILE_IMAGE}
              width={64}
              height={64}
              unoptimized
              alt={`${user.name}'s profile`}
              className="size-16 rounded-full object-cover"
            />
            <div>
              <h2 className="futura-medium text-xl">{user.name}</h2>
              <p className="futura-light mt-1 text-sm text-[#5f5951]">
                Account profile
              </p>
            </div>
          </div>
          <dl className="grid gap-5 pt-6 sm:grid-cols-2">
            <div>
              <dt className="futura-medium text-xs uppercase tracking-[0.14em] text-[#8a6a2f]">
                Name
              </dt>
              <dd className="futura-light mt-2 text-base">{user.name}</dd>
            </div>
            <div>
              <dt className="futura-medium text-xs uppercase tracking-[0.14em] text-[#8a6a2f]">
                Email
              </dt>
              <dd className="futura-light mt-2 break-all text-base">
                {user.email}
              </dd>
            </div>
          </dl>
        </section>
        <Link
          href="/candidate-dashboard"
          className="futura-medium mt-8 inline-flex rounded-full bg-[#241f1a] px-6 py-3 text-sm text-white transition-opacity hover:opacity-80"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
