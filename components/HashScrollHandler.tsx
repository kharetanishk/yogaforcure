"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Map hash links to actual section IDs
const hrefToIdMap: Record<string, string> = {
  "#about": "why-learn-with-me",
  "#schedule": "weekly-live-sessions",
  "#live-group-sessions": "live-group-sessions",
  "#youtube-membership": "youtube-membership",
  "#corporate-wellness": "corporate-wellness",
  "#one-on-one-sessions": "one-on-one-sessions",
};

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Only handle hash scrolling on the home page
    if (pathname !== "/") return;

    // Get hash from URL
    const hash = window.location.hash;
    if (!hash) return;

    // Get the target ID from the hash
    const targetId = hrefToIdMap[hash] || hash.replace("#", "");

    // Wait for page to be fully rendered
    const scrollToSection = () => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Calculate offset: navbar height + some padding
        const navbarOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

        // Smooth scroll with native behavior
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(scrollToSection, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
