"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const offerings = [
  {
    id: 1,
    title: "Online Group Live Yoga Classes",
    summary:
      "Live online yoga classes led by an experienced Indian yoga instructor, focusing on strength, flexibility, balance, and core stability.",
    description:
      "These group yoga sessions are ideal if you want structured practice, consistency, and guidance from a qualified English-speaking yoga teacher in India. Classes are suitable for beginners and intermediate practitioners looking to build strength, mobility, and confidence through authentic yoga practice.",
    imageSrc: "/gallery_yoga/online_card.avif",
    imageSrcDesktop: "/photos/online-group-desktop.jpeg",
    href: "#live-group-sessions",
  },
  {
    id: 2,
    title: "1-on-1 Personalized Online Yoga Sessions",
    summary:
      "Fully customized one-on-one online yoga sessions designed around your body, lifestyle, health goals, and limitations.",
    description:
      "These private yoga classes are taught by an experienced Indian yoga instructor in fluent English. Sessions focus on posture correction, pain management, strength building, flexibility, and sustainable lifestyle changes. Personalized diet guidance is also provided to support long-term results.",
    includes: [
      "Personalized online yoga sessions with full attention",
      "Clear English instruction and posture correction",
      "Support for pain relief, weight management, and mobility",
      "Flexible scheduling to fit your daily routine",
      "Lifestyle and diet guidance for holistic improvement",
    ],
    imageSrc: "/gallery_yoga/1on1session.png",
    href: "#one-on-one-sessions",
  },
  {
    id: 3,
    title: "Online Yoga Practice Library (YouTube Membership)",
    summary:
      "A self-paced online yoga library with 100+ guided sessions, including strength, flexibility, fat loss, and mobility programs.",
    description:
      "This option is ideal if you prefer practicing yoga at your own pace with guidance from an experienced Indian yoga teacher. All sessions are explained clearly in English and designed to help you stay consistent without a fixed schedule.",
    imageSrc: "/gallery_yoga/yoga-youtube.jpeg",
    href: "https://www.youtube.com/channel/UCpXHyfQbeKQXHCl5vKISokQ/join",
    external: true,
  },
  {
    id: 4,
    title: "Corporate Yoga & Wellness Programs",
    summary:
      "Professional online corporate yoga programs designed to reduce stress, improve posture, and enhance workplace productivity.",
    description:
      "Led by an experienced Indian yoga instructor, these corporate wellness sessions are conducted in English and tailored for modern work environments. Programs focus on stress management, posture correction, mental clarity, and sustainable employee well-being.",
    imageSrc: "/gallery_yoga/corporate-yoga.jpg",
    href: "#corporate-wellness",
  },
];

export default function WhatWeOffer() {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      id="what-we-offer"
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Heading */}
        <header className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1a3a1a] mb-4">
            Our Yoga Programs
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-[#2d2d2d] max-w-3xl mx-auto">
            Choose from live group classes, personalized one-on-one sessions, or
            self-paced online yoga programs — all taught in clear English.{" "}
            <Link
              href="/#pricing"
              className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium no-underline"
            >
              View pricing
            </Link>
            {" · "}
            <Link
              href="/#weekly-live-sessions"
              className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium no-underline"
            >
              View schedule
            </Link>
          </p>
        </header>

        {/* Offerings: grid gives equal-height rows on desktop; button pinned via flex */}
        <div className="space-y-12 sm:space-y-14 md:space-y-16 lg:grid lg:grid-cols-1 lg:grid-rows-4 lg:auto-rows-fr lg:gap-12 lg:space-y-0">
          {offerings.map((offering) => {
            const isExpanded = expandedIds.has(offering.id);
            return (
              <article
                key={offering.id}
                id={offering.href.replace("#", "")}
                className="bg-[#faf8f5] rounded-2xl p-6 sm:p-8 md:p-10 border border-[#ede8e0]/60 shadow-sm flex flex-col lg:flex-row lg:min-h-0 gap-8 xl:gap-12"
              >
                {/* Text: flex column so Enroll Now can be mt-auto (pinned to bottom) */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0">
                  <h3 className="text-2xl sm:text-3xl xl:text-4xl font-semibold text-[#1a3a1a] shrink-0">
                    {offering.title}
                  </h3>

                  <p className="text-base sm:text-lg xl:text-xl text-[#2d2d2d] leading-relaxed max-w-2xl shrink-0">
                    {offering.summary}
                  </p>

                  {/* Long description: full text always in HTML (SEO); line-clamp on mobile, toggled by Learn more */}
                  <p
                    className={`text-base sm:text-lg xl:text-xl text-[#2d2d2d] leading-relaxed max-w-2xl shrink-0 ${
                      isExpanded
                        ? "max-lg:line-clamp-none"
                        : "line-clamp-4 max-lg:line-clamp-3"
                    }`}
                  >
                    {offering.description}
                  </p>

                  {offering.includes && (
                    <div className="shrink-0 pt-1">
                      <ul
                        className={`space-y-2 ${isExpanded ? "max-lg:line-clamp-none" : "line-clamp-5 max-lg:line-clamp-3"}`}
                      >
                        {offering.includes.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start text-base sm:text-lg text-[#2d2d2d]"
                          >
                            <span className="text-[#9caf88] mr-3 mt-1 shrink-0">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learn more / Show less: mobile only, toggles CSS class so full text stays in HTML */}
                  <div className="lg:hidden shrink-0 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(offering.id)}
                      className="text-[#2d5a2d] hover:text-[#1a3a1a] font-medium text-sm no-underline"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? "Show less" : "Learn more"}
                    </button>
                  </div>

                  {/* Enroll Now: pinned to bottom of card so always visible without scrolling */}
                  <div className="mt-auto pt-4 shrink-0">
                    <Link
                      href={
                        offering.external ? offering.href : getWhatsAppUrl()
                      }
                      target={offering.external ? "_blank" : undefined}
                      rel={
                        offering.external ? "noopener noreferrer" : undefined
                      }
                      className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2d5a2d] text-[#faf8f5] font-semibold rounded-full hover:bg-[#1a3a1a] transition-colors"
                    >
                      {offering.id === 2 || offering.id === 4
                        ? "Enquire Now"
                        : "Enroll Now"}
                    </Link>
                  </div>
                </div>

                {/* Image: fills card height on desktop so layout stays balanced */}
                <div className="shrink-0 w-full max-w-md xl:max-w-lg overflow-hidden rounded-2xl ring-1 ring-[#ede8e0]/70 relative aspect-[4/3] lg:aspect-auto lg:min-h-0">
                  <div className="absolute inset-0">
                    {"imageSrcDesktop" in offering &&
                    offering.imageSrcDesktop ? (
                      <>
                        <Image
                          src={offering.imageSrc}
                          alt={`${offering.title} taught by experienced Indian yoga instructor online in English`}
                          fill
                          className="object-cover w-full h-full lg:hidden"
                          sizes="90vw"
                          loading="lazy"
                        />
                        <Image
                          src={offering.imageSrcDesktop}
                          alt={`${offering.title} taught by experienced Indian yoga instructor online in English`}
                          fill
                          className="object-cover w-full h-full hidden lg:block"
                          sizes="(min-width: 1024px) 40vw, 0"
                          loading="lazy"
                        />
                      </>
                    ) : (
                      <Image
                        src={offering.imageSrc}
                        alt={`${offering.title} taught by experienced Indian yoga instructor online in English`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 40vw, 90vw"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Hidden SEO Reinforcement */}
        <p className="sr-only">
          Experienced Indian yoga instructor offering online yoga classes in
          English, including group yoga sessions, one-on-one personalized yoga,
          corporate wellness, and self-paced online yoga programs.
        </p>
      </div>
    </section>
  );
}
