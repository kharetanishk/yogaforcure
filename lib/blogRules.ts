/**
 * Publishing rules for blog posts. This file has no framework or database
 * imports so the API routes, the audit script and the tests can all share it.
 */

export type BlogImageInput = {
  url: string;
  publicId: string;
  alt?: string;
};

export type BlogPayload = {
  title?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  published?: boolean;
  images?: BlogImageInput[];
};

export type PublishCheckInput = {
  title: string;
  excerpt: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images: { alt?: string }[];
};

export type ExistingPost = { id: string; title: string; slug: string };

const MAX_SLUG_LENGTH = 60;
const MAX_SLUG_WORDS = 6;
const MIN_KEYWORDS = 3;
const MAX_META_TITLE_LENGTH = 60;
const MIN_META_DESCRIPTION_LENGTH = 140;
const MAX_META_DESCRIPTION_LENGTH = 160;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "does", "for",
  "from", "how", "in", "is", "it", "its", "of", "on", "or", "that", "the",
  "their", "this", "to", "what", "when", "which", "why", "with", "you", "your",
]);

function toAsciiLower(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase();
}

/** Builds a short URL slug. Returns "" when the title has no usable letters. */
export function createSlug(title: string): string {
  const words = toAsciiLower(title)
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  const keywords = words.filter((word) => !STOP_WORDS.has(word));
  const chosen = (keywords.length >= MIN_KEYWORDS ? keywords : words).slice(
    0,
    MAX_SLUG_WORDS
  );

  let slug = "";
  for (const word of chosen) {
    const next = slug ? `${slug}-${word}` : word;
    if (next.length > MAX_SLUG_LENGTH) break;
    slug = next;
  }
  return slug;
}

/** Makes titles comparable by ignoring case, spacing and punctuation. */
export function normalizeTitle(title: string): string {
  return toAsciiLower(title).replace(/[^a-z0-9]+/g, "");
}

/** Finds a post that a new or renamed post would duplicate. */
export function findClash(
  posts: ExistingPost[],
  title: string,
  slug?: string
): ExistingPost | undefined {
  const normalized = normalizeTitle(title);
  return posts.find(
    (post) =>
      normalizeTitle(post.title) === normalized ||
      (slug !== undefined && post.slug === slug)
  );
}

export function looksLikeFileName(title: string): boolean {
  const trimmed = title.trim();
  return (
    /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(trimmed) ||
    /chatgpt image/i.test(trimmed)
  );
}

export function looksLikeSlug(title: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)+$/i.test(title.trim());
}

/** Returns the reason a title is unusable, or null when it is fine. */
export function titleProblem(title: string): string | null {
  if (looksLikeFileName(title)) {
    return "The title looks like an image file name. Please write a real title.";
  }
  if (looksLikeSlug(title)) {
    return "The title looks like a URL. Please write it with normal spaces.";
  }
  return null;
}

/** Lists everything that must be fixed before a post can go live. */
export function publishProblems(post: PublishCheckInput): string[] {
  const problems: string[] = [];
  const title = post.title.trim();

  const badTitle = titleProblem(title);
  if (badTitle) problems.push(badTitle);

  const metaTitle = post.metaTitle?.trim() || title;
  if (metaTitle.length > MAX_META_TITLE_LENGTH) {
    problems.push(
      `Meta title must be ${MAX_META_TITLE_LENGTH} characters or fewer (now ${metaTitle.length}).`
    );
  }

  const description = post.metaDescription?.trim() || post.excerpt.trim();
  if (
    description.length < MIN_META_DESCRIPTION_LENGTH ||
    description.length > MAX_META_DESCRIPTION_LENGTH
  ) {
    problems.push(
      `Meta description must be ${MIN_META_DESCRIPTION_LENGTH}-${MAX_META_DESCRIPTION_LENGTH} characters (now ${description.length}).`
    );
  }

  const cover = post.images[0];
  if (!cover) {
    problems.push("Add at least one image to use as the cover.");
  } else {
    const alt = cover.alt?.trim() ?? "";
    if (!alt || normalizeTitle(alt) === normalizeTitle(title)) {
      problems.push(
        "Describe what the cover image shows in its alt text, rather than repeating the title."
      );
    }
  }

  return problems;
}

/** True when content already contains HTML tags and must be stored unchanged. */
export function containsHtml(content: string): boolean {
  return /<\/?[a-z][^>]*>/i.test(content);
}
