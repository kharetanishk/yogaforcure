"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const benefits = [
  "Improved flexibility without forcing",
  "Strength that supports your joints and spine",
  "Better posture, balance, and core control",
  "Increased body awareness",
  "More confidence in your movements",
  "Consistency without burnout",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function WhatYoullGain() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          {/* Section Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1a3a1a] mb-4">
            What You'll Gain From These Classes
          </h2>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <ul className="space-y-4 sm:space-y-5">
            {benefits.map((text, index) => (
              <motion.li
                key={text}
                variants={itemVariants}
                className="flex items-start gap-4 text-left"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9caf88]" />
                <span className="text-base sm:text-lg md:text-xl text-[#1a3a1a] leading-relaxed">
                  {text}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
