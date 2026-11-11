import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const defaultTitle = "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility";
const defaultDescription =
  "Learn with an experienced Indian yoga teacher online. Live classes in English for strength, flexibility, and lasting wellbeing. Join from anywhere.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultTitle, template: `%s | ${SITE_NAME}` },
  description: defaultDescription,
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/hero-section.webp", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/hero-section.webp"],
  },
  icons: {
    icon: [
      { url: "/logo.webp", type: "image/webp" },
    ],
    apple: { url: "/logo.webp", type: "image/webp" },
    shortcut: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/gallery_yoga/yogachar.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
