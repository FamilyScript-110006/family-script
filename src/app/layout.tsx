import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/layout/Navbar";
import BodyStyleReset from "./components/layout/BodyStyleReset";
import ChunkErrorReload from "./components/layout/ChunkErrorReload";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import SocialDock from "./components/layout/SocialDock";

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

  icons: {
    icon: [
      {
        url: "/favicon/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/favicon/site.webmanifest",

  appleWebApp: {
    title: "Family Script",
  },
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
        <ChunkErrorReload />

        <BodyStyleReset />

        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

        <ScrollToTop />

        <SocialDock />
      </body>
    </html>
  );
}