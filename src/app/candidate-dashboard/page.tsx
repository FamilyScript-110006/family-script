import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

const checklist = [
  {
    title: "Complete your profile",
    description: "Add the details that help your family space feel like yours.",
    action: "Set up profile",
  },
  {
    title: "Create your first tree",
    description: "Start capturing the people and stories that matter to you.",
    action: "Create a tree",
  },
  {
    title: "Invite someone",
    description: "Bring a family member, friend, or collaborator into your space.",
    action: "Send an invite",
  },
];

export default async function CandidateDashboardPage() {
  const { data: session, error } = await auth.getSession();

  if (error) {
    throw new Error(
      `Could not verify the Neon Auth session (${error.status} ${error.code}).`,
    );
  }

  if (!session?.user || !session.session) {
    redirect("/sign-in");
  }

  const firstName = session.user.name.trim().split(/\s+/)[0] || "there";

  return (
    <main className="min-h-screen bg-[#f7f4ed] px-6 pb-20 pt-32 text-[#241f1a] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 border-b border-[#241f1a]/15 pb-10 sm:flex-row sm:items-end">
          <div>
            <p className="futura-medium text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
              Candidate dashboard
            </p>
            <h1 className="futura-light mt-3 text-4xl sm:text-5xl">
              Welcome, {firstName}.
            </h1>
            <p className="futura-light mt-4 max-w-xl text-lg leading-8 text-[#5f5951]">
              This test dashboard confirms that your account session is active.
              The cards below are placeholders for the candidate experience.
            </p>
          </div>
          <div className="rounded-2xl border border-[#241f1a]/15 bg-white px-5 py-4">
            <p className="futura-medium text-xs uppercase tracking-[0.18em] text-[#8a6a2f]">
              Signed in as
            </p>
            <p className="futura-light mt-1 text-base">{session.user.email}</p>
          </div>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Getting started">
          {checklist.map((item, index) => (
            <article
              key={item.title}
              className="flex min-h-64 flex-col rounded-2xl border border-[#241f1a]/15 bg-white p-7 shadow-sm"
            >
              <span className="futura-medium text-sm text-[#8a6a2f]">
                0{index + 1}
              </span>
              <h2 className="futura-medium mt-8 text-2xl">{item.title}</h2>
              <p className="futura-light mt-3 text-base leading-7 text-[#5f5951]">
                {item.description}
              </p>
              <span className="futura-medium mt-auto pt-8 text-sm uppercase tracking-[0.14em] text-[#8a6a2f]">
                {item.action} soon
              </span>
            </article>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="futura-medium rounded-full bg-[#241f1a] px-6 py-3 text-sm text-white transition-opacity hover:opacity-80"
          >
            Back to home
          </Link>
          <Link
            href="/sign-in"
            className="futura-medium rounded-full border border-[#241f1a]/25 px-6 py-3 text-sm transition-colors hover:bg-white"
          >
            Test sign-in again
          </Link>
        </div>
      </div>
    </main>
  );
}
