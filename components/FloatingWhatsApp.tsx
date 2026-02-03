"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function FloatingWhatsApp() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50">
      <motion.button
        type="button"
        aria-label="WhatsApp"
        title="WhatsApp"
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                boxShadow: [
                  "0 10px 25px rgba(0, 0, 0, 0.12)",
                  "0 14px 36px rgba(0, 0, 0, 0.16)",
                  "0 10px 25px rgba(0, 0, 0, 0.12)",
                ],
              }
        }
        transition={
          prefersReducedMotion
            ? { type: "spring", stiffness: 420, damping: 30 }
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
        className="group relative inline-flex items-center justify-center rounded-full bg-transparent"
      >
        <Image
          src="/whatsappicon.webp"
          alt="WhatsApp"
          width={72}
          height={72}
          sizes="72px"
          unoptimized
          priority
          className="h-16 w-16 sm:h-[72px] sm:w-[72px] select-none drop-shadow-[0_14px_28px_rgba(0,0,0,0.18)]"
        />

        <span className="pointer-events-none absolute right-full mr-3 hidden sm:inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-[#2d2d2d] shadow ring-1 ring-black/5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          WhatsApp
        </span>
      </motion.button>
    </div>
  );
}

