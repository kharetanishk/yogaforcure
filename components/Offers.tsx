"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Users,
  User,
  Building2,
  Calendar,
  UtensilsCrossed,
  Target,
  FileText,
} from "lucide-react";

const tabs = [
  { id: "group", label: "Group Sessions", icon: Users },
  { id: "one-on-one", label: "One-on-One Sessions", icon: User },
  { id: "corporate", label: "Corporate Sessions", icon: Building2 },
];

const oneOnOneFeatures = [
  {
    icon: User,
    title: "Live 1-on-1 Sessions",
    description: "Personalized attention in every session",
  },
  {
    icon: Calendar,
    title: "Flexible Timings",
    description: "Schedule that fits your lifestyle",
  },
  {
    icon: UtensilsCrossed,
    title: "Customized Diet Plan",
    description: "Nutrition tailored to your needs",
  },
  {
    icon: Target,
    title: "Result-Oriented Sessions",
    description: "Focused on achieving your goals",
  },
  {
    icon: FileText,
    title: "Monthly Progress Report",
    description: "Track your journey and improvements",
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const hoverVariants = {
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
};

export default function Offers() {
  const [activeTab, setActiveTab] = useState("one-on-one");

  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-[#ede8e0] to-[#f5f1eb]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a3a1a] mb-4">
            What Do We Offer
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-[#9caf88] to-[#d4ddd4] mx-auto rounded-full" />
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 lg:mb-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#faf8f5] text-[#1a3a1a] shadow-md border border-[#d4ddd4]/40"
                    : "bg-[#faf8f5]/60 text-[#6b8e5a] hover:bg-[#faf8f5]/80 border border-[#d4ddd4]/20"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#2d5a2d]" : "text-[#6b8e5a]"}`} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "one-on-one" && (
            <motion.div
              key="one-on-one"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {oneOnOneFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#faf8f5] rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#d4ddd4]/30"
                    >
                      <motion.div
                        variants={hoverVariants}
                        className="flex flex-col items-center text-center space-y-4"
                      >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-linear-to-br from-[#9caf88]/20 to-[#6b8e5a]/20 flex items-center justify-center border border-[#d4ddd4]/40">
                          <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-[#2d5a2d]" />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-semibold text-[#1a3a1a]">
                          {feature.title}
                        </h3>
                        <p className="text-sm lg:text-base text-[#6b8e5a]">
                          {feature.description}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {(activeTab === "group" || activeTab === "corporate") && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <div className="bg-[#faf8f5] rounded-2xl p-12 lg:p-16 shadow-sm max-w-2xl mx-auto border border-[#d4ddd4]/30">
                <p className="text-lg lg:text-xl text-[#6b8e5a]">
                  Content for {tabs.find((t) => t.id === activeTab)?.label}{" "}
                  coming soon...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
