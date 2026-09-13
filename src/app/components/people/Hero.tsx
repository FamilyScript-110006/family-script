// components/people/Hero.tsx

"use client";

import FounderHover, { type Founder } from "./FounderHover";
import PageGradientBackground from "../layout/PageGradientBackground";

const founders: Founder[] = [
  {
    name: "DR. KSHITIJ KUMAR SINHA",
    role: "Founder & CEO",
    description: ["Architect, Researcher,", "Educationist"],
    image: "/assets/People/Founders/KshitijSinha.png",
    position: "left",
    bio: [
      "Dr. Kshitij Kumar Sinha is an architect, researcher, educator and the Founder & CEO of Family Script.",
      "Dr. Kshitij Kumar Sinha is an architect, academician, researcher, entrepreneur and mentor whose work spans AI-enabled architecture, design and project management, multidisciplinary research and entrepreneurship. He holds a PhD focused on ‘Mapping human behaviour for AI-enabled Architecture’ and is deeply interested in exploring the intersection of emerging technologies, human consciousness and Vedantic philosophy.",
      "\n As an academician and mentor, he believes in experiential learning and engages students in research, innovation and real-world challenges, enabling them to gain meaningful insights beyond the classroom. He has also led various Social Impact & Community Engagement programmes, working closely with communities and creating opportunities for students to contribute meaningfully to society. His contributions have earned him recognition from the Government of NCT of Delhi for promoting women’s participation in STEM education in higher education.",
    ],
  },
  {
    name: "MEENAKSHI DUBEY",
    role: "Director & Chief Creative Officer",
    description: ["Conservation Architect,", "Historian, Educationist"],
    image: "/assets/People/Founders/MeenakshiDubey.png",
    position: "right",
    bio: [
      "Meenakshi Dubey is an architect, urban historian, educator, and researcher whose work engages with the intersections of critical urban studies, architectural history, heritage, and pedagogy in India. With over 10 years of academic and professional experience, her work is dedicated to bridging design, history, and storytelling through creative documentation.",
      "Meenakshi is also the Co-Founder and Design Director of a multidisciplinary design and documentation agency dedicated to recording socio-spatial histories and understanding local and regional narratives through research-driven storytelling. Her practice continues to investigate how history, memory, and cultural storytelling can inform more responsive and inclusive approaches to architecture, urbanism, and contemporary design practices. Increasingly, her work also explores critical urban pedagogy and the need to rethink architectural education in India through decolonial approaches to both pedagogy and praxis.",
    ],
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-[#532439] text-white">
      <PageGradientBackground />

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[1400px] px-8 pb-12 pt-[150px] md:px-[7%] md:pt-[145px]">
        {/* ================= HEADING ================= */}

        <div className="relative z-50 text-center">
          <h1 className="futura-light text-[38px] uppercase leading-none tracking-[0.025em] text-white md:text-[42px] lg:text-[44px]">
            Our Founders
          </h1>

          <p className="futura-light mt-5 text-[14px] tracking-[0.02em] text-white/85 md:text-[15px]">
            We are a team of dedicated creatives-
            <span className="futura-bold">
              {" "}
              Architects, Historians, Conservationists
            </span>{" "}
            and <span className="futura-bold">Designers.</span>
          </p>
        </div>

        {/* ================= HOVER COMPONENT ================= */}

        <FounderHover founders={founders} />
      </div>
    </section>
  );
}
