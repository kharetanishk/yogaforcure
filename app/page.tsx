import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

export const metadata: Metadata = {
  title: "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility",
  description:
    "Learn with an experienced Indian yoga teacher online. Live classes in English for strength, flexibility, and lasting wellbeing. Join from anywhere.",
  alternates: {
    canonical: baseUrl + "/",
  },
  openGraph: {
    title: "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility",
    description:
      "Learn with an experienced Indian yoga teacher online. Live classes in English for strength, flexibility, and lasting wellbeing. Join from anywhere.",
    url: baseUrl + "/",
    siteName: "Yoga by Neha",
    type: "website",
    images: [
      {
        url: baseUrl + "/hero-section.webp",
        width: 1200,
        height: 630,
        alt: "Yoga by Neha — Online Indian Yoga Teacher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility",
    description:
      "Learn with an experienced Indian yoga teacher online. Live classes in English for strength, flexibility, and lasting wellbeing. Join from anywhere.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Neha",
  jobTitle: "Yoga Instructor",
  description:
    "Indian yoga teacher offering live online yoga classes in English for strength, flexibility, and wellbeing.",
  sameAs: [
    "https://www.instagram.com/yoga_for_cure/",
    "https://youtube.com/@yogaforcurevideos",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yoga by Neha",
  url: baseUrl + "/",
  founder: {
    "@type": "Person",
    name: "Neha",
    jobTitle: "Yoga Instructor",
  },
  areaServed: {
    "@type": "Place",
    name: "Global",
    description: "Online yoga classes worldwide",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yoga by Neha",
  alternateName: "Yoga for Cure",
  url: baseUrl + "/",
  description:
    "Online yoga classes with an experienced Indian yoga teacher. Live group sessions, 1-on-1, and corporate wellness in English.",
  publisher: {
    "@type": "Organization",
    name: "Yoga by Neha",
    url: baseUrl + "/",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Yoga by Neha",
  alternateName: "Yoga for Cure",
  url: baseUrl + "/",
  description:
    "Online yoga classes with an experienced Indian yoga teacher. Live group sessions, 1-on-1, and corporate wellness in English.",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "19:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "19:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "19:00", closes: "20:00" },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/yoga_for_cure/",
    "https://youtube.com/@yogaforcurevideos",
  ],
  founder: { "@type": "Person", name: "Neha" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I start online yoga classes with Neha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply choose a plan that suits you — Monthly, 3 Months, 6 Months, or 1 Year — and message us on WhatsApp. You'll receive a link to join live sessions every Monday, Wednesday, and Friday at 7:00–8:00 PM IST.",
      },
    },
    {
      "@type": "Question",
      name: "What equipment do I need for online yoga at home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All you need is a yoga mat, comfortable clothing, and a device with a stable internet connection. No special equipment is required to start.",
      },
    },
    {
      "@type": "Question",
      name: "Are these yoga classes suitable for beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Neha's classes welcome all levels — from complete beginners to experienced practitioners. Each session is structured to allow modifications so everyone can participate comfortably.",
      },
    },
    {
      "@type": "Question",
      name: "How often are the live yoga classes held?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Live group sessions are held three times a week — Monday (Strength & Power Yoga), Wednesday (Flexibility & Balance Yoga), and Friday (Core Activation & Flow) from 7:00–8:00 PM IST.",
      },
    },
    {
      "@type": "Question",
      name: "What is the cost of joining Yoga by Neha online classes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Group class plans start at ₹1,500 per month, ₹3,000 for 3 months, ₹5,500 for 6 months, and ₹10,000 for a full year. 1-on-1 and corporate wellness packages are also available.",
      },
    },
    {
      "@type": "Question",
      name: "Can I join the yoga classes from outside India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Classes are conducted online in English and are open to students worldwide. Over 3,200 students from across the globe have already joined.",
      },
    },
  ],
};

const weeklyEventSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Monday Strength & Power Yoga — Live Online Class",
    description: "Weekly live online yoga class focusing on strength and power yoga with Neha.",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: baseUrl + "/#weekly-live-sessions",
    },
    organizer: { "@type": "Organization", name: "Yoga by Neha", url: baseUrl + "/" },
    performer: { "@type": "Person", name: "Neha" },
    eventSchedule: {
      "@type": "Schedule",
      byDay: "https://schema.org/Monday",
      startTime: "19:00",
      endTime: "20:00",
      scheduleTimezone: "Asia/Kolkata",
      repeatFrequency: "P1W",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Wednesday Flexibility & Balance Yoga — Live Online Class",
    description: "Weekly live online yoga class focusing on flexibility and balance with Neha.",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: baseUrl + "/#weekly-live-sessions",
    },
    organizer: { "@type": "Organization", name: "Yoga by Neha", url: baseUrl + "/" },
    performer: { "@type": "Person", name: "Neha" },
    eventSchedule: {
      "@type": "Schedule",
      byDay: "https://schema.org/Wednesday",
      startTime: "19:00",
      endTime: "20:00",
      scheduleTimezone: "Asia/Kolkata",
      repeatFrequency: "P1W",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Friday Core Activation & Flow Yoga — Live Online Class",
    description: "Weekly live online yoga class focusing on core activation and flow with Neha.",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: baseUrl + "/#weekly-live-sessions",
    },
    organizer: { "@type": "Organization", name: "Yoga by Neha", url: baseUrl + "/" },
    performer: { "@type": "Person", name: "Neha" },
    eventSchedule: {
      "@type": "Schedule",
      byDay: "https://schema.org/Friday",
      startTime: "19:00",
      endTime: "20:00",
      scheduleTimezone: "Asia/Kolkata",
      repeatFrequency: "P1W",
    },
  },
];

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Online Group Yoga Classes with Neha",
  description:
    "Live online yoga group classes in English covering strength, flexibility, balance, and core activation. Three sessions per week — Monday, Wednesday, and Friday at 7:00–8:00 PM IST.",
  provider: {
    "@type": "Organization",
    name: "Yoga by Neha",
    sameAs: baseUrl + "/",
  },
  instructor: { "@type": "Person", name: "Neha", jobTitle: "Yoga Instructor" },
  courseMode: "online",
  availableLanguage: "English",
  offers: [
    {
      "@type": "Offer",
      name: "Monthly Plan",
      price: "1500",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2025-01-01",
    },
    {
      "@type": "Offer",
      name: "3 Months Plan",
      price: "3000",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2025-01-01",
    },
    {
      "@type": "Offer",
      name: "6 Months Plan",
      price: "5500",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2025-01-01",
    },
    {
      "@type": "Offer",
      name: "1 Year Plan",
      price: "10000",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2025-01-01",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {weeklyEventSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <HomeClient />
    </>
  );
}
