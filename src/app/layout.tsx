import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/layout/Navbar";
import BodyStyleReset from "./components/layout/BodyStyleReset";
import ChunkErrorReload from "./components/layout/ChunkErrorReload";
import PageTransitionProvider from "./components/transition/PageTransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Family Script",
  description: "Family Script",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/zar3kom.css"
        />
      </head>

      <body className="flex  flex-col">

        {/* ================= PAGE TRANSITIONS =================
            Intercepts internal link clicks and plays a ripple
            crossfade between the outgoing and incoming page. See
            src/app/components/transition/PageTransitionProvider.tsx.
        ================================================= */}
        <PageTransitionProvider>

          {/* ================= CHUNK LOAD ERROR SAFETY NET =================
              If the client tries to fetch a route chunk that no longer
              exists (stale tab after a new deploy, or a dev-server
              rebuild), reload instead of leaving a dead page behind.
          ================================================= */}
          <ChunkErrorReload />

          {/* ================= BODY STYLE SAFETY NET =================
              Resets any leftover body.style.overflow / touchAction on
              every route change (defensive cleanup).
          ================================================= */}
          <BodyStyleReset />

          {/* ================= NAVBAR ================= */}
          <Navbar />

          {/* ================= PAGE CONTENT ================= */}
          <main className="flex-1">
            {children}
          </main>

        </PageTransitionProvider>

      </body>
    </html>
  );
}