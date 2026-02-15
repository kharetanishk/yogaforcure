import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

export const metadata: Metadata = {
  title: "Gallery — Yoga by Neha | Yoga for Cure",
  description:
    "Moments from yoga practice and live classes. Photos and videos from our online yoga sessions.",
  alternates: {
    canonical: baseUrl + "/gallery",
  },
  openGraph: {
    title: "Gallery — Yoga by Neha | Yoga for Cure",
    description:
      "Moments from yoga practice and live classes. Photos and videos from our online yoga sessions.",
    url: baseUrl + "/gallery",
    siteName: "Yoga by Neha",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Yoga by Neha | Yoga for Cure",
    description:
      "Moments from yoga practice and live classes. Photos and videos from our online yoga sessions.",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
