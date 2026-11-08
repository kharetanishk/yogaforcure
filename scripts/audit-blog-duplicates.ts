/**
 * Read-only report of blog problems, made from a saved copy of /api/blogs.
 * Run: npx tsx scripts/audit-blog-duplicates.ts backups/posts-YYYY-MM-DD.json
 */
import { readFileSync } from "node:fs";
import { blogRedirects } from "../lib/redirects";
import { looksLikeFileName, looksLikeSlug, normalizeTitle } from "../lib/blogRules";

type ExportedPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  images: { publicId: string }[];
};

const MAX_SLUG_LENGTH = 75;
const TIMESTAMP_SLUG = /-\d{10,}$/;

function wordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function baseSlug(slug: string): string {
  return slug.replace(TIMESTAMP_SLUG, "");
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx scripts/audit-blog-duplicates.ts <posts.json>");
  process.exit(1);
}

const posts = JSON.parse(
  readFileSync(file, "utf8").replace(/^﻿/, "")
) as ExportedPost[];
if (!Array.isArray(posts)) {
  console.error("This file is not a list of posts. Were you logged in when you saved it?");
  process.exit(1);
}

const countBy = (key: (post: ExportedPost) => string) => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(key(post), (counts.get(key(post)) ?? 0) + 1);
  }
  return counts;
};
const titleCounts = countBy((post) => normalizeTitle(post.title));
const slugCounts = countBy((post) => baseSlug(post.slug));

const flagsFor = (post: ExportedPost): string[] => {
  const flags: string[] = [];
  if (TIMESTAMP_SLUG.test(post.slug)) flags.push("timestamp-url");
  if (
    (titleCounts.get(normalizeTitle(post.title)) ?? 0) > 1 ||
    (slugCounts.get(baseSlug(post.slug)) ?? 0) > 1
  ) {
    flags.push("duplicate");
  }
  if (looksLikeFileName(post.title)) flags.push("filename-title");
  if (looksLikeSlug(post.title)) flags.push("slug-title");
  if (post.slug.length > MAX_SLUG_LENGTH) flags.push("long-url");
  return flags;
};

console.log("| URL | Title | Live | Published | Updated | Words | Problems |");
console.log("|---|---|---|---|---|---:|---|");
for (const post of [...posts].sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(
    `| ${post.slug} | ${post.title.replace(/\|/g, "/")} | ${post.published ? "yes" : "no"} | ` +
      `${post.createdAt.slice(0, 10)} | ${post.updatedAt.slice(0, 10)} | ` +
      `${wordCount(post.content)} | ${flagsFor(post).join(", ") || "-"} |`
  );
}

// The app's delete also removes a post's images from Cloudinary, so any image
// used by two posts must be handled with care during a merge.
const imageOwners = new Map<string, string[]>();
for (const post of posts) {
  for (const image of post.images ?? []) {
    imageOwners.set(image.publicId, [...(imageOwners.get(image.publicId) ?? []), post.slug]);
  }
}
const sharedImages = [...imageOwners].filter(([, owners]) => owners.length > 1);

const slugs = new Set(posts.map((post) => post.slug));
const brokenRedirects = blogRedirects.filter(({ to }) => !slugs.has(to));

console.log(`\nPosts: ${posts.length}`);
console.log(`With problems: ${posts.filter((post) => flagsFor(post).length > 0).length}`);
console.log(`Images shared between posts: ${sharedImages.length}`);
for (const [publicId, owners] of sharedImages) {
  console.log(`  ${publicId}: ${owners.join(", ")}`);
}
console.log(`Redirects pointing at a missing post: ${brokenRedirects.length}`);
for (const { from, to } of brokenRedirects) console.log(`  ${from} -> ${to}`);
