import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import BlogImageCollage from "@/components/blog/BlogImageCollage";
import { prisma } from "@/lib/prisma";
import { parseDoc } from "@/lib/blogBuilder";
import { SITE_NAME, looksLikeSlug, pageDescription, pageTitle } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { extractFaq } from "@/lib/faq";
import { blogPosting, breadcrumb, countWords, faqPage, graph } from "@/lib/schema";

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

  const url = `${baseUrl}/blog/${slug}`;
  // The FAQ is read from the post's own text, so it always matches what readers see.
  const faq = extractFaq(blog.content);
  const postSchema = graph(
    blogPosting({
      url,
      headline: pageTitle(blog.title),
      description: pageDescription(blog.metaDescription || blog.excerpt),
      images: blog.images.map((img) => img.url),
      datePublished: blog.createdAt,
      dateModified: blog.updatedAt,
      wordCount: countWords(blog.content),
      section: builder?.category.trim() || undefined,
      author: {
        name: authorName,
        description: builder?.authorTagline.trim() || undefined,
      },
    }),
    breadcrumb([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: pageTitle(blog.title), path: `/blog/${slug}` },
    ]),
    ...(faq.length > 0 ? [faqPage(faq, url)] : [])
  );

  const formattedDate = blog.updatedAt.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd data={postSchema} />
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
