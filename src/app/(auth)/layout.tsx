import { redirect } from "next/navigation";

import {
  AuthBackdrop,
  AuthGlow,
  AuthHeading,
  AuthLogo,
  PhotoArc,
  Stage,
} from "@/app/components/auth";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

/* ============================================================
   AUTH LAYOUT

   Shared by every auth screen: background, rotating photo arc,
   logo and heading. Each page only adds what is unique to it.

   Layers (back to front):
     z-0   AuthBackdrop   burgundy
     z-10  PhotoArc       rotating photos
     z-20  AuthGlow       gradient + golden glow
     z-30  logo + heading
     z-40  the page itself

   The root layout still renders Navbar / Footer / SocialDock, so this
   wrapper is a full-screen overlay that sits on top of them.
   TODO: hide those on auth routes instead of covering them.
============================================================ */

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = await auth.getSession();

  if (sessionResult.error) {
    throw new Error(
      `Could not verify the Neon Auth session (${sessionResult.error.status} ${sessionResult.error.code}).`,
    );
  }

  if (sessionResult.data?.user && sessionResult.data.session) {
    redirect("/candidate-dashboard");
  }

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
