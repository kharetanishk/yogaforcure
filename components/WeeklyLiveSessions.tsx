"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Clock } from "lucide-react";

const sessions = [
  {
    day: "Monday",
    title: "Strength & Power",
    description: "Yoga with weights, animal movements, advanced preparation",
    time: "7:00 – 8:00 PM",
  },
  {
    day: "Wednesday",
    title: "Flexibility & Balance",
    description: "Hatha yoga, deep mobility, control & stability",
    time: "7:00 – 8:00 PM",
  },
  {
    day: "Friday",
    title: "Core Activation",
    description: "Suryanamaskar practice + focused core strengthening",
    time: "7:00 – 8:00 PM",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

function SessionCard({ session }: { session: (typeof sessions)[number] }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#faf8f5] rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
        {/* Left Side: Day, Title, Description */}
        <div className="flex-1 space-y-3">
          {/* Day Name */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1a3a1a]">
            {session.day}
          </h3>

          {/* Session Title */}
          <h4 className="text-lg sm:text-xl md:text-2xl font-medium text-[#2d5a2d]">
            {session.title}
          </h4>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#2d2d2d] leading-relaxed max-w-2xl">
            {session.description}
          </p>
        </div>

        {/* Right Side: Time */}
        <div className="shrink-0 lg:text-right">
          <div className="inline-flex items-center gap-2 lg:flex-col lg:items-end lg:gap-1">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b8e5a] lg:hidden" />
            <span className="text-base sm:text-lg md:text-xl font-medium text-[#6b8e5a] whitespace-nowrap">
              {session.time}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WeeklyLiveSessions() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="weekly-live-sessions"
      ref={sectionRef}
      className="relative w-full bg-[#1a3a1a] py-16 sm:py-20 md:py-24 lg:py-32 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          {/* Section Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#faf8f5] mb-4">
            Weekly Live Sessions
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#f5f1eb] max-w-3xl mx-auto leading-relaxed">
            Consistent practice builds lasting change.
          </p>
        </motion.div>

        {/* Schedule Meta */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16"
        >
          <div className="flex items-center gap-2 text-[#9caf88]">
            <Calendar className="w-5 h-5" />
            <span className="text-base sm:text-lg font-medium">
              Monday | Wednesday | Friday
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#9caf88]">
            <Clock className="w-5 h-5" />
            <span className="text-base sm:text-lg font-medium">
              7:00 – 8:00 PM
            </span>
          </div>
        </motion.div>

        {/* Sessions Cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="space-y-6 sm:space-y-8"
        >
          {sessions.map((session, index) => (
            <SessionCard key={session.day} session={session} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
