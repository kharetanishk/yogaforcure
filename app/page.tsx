import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import JsonLd from "@/components/JsonLd";
import { HOME_FAQ } from "@/lib/site";
import { faqPage, graph, groupCourse } from "@/lib/schema";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

export const metadata: Metadata = {
  title: { absolute: "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility" },
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
    images: [baseUrl + "/hero-section.webp"],
  },
};

// Organization, WebSite and Person come from the root layout. The FAQ data matches the
// visible FAQ section (components/HomeFaq.tsx); both read HOME_FAQ.
const homeSchema = graph(groupCourse(), faqPage(HOME_FAQ, baseUrl + "/"));

export default function Home() {
  return (
    <>
      <JsonLd data={homeSchema} />
      <HomeClient />
    </>
  );
}
