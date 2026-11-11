/**
 * Prints the title, description, canonical and H1 count of a few pages.
 *
 *   npx tsx scripts/check-meta.ts                      # local build on :3000
 *   npx tsx scripts/check-meta.ts https://yogaforcure.in
 *   npx tsx scripts/check-meta.ts http://localhost:3000 /blog/some-post /gallery
 */

const DEFAULT_PATHS = [
  "/",
  "/blog",
  "/gallery",
  "/blog/yoga-for-lower-back-pain-from-sitting-all-day",
  "/blog/yoga-thyroid-patients-gentle-daily-guide",
];

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

function decode(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function first(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  return match ? decode(match[1]) : "";
}

type PageMeta = {
  path: string;
  status: number;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  h1Count: number;
};

async function check(base: string, path: string): Promise<PageMeta> {
  const res = await fetch(base + path, { redirect: "manual" });
  const html = await res.text();
  return {
    path,
    status: res.status,
    title: first(html, /<title>([^<]*)<\/title>/),
    description: first(html, /<meta name="description" content="([^"]*)"/),
    canonical: first(html, /<link rel="canonical" href="([^"]*)"/),
    robots: first(html, /<meta name="robots" content="([^"]*)"/),
    h1Count: (html.match(/<h1[\s>]/g) ?? []).length,
  };
}

function warnings(page: PageMeta, base: string): string[] {
  const out: string[] = [];
  // The brand suffix " | Yoga by Neha" doesn't count against the topic length.
  const topic = page.title.replace(/ \| Yoga by Neha$/, "");
  if (page.status !== 200) out.push(`status ${page.status}`);
  // 404s and admin pages are noindex, so search snippets don't matter there.
  if (page.robots.includes("noindex")) return out;
  // The homepage title is deliberately the full brand line.
  const isHome = new URL(page.path, base).pathname === "/";
  if (!page.title) out.push("no title");
  if (!isHome && topic.length > TITLE_MAX) out.push(`title ${topic.length} chars before the brand (max ${TITLE_MAX})`);
  if (/yoga for cure/i.test(page.title)) out.push("title still has 'Yoga For Cure'");
  if (!page.description) out.push("no description");
  if (page.description.length > DESCRIPTION_MAX) out.push(`description ${page.description.length} chars (max ${DESCRIPTION_MAX})`);
  if (!page.canonical) out.push("no canonical");
  if (page.canonical.includes("://www.")) out.push("canonical points at www");
  if (page.canonical && new URL(page.canonical).pathname !== new URL(page.path, base).pathname) {
    out.push("canonical is a different page");
  }
  if (page.h1Count !== 1) out.push(`${page.h1Count} H1 tags`);
  return out;
}

async function main() {
  const [baseArg, ...pathArgs] = process.argv.slice(2);
  const base = (baseArg ?? "http://localhost:3000").replace(/\/$/, "");
  const paths = pathArgs.length ? pathArgs : DEFAULT_PATHS;

  let problems = 0;
  for (const path of paths) {
    const page = await check(base, path);
    const issues = warnings(page, base);
    problems += issues.length;
    console.log(`\n${path}  [${page.status}]`);
    console.log(`  title       (${page.title.length}) ${page.title}`);
    console.log(`  description (${page.description.length}) ${page.description}`);
    console.log(`  canonical   ${page.canonical}`);
    console.log(`  robots      ${page.robots || "(none)"}`);
    console.log(`  H1 count    ${page.h1Count}`);
    for (const issue of issues) console.log(`  ! ${issue}`);
  }
  console.log(problems ? `\n${problems} problem(s) found.` : "\nAll pages look fine.");
  process.exitCode = problems ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

export {};
