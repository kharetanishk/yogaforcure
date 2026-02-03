"use client";

import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const offerings = [
  {
    id: 1,
    title: "Online Group Live Sessions",
    summary: "This online yoga program focuses on strength, flexibility, balance, and core, helping you build a body that feels lighter, stronger, and more confident.",
    extended: "Whether you are starting fresh, getting back after a break, struggling with stiffness, weakness, or inconsistency, or simply wanting to invest time in your health, this space is for you.",
    imageSrc: "/gallery_yoga/online_card.avif",
    href: "#live-group-sessions",
    sectionId: "live-group-sessions",
    slideDirection: "left" as const,
  },
  {
    id: 2,
    title: "1-on-1 Sessions",
    summary: "Results-oriented, fully customized yoga sessions designed to meet your specific body needs, lifestyle, and health goals.",
    extended: "Each session is planned with focused attention, flexible scheduling, and personalized guidance to ensure efficient and sustainable progress. Along with movement practice, a complete diet plan is provided to support a healthier daily lifestyle. Clients typically begin noticing visible and measurable improvements from the first month.",
    imageSrc: "/gallery_yoga/1on1session.png",
    includes: [
      "Results-oriented sessions with clear goals and progress tracking",
      "Customized classes based on your individual requirements",
      "Flexible timings aligned with your personal schedule",
      "Complete diet guidance to support a healthy lifestyle",
      "Support for weight management and specific health concerns",
      "Complete attention to ensure better practice, correction, and results",
    ],
    href: "#one-on-one-sessions",
    sectionId: "one-on-one-sessions",
    slideDirection: "right" as const,
  },
  {
    id: 3,
    title: "YouTube Membership",
    summary: "A self-paced practice library with 100+ guided videos, including a 90-day fat loss journey, flexibility sessions, strength, core, and more.",
    extended: "This program is ideal if you prefer practicing on your own schedule, don't have time to follow a fixed routine, are self-motivated but need clear guidance, or want structured content you can return to anytime.",
    imageSrc: "/gallery_yoga/yoga-youtube.jpeg",
    href: "#youtube-membership",
    sectionId: "youtube-membership",
    slideDirection: "left" as const,
  },
  {
    id: 4,
    title: "Corporate Wellness",
    summary: "Professionally designed yoga and wellness programs that support employee productivity, focus, and sustainable performance.",
    extended: "Customized workplace sessions designed to reduce stress, improve posture, boost energy, and enhance focus. Led by an experienced instructor, the programs deliver practical, measurable benefits that help teams build resilience and clarity in their daily work.",
    imageSrc: "/gallery_yoga/corporate-yoga.jpg",
    href: "#corporate-wellness",
    sectionId: "corporate-wellness",
    slideDirection: "right" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = (direction: "left" | "right") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -40 : 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
    },
  },
});

function OfferingCard({
  offering,
  isExpanded,
  onToggle,
}: {
  offering: (typeof offerings)[number];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  
  // Determine the enroll URL based on offering type
  const enrollUrl = offering.sectionId === "youtube-membership" 
    ? "https://www.youtube.com/channel/UCpXHyfQbeKQXHCl5vKISokQ/join" 
    : getWhatsAppUrl();

  return (
    <motion.div
      id={offering.sectionId}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={itemVariants(offering.slideDirection)}
      className="w-full scroll-mt-24 sm:scroll-mt-28"
    >
      <motion.div
        layout
        className="bg-[#faf8f5] rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-[#ede8e0]/50 overflow-hidden"
        style={{
          minHeight: "280px", // Consistent collapsed height
        }}
      >
        {/* Mobile Layout: Stacked */}
        <div className="flex flex-col items-center text-center lg:hidden">
          {/* Featured image (Online Group Live Sessions) */}
          {"imageSrc" in offering && offering.imageSrc && (
            <div className="w-full max-w-md mb-6 overflow-hidden rounded-2xl ring-1 ring-[#ede8e0]/70 shadow-sm">
              <div className="relative aspect-[16/9]">
                <Image
                  src={offering.imageSrc}
                  alt={`${offering.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 448px"
                  loading="lazy"
                />
                {/* Premium overlay for contrast + consistency */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#9caf88]/18 via-transparent to-[#ede8e0]/20" />
              </div>
            </div>
          )}

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-3">
            {offering.title}
          </h3>

          {/* Summary - Always Visible */}
          <p className="text-base sm:text-lg text-[#2d2d2d] leading-relaxed max-w-md mb-4">
            {offering.summary}
          </p>

          {/* Learn More Button */}
          <button
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={`${offering.sectionId}-content`}
            className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium text-sm sm:text-base mb-4 transition-colors duration-300 flex items-center gap-1"
          >
            {isExpanded ? "Show less" : "Learn more"}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              ▾
            </motion.span>
          </button>

          {/* Extended Content - Expandable (description + includes only) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                id={`${offering.sectionId}-content`}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={{
                  collapsed: {
                    height: 0,
                    opacity: 0,
                    transition: {
                      duration: prefersReducedMotion ? 0 : 0.3,
                    },
                  },
                  expanded: {
                    height: "auto",
                    opacity: 1,
                    transition: {
                      duration: prefersReducedMotion ? 0 : 0.4,
                    },
                  },
                }}
                className="w-full max-w-md text-left space-y-4 overflow-hidden"
              >
                {/* Extended Description */}
                <p className="text-base sm:text-lg text-[#2d2d2d] leading-relaxed">
                  {offering.extended}
                </p>

                {/* What This Includes - Mobile */}
                {"includes" in offering && offering.includes && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-[#1a3a1a] mb-3">
                      What This Includes:
                    </h4>
                    <ul className="space-y-2">
                      {offering.includes.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm sm:text-base text-[#2d2d2d] leading-relaxed flex items-start"
                        >
                          <span className="text-[#9caf88] mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enroll Now - Always visible on mobile */}
          <div className="pt-2 w-full max-w-md">
            <Link
              href={enrollUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300 w-full sm:w-auto"
            >
              Enroll Now
            </Link>
          </div>
        </div>

        {/* Desktop Layout: Text left, Image right */}
        <div className="hidden lg:flex items-start gap-8 xl:gap-12">
          {/* Left: Text content */}
          <div className="flex-1 min-w-0 space-y-4 min-h-[200px]">
            <h3 className="text-3xl xl:text-4xl font-semibold text-[#1a3a1a]">
              {offering.title}
            </h3>

            <p className="text-lg xl:text-xl text-[#2d2d2d] leading-relaxed max-w-2xl">
              {offering.summary}
            </p>

            {/* Desktop: 1-on-1 Sessions shows Learn more; others show full content */}
            {offering.sectionId === "one-on-one-sessions" ? (
              <>
                <button
                  onClick={onToggle}
                  aria-expanded={isExpanded}
                  aria-controls={`${offering.sectionId}-content-desktop`}
                  className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium text-base xl:text-lg transition-colors duration-300 flex items-center gap-2"
                >
                  {isExpanded ? "Show less" : "Learn more"}
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    ▾
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`${offering.sectionId}-content-desktop`}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={{
                        collapsed: {
                          height: 0,
                          opacity: 0,
                          transition: {
                            duration: prefersReducedMotion ? 0 : 0.3,
                          },
                        },
                        expanded: {
                          height: "auto",
                          opacity: 1,
                          transition: {
                            duration: prefersReducedMotion ? 0 : 0.4,
                          },
                        },
                      }}
                      className="space-y-4 overflow-hidden"
                    >
                      <p className="text-lg xl:text-xl text-[#2d2d2d] leading-relaxed max-w-2xl">
                        {offering.extended}
                      </p>

                      {"includes" in offering && offering.includes && (
                        <div className="space-y-3">
                          <h4 className="text-xl font-semibold text-[#1a3a1a]">
                            What This Includes:
                          </h4>
                          <ul className="space-y-2">
                            {offering.includes.map((item, index) => (
                              <li
                                key={index}
                                className="text-base xl:text-lg text-[#2d2d2d] leading-relaxed flex items-start"
                              >
                                <span className="text-[#9caf88] mr-3 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enroll Now - Always visible on desktop for 1-on-1 */}
                <div className="pt-2">
                  <Link
                    href={enrollUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300"
                  >
                    Enroll Now
                  </Link>
                </div>
              </>
            ) : (
              <div id={`${offering.sectionId}-content-desktop`} className="space-y-4">
                <p className="text-lg xl:text-xl text-[#2d2d2d] leading-relaxed max-w-2xl">
                  {offering.extended}
                </p>

                {"includes" in offering && offering.includes && (
                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-[#1a3a1a]">
                      What This Includes:
                    </h4>
                    <ul className="space-y-2">
                      {offering.includes.map((item, index) => (
                        <li
                          key={index}
                          className="text-base xl:text-lg text-[#2d2d2d] leading-relaxed flex items-start"
                        >
                          <span className="text-[#9caf88] mr-3 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={enrollUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: Featured image */}
          {"imageSrc" in offering && offering.imageSrc && (
            <div className="shrink-0 w-full max-w-md xl:max-w-lg overflow-hidden rounded-2xl ring-1 ring-[#ede8e0]/70 shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={offering.imageSrc}
                  alt={`${offering.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, (min-width: 1280px) 36vw, 448px"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#9caf88]/18 via-transparent to-[#ede8e0]/20" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WhatWeOffer() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1a3a1a] mb-4">
            What We Offer
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-[#2d2d2d] max-w-3xl mx-auto">
            Choose the path that fits your journey
          </p>
        </motion.div>

        {/* Offerings Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16"
        >
          {offerings.map((offering) => (
            <OfferingCard
              key={offering.id}
              offering={offering}
              isExpanded={expandedId === offering.id}
              onToggle={() => handleToggle(offering.id)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
