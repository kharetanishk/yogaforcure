export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";
export const SITE_NAME = "Yoga by Neha";

export const DESCRIPTION_MAX = 160;

/** Collapses line breaks, tabs and repeated spaces into single spaces. */
export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

// Brand names that older posts stored at the end of their titles,
// e.g. "Yoga for Menopause | Yoga For Cure". The title template adds the brand back once.
const BRAND_SUFFIX = /\s*[|—–-]\s*(?:yoga\s+for\s+cure|yoga\s+by\s+neha)\s*$/i;

/** A post or page title without any stored brand suffix. */
export function pageTitle(raw: string): string {
  let title = cleanText(raw);
  while (BRAND_SUFFIX.test(title)) {
    title = title.replace(BRAND_SUFFIX, "");
  }
  return title;
}

/** True when a title still reads like a URL slug ("yoga-for-thyroid-patients"). */
export function looksLikeSlug(title: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(title.trim());
}

/**
 * A description that fits in search results. Text over the limit is cut at
 * the last whole word and ends with an ellipsis.
 */
export function pageDescription(raw: string, max: number = DESCRIPTION_MAX): string {
  const text = cleanText(raw);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.—–-]+$/, "");
  return `${trimmed}…`;
}
