import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/layout/Navbar";
import BodyStyleReset from "./components/layout/BodyStyleReset";
import ChunkErrorReload from "./components/layout/ChunkErrorReload";
import PageTransitionProvider from "./components/transition/PageTransitionProvider";
import Footer from "./components/layout/Footer";

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

      <body className="flex flex-col">

        <PageTransitionProvider>

          <ChunkErrorReload />

          <BodyStyleReset />

          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </PageTransitionProvider>

      </body>
    </html>
  );
}