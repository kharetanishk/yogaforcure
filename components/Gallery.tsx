"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryItems: Array<{
  src: string;
  alt: string;
  label: "Photo" | "Video";
  thought: string;
}> = [
  {
    src: "/yoag1.png",
    alt: "Yoga practice - gallery 1",
    label: "Photo",
    thought: "Yoga is peace.",
  },
  {
    src: "/yoga2.png",
    alt: "Yoga practice - gallery 2",
    label: "Photo",
    thought: "Breathe in calm. Breathe out noise.",
  },
  {
    src: "/yoga3.png",
    alt: "Yoga practice - gallery 3",
    label: "Photo",
    thought: "Move with intention.",
  },
  {
    src: "/yoga4.png",
    alt: "Yoga practice - gallery 4",
    label: "Photo",
    thought: "Strength, softly.",
  },
  {
    src: "/yoga5.png",
    alt: "Yoga practice - gallery 5",
    label: "Photo",
    thought: "The present is enough.",
  },
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Gallery() {
  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-[#f5f1eb] to-[#ede8e0]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a3a1a] mb-4">
            Gallery
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-[#9caf88] to-[#d4ddd4] mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6"
        >
          {galleryItems.map((item, index) => {
            const isLarge = index === 0;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={[
                  "group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 ring-1 ring-[#d4ddd4]/30",
                  isLarge ? "lg:col-span-7" : "lg:col-span-5",
                ].join(" ")}
              >
                <div className="relative aspect-16/10 sm:aspect-4/3 lg:aspect-16/10">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-br from-[#9caf88]/10 via-transparent to-[#ede8e0]/20" />

                  <div className="absolute left-5 right-5 bottom-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] tracking-wide text-white/90">
                        {item.label}
                      </span>
                      <span className="text-white/70 text-[11px] tracking-wide">
                        Gallery
                      </span>
                    </div>

                    <p className="mt-3 text-white/95 font-medium text-sm sm:text-base leading-snug">
                      {item.thought}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
