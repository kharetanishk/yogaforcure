"use client";

import { motion, Variants } from "framer-motion";

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(45, 90, 45, 0.3)",
      "0 0 0 10px rgba(45, 90, 45, 0)",
      "0 0 0 0 rgba(45, 90, 45, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function CTA() {
  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-[#ede8e0] via-[#f5f1eb] to-[#faf8f5]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8 lg:space-y-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a3a1a] leading-relaxed"
          >
            Your journey to wellness starts here.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              variants={pulseVariants}
              animate="pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 lg:px-12 lg:py-5 bg-[#2d5a2d] text-[#faf8f5] rounded-full text-lg lg:text-xl font-semibold shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300"
            >
              Begin Your Practice
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
