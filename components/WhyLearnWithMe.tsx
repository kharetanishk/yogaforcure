"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

const benefits = [
  "I observe how your body moves",
  "I understand different body needs",
  "I don't push randomly — I guide intelligently",
  "I motivate you when discipline drops",
  "I stay with you until you see results",
];

export default function WhyLearnWithMe() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="why-learn-with-me"
      ref={sectionRef}
      className="relative w-full bg-[#1a3a1a] py-16 sm:py-20 md:py-24 lg:py-32 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9 }}
          className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 xl:gap-20"
        >
          {/* Left Column: Instructor Image + name as one centered unit */}
          <div className="shrink-0 w-full lg:w-auto flex justify-center">
            <div className="flex flex-col items-center w-[min(100%,16rem)] sm:w-80 lg:w-96">
              <div className="relative w-full aspect-square">
                {/* Outer subtle ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[#9caf88]/30" />
                {/* Middle ring */}
                <div className="absolute inset-2 rounded-full border border-[#9caf88]/20" />
                {/* Image container */}
                <div className="absolute inset-4 rounded-full overflow-hidden bg-[#ede8e0]">
                  <Image
                    src="/gallery_yoga/neha_2.jpeg"
                    alt="Yoga instructor Neha"
                    width={400}
                    height={400}
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="mt-5 w-full text-center text-sm sm:text-base font-medium text-[#9caf88] tracking-[0.2em] uppercase">
                Neha
              </p>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 space-y-6 sm:space-y-8 text-left">
            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-semibold text-[#faf8f5] leading-tight">
              Why Learn With Me?
            </h2>

            {/* Body Text */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
              I've been teaching yoga for 10+ years, and what sets my classes apart is not just experience — it's understanding people.
            </p>

            {/* Bullet Points */}
            <ul className="space-y-4 sm:space-y-5 pt-2">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={
                    isInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -12 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + index * 0.1,
                  }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#9caf88]" strokeWidth={2.5} />
                  </div>
                  <span className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl text-[#f5f1eb] leading-relaxed">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Closing Paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-4 space-y-4"
            >
              <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
                I don't believe in quick fixes.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
                I believe in consistent, mindful practice that actually changes how your body feels and functions.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[#f5f1eb] leading-relaxed max-w-3xl">
                Many of my students come with pain, stiffness, low confidence, or confusion — and over time, they feel the difference, not just see it.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
