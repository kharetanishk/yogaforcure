import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

export const metadata: Metadata = {
  title: "Gallery — Yoga by Neha | Yoga for Cure",
  description:
    "Browse photos and videos from Yoga by Neha's live online yoga classes — moments of strength, flexibility, and community from students worldwide.",
  alternates: { canonical: baseUrl + "/gallery" },
  openGraph: {
    title: "Gallery — Yoga by Neha | Yoga for Cure",
    description:
      "Browse photos and videos from Yoga by Neha's live online yoga classes — moments of strength, flexibility, and community from students worldwide.",
    url: baseUrl + "/gallery",
    siteName: "Yoga by Neha",
    type: "website",
    images: [
      {
        url: baseUrl + "/photos/photo-1.webp",
        width: 1200,
        height: 630,
        alt: "Yoga by Neha — Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Yoga by Neha | Yoga for Cure",
    description:
      "Browse photos and videos from Yoga by Neha's live online yoga classes.",
    images: [baseUrl + "/photos/photo-1.webp"],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
