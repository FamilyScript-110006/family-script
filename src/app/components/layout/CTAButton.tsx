"use client";

import Link from "next/link";

export default function CTAButton() {
  return (
    <Link
      href="/contact"
      className="global-cta"
      aria-label="Get your Story Scripted"
    >
      <span>GET YOUR STORY SCRIPTED</span>
      <span className="global-cta-arrow">&gt;&gt;</span>
    </Link>
  );
}