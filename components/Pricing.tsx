"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const benefits = [
  "Improved flexibility without forcing",
  "Strength that supports your joints and spine",
  "Better posture, balance, and core control",
  "Increased body awareness",
  "More confidence in your movements",
  "Consistency without burnout",
];

const pricingPlans = [
  {
    id: "monthly",
    title: "Monthly",
    price: "₹1500",
    duration: "per month",
    badge: null,
  },
  {
    id: "3months",
    title: "3 Months",
    price: "₹3000",
    duration: "per 3 months",
    badge: null,
  },
  {
    id: "6months",
    title: "6 Months",
    price: "₹5500",
    duration: "per 6 months",
    badge: "Best Value",
  },
  {
    id: "1year",
    title: "1 Year",
    price: "₹10000",
    duration: "per year",
    badge: null,
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

function PricingCard({
  plan,
}: {
  plan: (typeof pricingPlans)[number];
}) {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="bg-[#faf8f5] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative"
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#9caf88] text-[#1a3a1a] text-xs font-semibold px-3 py-1 rounded-full">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Plan Title */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-2">
            {plan.title}
          </h3>
          <p className="text-sm text-[#6b8e5a]">{plan.duration}</p>
        </div>

        {/* Price */}
        <div className="pb-4 border-b border-[#ede8e0]">
          <div className="text-4xl sm:text-5xl font-bold text-[#1a3a1a]">
            {plan.price}
          </div>
        </div>

        {/* Benefits Checklist */}
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-[#2d5a2d]" strokeWidth={2.5} />
              </div>
              <span className="text-base text-[#2d2d2d] leading-relaxed">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-6 py-3.5 rounded-full font-semibold transition-all duration-300 bg-[#2d5a2d] text-[#faf8f5] hover:bg-[#1a3a1a] shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const [activeTab, setActiveTab] = useState<"pricing" | "how-it-works">("pricing");

  const currentPlans = pricingPlans;

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Page Header */}
      <section className="relative w-full bg-[#f5f1eb] pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-[#1a3a1a] mb-4">
              Investment in Yourself
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#2d2d2d] max-w-3xl mx-auto leading-relaxed">
              Choose the path that matches your commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plan Type Switcher */}
      <section className="relative w-full bg-[#f5f1eb] py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex rounded-full bg-[#9caf88]/20 p-1.5 gap-1">
              <button
                onClick={() => setActiveTab("pricing")}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeTab === "pricing"
                    ? "bg-[#2d5a2d] text-[#faf8f5] shadow-md"
                    : "text-[#2d5a2d] hover:text-[#1a3a1a]"
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => setActiveTab("how-it-works")}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeTab === "how-it-works"
                    ? "bg-[#2d5a2d] text-[#faf8f5] shadow-md"
                    : "text-[#2d5a2d] hover:text-[#1a3a1a]"
                }`}
              >
                How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards & How to Get Started */}
      <section
        ref={sectionRef}
        className="relative w-full bg-[#f5f1eb] py-8 pb-16 sm:pb-20 md:pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <AnimatePresence mode="wait">
            {activeTab === "pricing" ? (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8"
              >
                {currentPlans.map((plan, index) => (
                  <PricingCard
                    key={plan.id}
                    plan={plan}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="how-it-works"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-[#faf8f5] rounded-2xl p-8 sm:p-10 md:p-12 shadow-sm">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1a3a1a] mb-8 text-center">
                    How to Get Started
                  </h2>
                  <ol className="space-y-6">
                    {[
                      "Book a consultation",
                      "Choose a plan that fits you",
                      "Join live classes",
                      "Start feeling the difference",
                    ].map((step, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-start gap-4 text-[#2d2d2d]"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#9caf88]/20 flex items-center justify-center text-base font-semibold text-[#2d5a2d]">
                          {index + 1}
                        </span>
                        <span className="text-lg sm:text-xl leading-relaxed pt-1">
                          {step}
                        </span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
