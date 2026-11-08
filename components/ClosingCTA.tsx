"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function ClosingCTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 sm:space-y-10"
        >
          {/* Main Question */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a3a1a] leading-tight"
          >
            Ready to move better and feel stronger?
          </motion.h2>

          {/* CTA Line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-[#2d2d2d] leading-relaxed"
          >
            Book your consultation or join the program today.
          </motion.p>

          {/* Reflective Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4 pt-4"
          >
            <p className="text-base sm:text-lg md:text-xl text-[#2d2d2d] leading-relaxed italic max-w-2xl mx-auto">
              Your body is always responding to what you do — or what you avoid.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[#2d2d2d] leading-relaxed italic max-w-2xl mx-auto">
              If practice has been on your mind for a while, maybe it's time to begin.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6"
          >
            <Link
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300 text-base sm:text-lg"
            >
              Book Consultation
            </Link>
            <Link
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 bg-transparent border-2 border-[#9caf88] text-[#2d5a2d] font-semibold rounded-full hover:bg-[#9caf88]/10 transition-all duration-300 text-base sm:text-lg"
            >
              Join Program
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
