// Facts about the business, used by the visible pages and by the
// structured data (JSON-LD), so the two always say the same thing.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";
export const SITE_NAME = "Yoga by Neha";
export const SITE_ALT_NAME = "Yoga For Cure";

export const LOGO = { path: "/logo.webp", width: 500, height: 500 };

export const SOCIAL_LINKS = [
  "https://www.instagram.com/yoga_for_cure/",
  "https://www.youtube.com/@yogaforcurevideos",
];

export const WHATSAPP_NUMBER = "+918310764597";

export const INSTRUCTOR = {
  name: "Neha",
  jobTitle: "Yoga Teacher",
  image: "/instructor.webp",
  description:
    "Indian yoga teacher with over 10 years of experience, teaching live online yoga classes in English for strength, flexibility and wellbeing.",
  knowsAbout: [
    "Yoga",
    "PCOS and PCOD yoga",
    "Prenatal and postnatal yoga",
    "Pranayama",
    "Corporate wellness",
  ],
  // TODO: add Neha's real certifications, e.g.
  // { name: "200-hour Yoga Teacher Training", issuedBy: "Yoga Alliance" }.
  // Leave empty until they are confirmed; nothing is published while it is empty.
  credentials: [] as { name: string; issuedBy?: string }[],
};

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type ClassTime = {
  /** 24-hour IST, e.g. "07:00". */
  start: string;
  end: string;
  /** How the time is shown on the page. */
  label: string;
};

export const CLASS_TIMES: ClassTime[] = [
  { start: "07:00", end: "08:00", label: "7:00 – 8:00 AM" },
  { start: "19:00", end: "20:00", label: "7:00 – 8:00 PM" },
];

export const WEEKLY_SESSIONS: { day: Weekday; focus: string }[] = [
  { day: "Monday", focus: "Strength & Power Yoga" },
  { day: "Wednesday", focus: "Flexibility & Balance Yoga" },
  { day: "Friday", focus: "Core Activation & Flow" },
];

export const CLASS_TIMEZONE = "Asia/Kolkata";

/** "7:00 – 8:00 AM and 7:00 – 8:00 PM IST" */
export const CLASS_TIMES_TEXT = `${CLASS_TIMES.map((t) => t.label).join(" and ")} IST`;

// Plan prices appear only in the Course structured data, by the owner's choice
// (the pricing section was removed from the page on 2026-11-08).
export const PLANS = [
  { name: "Monthly Plan", price: 1500 },
  { name: "3 Months Plan", price: 3000 },
  { name: "6 Months Plan", price: 5500 },
  { name: "1 Year Plan", price: 10000 },
];

export const GROUP_COURSE = {
  name: "Online Group Yoga Classes with Neha",
  description: `Live online yoga group classes in English covering strength, flexibility, balance and core activation. Three days a week (Monday, Wednesday and Friday), ${CLASS_TIMES_TEXT}.`,
};

/** Shown on the homepage and used for its FAQPage data. */
export const HOME_FAQ: { question: string; answer: string }[] = [
  {
    question: "How do I start online yoga classes with Neha?",
    answer: `Choose a plan that suits you (Monthly, 3 Months, 6 Months or 1 Year) and message us on WhatsApp. You'll get a link to join the live sessions every Monday, Wednesday and Friday, ${CLASS_TIMES_TEXT}.`,
  },
  {
    question: "What equipment do I need for online yoga at home?",
    answer:
      "All you need is a yoga mat, comfortable clothing and a device with a stable internet connection. No special equipment is needed to start.",
  },
  {
    question: "Are these yoga classes suitable for beginners?",
    answer:
      "Yes. Neha's classes welcome all levels, from complete beginners to experienced practitioners. Each session allows modifications so everyone can take part comfortably.",
  },
  {
    question: "How often are the live yoga classes held?",
    answer: `Live group sessions run three days a week: Monday (Strength & Power Yoga), Wednesday (Flexibility & Balance Yoga) and Friday (Core Activation & Flow). Each day has two batches, ${CLASS_TIMES_TEXT}.`,
  },
  {
    question: "Can I join the yoga classes from outside India?",
    answer:
      "Yes. Classes are taught online in English and are open to students worldwide. Over 3,200 students from across the globe have already joined.",
  },
];
