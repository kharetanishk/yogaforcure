import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

const galleryTitle = "Class Photos and Videos";
const galleryDescription =
  "Browse photos and videos from Yoga by Neha's live online yoga classes — moments of strength, flexibility, and community from students worldwide.";

export const metadata: Metadata = {
  title: galleryTitle,
  description: galleryDescription,
  alternates: { canonical: baseUrl + "/gallery" },
  openGraph: {
    title: `${galleryTitle} | Yoga by Neha`,
    description: galleryDescription,
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
    title: `${galleryTitle} | Yoga by Neha`,
    description: galleryDescription,
    images: [baseUrl + "/photos/photo-1.webp"],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
