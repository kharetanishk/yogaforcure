/**
 * Checks the structured data (JSON-LD) on a few pages and prints a pass/fail table.
 *
 *   npx tsx scripts/validate-schema.ts                         # local build on :3000
 *   npx tsx scripts/validate-schema.ts https://yogaforcure.in
 *   npx tsx scripts/validate-schema.ts http://localhost:3000 /blog/some-post
 *
 * In Git Bash, prefix with MSYS_NO_PATHCONV=1 so "/" paths aren't rewritten.
 */

type JsonNode = Record<string, unknown> & { "@type"?: string | string[]; "@id"?: string };

const DEFAULT_PATHS = [
  "/",
  "/blog",
  "/gallery",
  "/blog/yoga-for-lower-back-pain-from-sitting-all-day",
  "/blog/yoga-thyroid-patients-gentle-daily-guide",
];

// Fields each type must have. Dotted paths check one level down.
const REQUIRED: Record<string, string[]> = {
  Organization: ["name", "url", "logo"],
  WebSite: ["name", "url"],
  Person: ["name"],
  BlogPosting: ["headline", "author", "datePublished", "dateModified", "image", "publisher"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  Course: ["name", "description", "provider", "offers", "hasCourseInstance"],
  CollectionPage: ["name", "mainEntity"],
};

// Google ignores self-serving reviews and flags Events without dates.
const NOT_ALLOWED = ["Review", "AggregateRating", "Event"];

function typesOf(node: JsonNode): string[] {
  const t = node["@type"];
  return Array.isArray(t) ? t : t ? [t] : [];
}

/** Every object with an @type, including nested ones. */
function collect(value: unknown, out: JsonNode[] = []): JsonNode[] {
  if (Array.isArray(value)) value.forEach((v) => collect(v, out));
  else if (value && typeof value === "object") {
    const node = value as JsonNode;
    if (node["@type"]) out.push(node);
    Object.values(node).forEach((v) => collect(v, out));
  }
  return out;
}

/** Objects that only point at another entity: { "@id": "..." }. */
function references(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => references(v, out));
  else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    const id = (value as JsonNode)["@id"];
    if (keys.length === 1 && typeof id === "string") out.push(id);
    else Object.values(value).forEach((v) => references(v, out));
  }
  return out;
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function checkNode(node: JsonNode): string[] {
  const problems: string[] = [];
  for (const type of typesOf(node)) {
    if (NOT_ALLOWED.includes(type)) problems.push(`${type} should not be used`);
    for (const field of REQUIRED[type] ?? []) {
      if (isEmpty(node[field])) problems.push(`${type} missing ${field}`);
    }
    if (type === "FAQPage") {
      const questions = (node.mainEntity as JsonNode[] | undefined) ?? [];
      questions.forEach((q, i) => {
        const answer = q.acceptedAnswer as JsonNode | undefined;
        if (isEmpty(q.name) || isEmpty(answer?.text)) problems.push(`FAQ question ${i + 1} incomplete`);
      });
    }
    if (type === "Course") {
      const instances = (node.hasCourseInstance as JsonNode[] | undefined) ?? [];
      instances.forEach((c, i) => {
        if (isEmpty(c.courseMode) || isEmpty(c.courseSchedule)) problems.push(`CourseInstance ${i + 1} missing mode or schedule`);
      });
    }
  }
  return problems;
}

async function checkPage(base: string, path: string) {
  const res = await fetch(base + path, { redirect: "manual" });
  const html = await res.text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

  const problems: string[] = [];
  if (res.status !== 200) problems.push(`status ${res.status}`);

  const docs: unknown[] = [];
  blocks.forEach((block, i) => {
    try {
      docs.push(JSON.parse(block));
    } catch {
      problems.push(`block ${i + 1} is not valid JSON`);
    }
  });

  const nodes = collect(docs);
  for (const node of nodes) problems.push(...checkNode(node));

  const ids = new Set(nodes.map((n) => n["@id"]).filter(Boolean));
  for (const id of new Set(references(docs))) {
    if (!ids.has(id)) problems.push(`reference to missing ${id}`);
  }

  const topTypes = docs
    .flatMap((d) => ((d as { "@graph"?: JsonNode[] })["@graph"] ?? [d as JsonNode]))
    .flatMap((n) => typesOf(n));
  const faq = nodes.find((n) => typesOf(n).includes("FAQPage"));
  const faqCount = faq ? (faq.mainEntity as unknown[]).length : 0;

  return { path, blocks: blocks.length, types: topTypes, faqCount, problems };
}

async function main() {
  const [baseArg, ...pathArgs] = process.argv.slice(2);
  const base = (baseArg ?? "http://localhost:3000").replace(/\/$/, "");
  const paths = pathArgs.length ? pathArgs : DEFAULT_PATHS;

  let failed = 0;
  console.log("result | path | types (FAQ questions)");
  for (const path of paths) {
    const page = await checkPage(base, path);
    const ok = page.problems.length === 0;
    if (!ok) failed++;
    const faq = page.faqCount ? ` (FAQ ${page.faqCount})` : "";
    console.log(`${ok ? "PASS" : "FAIL"} | ${path} | ${page.types.join(", ")}${faq}`);
    for (const problem of page.problems) console.log(`       ! ${problem}`);
  }
  console.log(failed ? `\n${failed} page(s) failed.` : `\nAll ${paths.length} pages passed.`);
  process.exitCode = failed ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

export {};
