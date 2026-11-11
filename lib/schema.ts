// JSON-LD builders. Every entity has a stable @id so pages can point at the
// shared Organization, WebSite and Person instead of repeating them.
//
// No Review or AggregateRating markup: Google ignores "self-serving" reviews
// that a business shows about itself on its own site, and can treat them as
// spam. Testimonials stay as visible content only.

import type { FaqItem } from "@/lib/faq";
import {
  CLASS_TIMES,
  CLASS_TIMEZONE,
  GROUP_COURSE,
  INSTRUCTOR,
  LOGO,
  PLANS,
  SITE_ALT_NAME,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  WEEKLY_SESSIONS,
  WHATSAPP_NUMBER,
} from "@/lib/site";

export type JsonLdNode = { "@type": string; [key: string]: unknown };

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/#neha`;
const COURSE_ID = `${SITE_URL}/#group-classes`;

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);
const ref = (id: string) => ({ "@id": id });

/** Wraps nodes in one @graph document. */
export function graph(...nodes: JsonLdNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function organization(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAME,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: abs(LOGO.path),
      width: LOGO.width,
      height: LOGO.height,
    },
    image: ref(`${SITE_URL}/#logo`),
    sameAs: SOCIAL_LINKS,
    founder: ref(PERSON_ID),
    areaServed: "Worldwide",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: WHATSAPP_NUMBER,
      contactType: "customer service",
      availableLanguage: ["English"],
      areaServed: "Worldwide",
    },
  };
}

export function website(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "en",
    publisher: ref(ORGANIZATION_ID),
  };
}

export function person(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: INSTRUCTOR.name,
    jobTitle: INSTRUCTOR.jobTitle,
    description: INSTRUCTOR.description,
    image: abs(INSTRUCTOR.image),
    url: `${SITE_URL}/`,
    worksFor: ref(ORGANIZATION_ID),
    knowsAbout: INSTRUCTOR.knowsAbout,
    sameAs: SOCIAL_LINKS,
    ...(INSTRUCTOR.credentials.length > 0 && {
      hasCredential: INSTRUCTOR.credentials.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.name,
        ...(c.issuedBy && { recognizedBy: { "@type": "Organization", name: c.issuedBy } }),
      })),
    }),
  };
}

/** The group classes, with the weekly timetable and plan prices. */
export function groupCourse(): JsonLdNode {
  return {
    "@type": "Course",
    "@id": COURSE_ID,
    name: GROUP_COURSE.name,
    description: GROUP_COURSE.description,
    url: `${SITE_URL}/#weekly-live-sessions`,
    provider: ref(ORGANIZATION_ID),
    inLanguage: "en",
    availableLanguage: "English",
    offers: PLANS.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      category: "Paid",
      price: String(plan.price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/`,
    })),
    hasCourseInstance: CLASS_TIMES.map((time) => ({
      "@type": "CourseInstance",
      name: `${GROUP_COURSE.name} (${time.label} IST)`,
      courseMode: "Online",
      instructor: ref(PERSON_ID),
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: "Weekly",
        repeatCount: 52,
        byDay: WEEKLY_SESSIONS.map((s) => `https://schema.org/${s.day}`),
        startTime: time.start,
        endTime: time.end,
        scheduleTimezone: CLASS_TIMEZONE,
      },
    })),
  };
}

export function breadcrumb(items: { name: string; path: string }[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqPage(items: FaqItem[], pageUrl: string): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export type BlogPostingInput = {
  url: string;
  headline: string;
  description: string;
  images: string[];
  datePublished: Date;
  dateModified: Date;
  wordCount: number;
  section?: string;
  /** Builder posts can name another author; Neha links to her Person entity. */
  author?: { name: string; description?: string };
};

export function blogPosting(post: BlogPostingInput): JsonLdNode {
  const isNeha = !post.author || post.author.name.trim().toLowerCase() === INSTRUCTOR.name.toLowerCase();
  return {
    "@type": "BlogPosting",
    "@id": `${post.url}#article`,
    headline: post.headline,
    description: post.description,
    // Google needs an image for article results; fall back to the site's main picture.
    image: post.images.length > 0 ? post.images : [abs("/hero-section.webp")],
    datePublished: post.datePublished.toISOString(),
    dateModified: post.dateModified.toISOString(),
    author: isNeha
      ? ref(PERSON_ID)
      : {
          "@type": "Person",
          name: post.author!.name,
          ...(post.author!.description && { description: post.author!.description }),
        },
    publisher: ref(ORGANIZATION_ID),
    mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
    isPartOf: ref(WEBSITE_ID),
    inLanguage: "en",
    wordCount: post.wordCount,
    ...(post.section && { articleSection: post.section }),
  };
}

export function blogCollection(
  page: { url: string; name: string; description: string },
  posts: { url: string; name: string }[]
): JsonLdNode {
  return {
    "@type": "CollectionPage",
    "@id": `${page.url}#page`,
    url: page.url,
    name: page.name,
    description: page.description,
    isPartOf: ref(WEBSITE_ID),
    publisher: ref(ORGANIZATION_ID),
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: post.url,
        name: post.name,
      })),
    },
  };
}

/** Words in a post's visible text, for BlogPosting.wordCount. */
export function countWords(html: string): number {
  const text = html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}
