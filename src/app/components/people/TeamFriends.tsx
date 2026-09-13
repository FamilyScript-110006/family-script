"use client";

import Image from "next/image";
import PageGradientBackground from "../layout/PageGradientBackground";

const team = [
  {
    name: "SHREYAS V BHATT",
    role: ["Growth Strategy Advisor", "Architect  |  Designer"],
    image: "/assets/People/OurTeam/Shreyas.png",
  },
  {
    name: "AR. ANJAL SHANIMA",
    role: ["Visual Design Lead", "Architect  |  Designer"],
    image: "/assets/People/OurTeam/AnjalShanima.png",
  },
  {
    name: "AR. FARIA CHOUDHRY",
    role: ["Business Strategist", "Architect  |  Management Professional"],
    image: "/assets/People/OurTeam/Faria.png",
  },
];

const friends = [
  {
    name: "Dr. Arvind Kumar Sinha",
    image: "/assets/People/Friends/arvind.png",
  },
  {
    name: "Indu Sinha",
    image: "/assets/People/Friends/indu.png",
  },
  {
    name: "Dipti Chourasia",
    image: "/assets/People/Friends/dipti.png",
  },
  {
    name: "Nandini Mishra",
    image: "/assets/People/Friends/nandini.png",
  },
  {
    name: "Avantika Dewangan",
    image: "/assets/People/Friends/avantika.png",
  },
  {
    name: "Muskan Sharma",
    image: "/assets/People/Friends/muskan.png",
  },
  {
    name: "Siddharth Dubey",
    image: "/assets/People/Friends/siddharth.png",
  },
  {
    name: "Rishi Raj Singh",
    image: "/assets/People/Friends/rishi.png",
  },
  {
    name: "Madhu Sharan",
    image: "/assets/People/Friends/madhu.png",
  },
  {
    name: "Chhavi Sinha",
    image: "/assets/People/Friends/chavi.png",
  },
  {
    name: "Romonika Sharan",
    image: "/assets/People/Friends/romonika.png",
  },
  {
    name: "Raju Sharan",
    image: "/assets/People/Friends/raju.png",
  },
  {
    name: "Akash Raj",
    image: "/assets/People/Friends/akash.png",
  },
  {
    name: "Nakul Arora",
    image: "/assets/People/Friends/nakul.png",
  },
  {
    name: "Urvashi Garud",
    image: "/assets/People/Friends/urvashi.png",
  },
  {
    name: "Ar. Vishal Rai",
    image: "/assets/People/Friends/vishal.png",
  },
  {
    name: "Danish Siddiqui",
    image: "/assets/People/Friends/danish.png",
  },
  {
    name: "Anveshan Foundation, IGDTUW",
    image: "/assets/People/Friends/anveshan.png",
  },
];

export default function TeamFriends() {
  return (
    <section className="relative min-h-[160vh] w-full  bg-[#532439] text-white">
      <PageGradientBackground />

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-10 pt-24 md:px-8 md:pt-28">
        {/* =====================================================
    OUR TEAM
===================================================== */}

        <div className="text-center">
          <h2 className="futura-light text-[32px] uppercase tracking-[0.05em] text-white md:text-[40px] lg:text-[44px] pb-[40px]">
            Our Team
          </h2>
        </div>

        {/* =====================================================
    TEAM
===================================================== */}

        <div className="relative mx-auto mt-14 w-full max-w-[1250px]">
          {/* ================= RECTANGLE ================= */}

          <div className="relative h-[200px] border border-white/25">
            <div className="absolute inset-x-0 bottom-0 flex h-full items-end">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="relative flex h-full w-1/3 items-end justify-center"
                >
                  <div className="relative h-[290px] w-full">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="33vw"
                      className="
                object-contain
                object-bottom
                transition-all
                duration-500
                ease-out
                hover:scale-[1.04]
                hover:-translate-y-1
              "
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
      NAMES + DESCRIPTIONS
  ================================================= */}

          <div className="grid grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center pt-5 text-center"
              >
                <h3 className="futura-light text-[12px] uppercase tracking-[0.06em] text-[#e7ad55] md:text-[14px]">
                  {member.name}
                </h3>

                <div className="futura-light mt-4 text-[10px] leading-[1.6] text-white/85 md:text-[13px]">
                  <p>{member.role[0]}</p>
                  <p>{member.role[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            SPACE BETWEEN SECTIONS
        ===================================================== */}

        <div className="h-[10vh]" />

        {/* =====================================================
            FRIENDS TITLE
        ===================================================== */}

        <div className="text-center">
          <h2 className="futura-light text-[22px] uppercase tracking-[0.06em] text-white md:text-[28px] lg:text-[30px]">
            Friends of Family Script
          </h2>

          <p className="futura-light mx-auto mt-5 max-w-[850px] text-[15px] leading-[1.7] tracking-[0.02em] text-white/65 md:text-[15px]">
            This is a place to thank the friends who have lent their voices,
            experiences and expertise throughout our journey. Our work is made
            richer by the people who have shared their stories and trusted us
            with their memories.
          </p>
        </div>

        {/* =====================================================
            FRIENDS GRID
        ===================================================== */}

        <div className="mx-auto mt-16 grid w-full max-w-[1250px] grid-cols-3 gap-x-8 gap-y-14 sm:grid-cols-4 md:grid-cols-6 md:gap-x-12 md:gap-y-16">
          {friends.map((friend) => (
            <div
              key={friend.name}
              className="group flex flex-col items-center text-center"
            >
              {/* IMAGE */}

              <div className="relative aspect-square w-[95px]  rounded-full md:w-[115px] lg:w-[125px]">
                <Image
                  src={friend.image}
                  alt={friend.name}
                  fill
                  sizes="125px"
                  className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>

              {/* NAME */}

              <p className="futura-light mt-5 max-w-[160px] text-[11px] leading-[1.4] text-white/90 md:text-[13px] lg:text-[14px]">
                {friend.name}
              </p>
            </div>
          ))}
        </div>

        {/* ================= BOTTOM SPACE ================= */}

        <div className="h-[15vh]" />
      </div>
    </section>
  );
}
