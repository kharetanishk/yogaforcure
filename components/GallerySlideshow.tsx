"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Instagram, Youtube, Users } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    src: "/gallery_yoga/yoga_3.webp",
    alt: "Yoga practice session",
  },
  {
    src: "/gallery_yoga/yoga_4.webp",
    alt: "Yoga practice session",
  },
  {
    src: "/gallery_yoga/yoga_5.webp",
    alt: "Yoga practice session",
  },
  {
    src: "/gallery_yoga/yoga_6.webp",
    alt: "Yoga practice session",
  },
  {
    src: "/gallery_yoga/yoga_7.webp",
    alt: "Yoga practice session",
  },
  {
    src: "/gallery_yoga/DSC08548.webp",
    alt: "Yoga practice session",
  },
  {
    src: "/gallery_yoga/DSC08725.webp",
    alt: "Yoga practice session",
  },
];

interface SocialFollower {
  platform: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  url?: string;
}

const socialFollowers: SocialFollower[] = [
  {
    platform: "Instagram",
    count: 15200,
    icon: <Instagram className="w-5 h-5" />,
    color: "from-pink-500 to-purple-500",
    url: "https://www.instagram.com/yoga_for_cure/",
  },
  {
    platform: "YouTube",
    count: 332000,
    icon: <Youtube className="w-5 h-5" />,
    color: "from-red-500 to-red-600",
    url: "https://youtube.com/@yogaforcurevideos?si=ghzfooOK5a0c_0ho",
  },
  {
    platform: "Students",
    count: 3200,
    icon: <Users className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
  },
];

function AnimatedCounter({
  value,
  duration = 2000,
  start = true,
}: {
  value: number;
  duration?: number;
  start?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, start]);

  return <span>{count.toLocaleString()}</span>;
}

export default function GallerySlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const countersRef = useRef<HTMLDivElement>(null);
  const [isCountersInView, setIsCountersInView] = useState(false);

  // Run count-up animation only when the counters block scrolls into view
  useEffect(() => {
    const el = countersRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsCountersInView(true);
          observer.disconnect(); // Only animate once
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.2, // Trigger when 20% of the element is visible
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full mb-12 lg:mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Slideshow */}
        <div className="lg:col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg ring-1 ring-[#d4ddd4]/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[currentSlide].src}
                alt={slides[currentSlide].alt}
                fill
                className="object-cover"
                priority={currentSlide === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Social Followers - count animation starts when this block scrolls into view */}
        <div ref={countersRef} className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full bg-gradient-to-br from-[#faf8f5] to-[#ede8e0] rounded-3xl p-6 lg:p-8 shadow-lg ring-1 ring-[#d4ddd4]/30 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-[#1a3a1a] mb-6 text-center lg:text-left">
              Join Our Community
            </h3>
            <div className="space-y-4">
              {socialFollowers.map((social, index) => {
                const content = (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors ${
                      social.url ? "cursor-pointer" : ""
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${social.color} text-white shadow-md`}
                    >
                      {social.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#1a3a1a]/70 font-medium">
                        {social.platform}
                      </p>
                      <p className="text-2xl font-bold text-[#1a3a1a]">
                        <AnimatedCounter value={social.count} start={isCountersInView} />
                      </p>
                    </div>
                  </motion.div>
                );

                return social.url ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={social.platform}>{content}</div>
                );
              })}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-center lg:text-left text-sm text-[#1a3a1a]/70"
            >
              Follow us for daily inspiration and yoga tips
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
