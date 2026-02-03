"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  // Detect when scrolled past hero section (when navbar disappears)
  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroHeight = window.innerWidth >= 1024 
      ? window.innerHeight 
      : window.innerWidth >= 640 
        ? window.innerHeight * 0.85 
        : window.innerHeight;
    // Show button when scrolled past hero section
    setIsVisible(latest > heroHeight - 50);
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#2d5a2d]/80 backdrop-blur-md border border-[#9caf88]/30 shadow-lg hover:bg-[#2d5a2d]/90 hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
