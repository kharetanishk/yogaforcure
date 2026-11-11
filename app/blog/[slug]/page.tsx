import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import BlogImageCollage from "@/components/blog/BlogImageCollage";
import { prisma } from "@/lib/prisma";
import { parseDoc } from "@/lib/blogBuilder";
import { SITE_NAME, cleanText, looksLikeSlug, pageDescription, pageTitle } from "@/lib/seo";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!blog) return { title: "Not found", robots: { index: false, follow: false } };

  const stored = blog.metaTitle && !looksLikeSlug(blog.metaTitle) ? blog.metaTitle : blog.title;
  const title = pageTitle(stored);
  const description = pageDescription(blog.metaDescription || blog.excerpt);
  const cover = blog.images[0];
  const url = `${baseUrl}/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      authors: [parseDoc(blog.content)?.meta.authorName.trim() || "Neha"],
      ...(cover && { images: [{ url: cover.url, alt: cover.alt || pageTitle(blog.title) }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(cover && { images: [cover.url] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!blog) notFound();

  const builder = parseDoc(blog.content)?.meta;
  const authorName = builder?.authorName.trim() || "Neha";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: cleanText(blog.excerpt),
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
      ...(builder?.authorTagline.trim()
        ? { description: builder.authorTagline.trim() }
        : { jobTitle: "Yoga Instructor" }),
    },
    publisher: {
      "@type": "Organization",
      name: "Yoga by Neha",
      url: baseUrl,
    },
    mainEntityOfPage: `${baseUrl}/blog/${slug}`,
    ...(blog.images[0] && { image: blog.images.map((img) => img.url) }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl + "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${baseUrl}/blog/${slug}`,
      },
    ],
  };

  const formattedDate = blog.updatedAt.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FloatingNavbar />

      <main className="min-h-screen overflow-x-hidden">
        {/* ── Hero ── */}
        <div className="blog-post-hero">
          <div className="blog-post-hero-inner">
            <div className="blog-hero-chip">
              {builder
                ? [builder.category, builder.date || formattedDate, builder.readTime]
                    .filter((part) => part.trim())
                    .join("  ·  ")
                : <>Article &nbsp;·&nbsp; {formattedDate}</>}
            </div>
            <h1 className="blog-post-h1">{blog.title}</h1>
            <p className="blog-post-sub">{blog.excerpt}</p>
            <div className="blog-post-hero-bottom">
              <div className="blog-author-row">
                <div className="blog-av">{authorName[0].toUpperCase()}</div>
                <div>
                  <div className="blog-av-name">
                    {builder ? authorName : "Neha — Yoga For Cure"}
                  </div>
                  <div className="blog-av-role">
                    {builder
                      ? builder.authorTagline
                      : <>10+ years teaching&nbsp;·&nbsp;3,200+ students worldwide</>}
                  </div>
                </div>
              </div>
              <div className="blog-hero-meta">
                <span>{builder?.date.trim() || formattedDate}</span>
                <span>Yoga For Cure</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="blog-stats-bar">
          <div className="blog-stat">
            <span className="bst-n">3,32,000</span>
            <span className="bst-l">YouTube Subscribers</span>
          </div>
          <div className="blog-stat">
            <span className="bst-n">15,200+</span>
            <span className="bst-l">Instagram Followers</span>
          </div>
          <div className="blog-stat">
            <span className="bst-n">3,200+</span>
            <span className="bst-l">Students Worldwide</span>
          </div>
          <div className="blog-stat">
            <span className="bst-n">10+ Yrs</span>
            <span className="bst-l">Teaching Experience</span>
          </div>
        </div>

        {/* ── Article body ── */}
        <div className="blog-post-body">
          <div className="blog-post-container">
            <nav className="blog-breadcrumb">
              <Link href="/">Home</Link>
              {" · "}
              <Link href="/blog">Blog</Link>
            </nav>

            {blog.images.length > 0 && (
              <div className="mb-10">
                <BlogImageCollage
                  images={blog.images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    alt: img.alt || blog.title,
                  }))}
                />
              </div>
            )}

            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <footer className="blog-post-footer">
              <Link href="/blog" className="blog-back-link">
                ← Back to all articles
              </Link>
            </footer>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
