"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import CallModal from "./CallModal";

const navLinks = [
  { href: "#home", label: "Home" },
  {
    href: "#programs",
    label: "Programs",
    dropdown: [
      { href: "#group-classes", label: "Online Group Live Sessions" },
      { href: "#youtube", label: "YouTube Membership" },
      { href: "#corporate", label: "Corporate Wellness" },
      { href: "#one-on-one", label: "1-on-1 Personal Sessions" },
    ],
  },
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "#pricing", label: "Pricing" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          height: isScrolled ? 64 : 80,
          backgroundColor: isScrolled
            ? "rgba(250, 248, 245, 0.95)"
            : "rgba(250, 248, 245, 0.98)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#d4ddd4]/30 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-2">
            {/* Logo */}
            <Link
              href="#home"
              className="flex items-center space-x-2 group shrink-0"
              aria-label="Yoga for Cure by Neha"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xl lg:text-2xl font-bold text-[#2d5a2d] group-hover:text-[#1a3a1a] transition-colors whitespace-nowrap"
              >
                Yoga for Cure
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0.5 flex-1 justify-center min-w-0">
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.dropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        type="button"
                        onClick={() => handleDropdownToggle(link.label)}
                        className="flex items-center gap-1 px-3 py-2 text-[#2d5a2d] font-medium hover:text-[#1a3a1a] transition-colors rounded-lg group whitespace-nowrap text-sm"
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-2 w-64 bg-[#f5f1eb] rounded-2xl shadow-lg border border-[#d4ddd4]/40 py-2 overflow-hidden"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-5 py-3 text-[#2d5a2d] hover:bg-[#e8ede8]/60 transition-colors text-sm font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="relative px-3 py-2 text-[#2d5a2d] font-medium hover:text-[#1a3a1a] transition-colors rounded-lg group whitespace-nowrap text-sm"
                    >
                      {link.label}
                      <motion.span
                        className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#9caf88] rounded-full"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <motion.div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (isMobile) {
                    window.location.href = "tel:918310764597";
                  } else {
                    setIsCallModalOpen(true);
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300 whitespace-nowrap text-sm cursor-pointer"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Call Now
              </button>
              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Ensure WhatsApp link opens properly
                  e.stopPropagation();
                }}
                className="inline-flex items-center px-4 py-2 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#1a3a1a] transition-all duration-300 whitespace-nowrap text-sm"
              >
                Book Consultation
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#2d5a2d] rounded-lg hover:bg-[#e8ede8]/40 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#faf8f5] shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#d4ddd4]/30">
                  <span className="text-xl font-bold text-[#2d5a2d]">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#2d5a2d] rounded-lg hover:bg-[#e8ede8]/40 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex-1 px-6 py-8 space-y-2">
                  {navLinks.map((link) => (
                    <div key={link.href}>
                      {link.dropdown ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => handleDropdownToggle(link.label)}
                            className="w-full flex items-center justify-between px-4 py-3 text-[#2d5a2d] font-medium rounded-lg hover:bg-[#e8ede8]/40 transition-colors"
                          >
                            {link.label}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                activeDropdown === link.label
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === link.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 space-y-1">
                                  {link.dropdown.map((item) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className="block px-4 py-2.5 text-sm text-[#2d5a2d] rounded-lg hover:bg-[#9caf88]/30 hover:text-[#1a3a1a] transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className="block px-4 py-3 text-[#2d5a2d] font-medium rounded-lg hover:bg-[#e8ede8]/40 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="p-6 border-t border-[#d4ddd4]/30 space-y-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isMobile) {
                        window.location.href = "tel:918310764597";
                      } else {
                        setIsCallModalOpen(true);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#9caf88] text-[#1a3a1a] font-semibold rounded-full shadow-md hover:bg-[#8ba077] transition-all duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                  <Link
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3.5 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full shadow-md hover:bg-[#1a3a1a] transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Call Modal */}
      <CallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
    </>
  );
}
