"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

const galleryImages = [
  {
    src: "/gallery_yoga/yoga_3.webp",
    alt: "Yoga practice session 1",
    thought: "Find your balance.",
  },
  {
    src: "/gallery_yoga/yoga_4.webp",
    alt: "Yoga practice session 2",
    thought: "Strength from within.",
  },
  {
    src: "/gallery_yoga/yoga_5.webp",
    alt: "Yoga practice session 3",
    thought: "Peace in movement.",
  },
  {
    src: "/gallery_yoga/yoga_6.webp",
    alt: "Yoga practice session 4",
    thought: "Breathe and flow.",
  },
  {
    src: "/gallery_yoga/yoga_7.webp",
    alt: "Yoga practice session 5",
    thought: "Mindful moments.",
  },
  {
    src: "/gallery_yoga/DSC08548.webp",
    alt: "Yoga practice session 6",
    thought: "Connect with yourself.",
  },
  {
    src: "/gallery_yoga/DSC08725.webp",
    alt: "Yoga practice session 7",
    thought: "Journey to wellness.",
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

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function GalleryGrid() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 lg:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a3a1a] mb-4">
          Our Gallery
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#9caf88] to-[#d4ddd4] mx-auto rounded-full" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      >
        {galleryImages.map((item, index) => {
          const isLarge = index === 0 || index === 3;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className={[
                "group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-[#d4ddd4]/30",
                isLarge ? "sm:col-span-2 lg:col-span-2" : "",
              ].join(" ")}
            >
              <div className={`relative ${isLarge ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[4/3]"}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#9caf88]/10 via-transparent to-[#ede8e0]/20" />

                <div className="absolute left-5 right-5 bottom-5">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 text-xs tracking-wide text-white/95 font-medium">
                      Photo
                    </span>
                  </div>

                  <p className="text-white/95 font-semibold text-base sm:text-lg leading-snug">
                    {item.thought}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
