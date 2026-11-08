/** Checks the blog publishing rules. Run: npx tsx scripts/test-blog-rules.ts */
import assert from "node:assert/strict";
import { blogRedirects } from "../lib/redirects";
import {
  containsHtml,
  createSlug,
  findClash,
  normalizeTitle,
  publishProblems,
  titleProblem,
} from "../lib/blogRules";

const longDescription = "x".repeat(150);
const validPost = {
  title: "Yoga vs Gym for Weight Loss: Which Is Actually Better?",
  excerpt: longDescription,
  images: [{ alt: "A woman holding a warrior pose on a mat at home" }],
};

const tests: Record<string, () => void> = {
  "slugs are short, lowercase and have no timestamp": () => {
    const slug = createSlug(
      "The Best Online Yoga Classes Are Not What You Think They Are: Before You Subscribe"
    );
    assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(slug.length <= 60, slug);
    assert.ok(slug.split("-").length <= 6, slug);
    assert.doesNotMatch(slug, /\d{10,}/);
  },
  "slugs remove punctuation and stop-words": () => {
    assert.equal(createSlug("Yoga for PCOD: What's Safe?"), "yoga-pcod-whats-safe");
  },
  "short titles keep their stop-words": () => {
    assert.equal(createSlug("How to Breathe"), "how-to-breathe");
  },
  "a title with no English letters gives an empty slug": () => {
    assert.equal(createSlug("योग"), "");
  },
  "publishing the same topic twice is caught": () => {
    const posts = [{ id: "1", title: "Yoga for Back Pain: A Guide", slug: "old-slug" }];
    assert.equal(findClash(posts, "yoga for back pain - a guide")?.id, "1");
    assert.equal(findClash(posts, "Different title", "old-slug")?.id, "1");
    assert.equal(findClash(posts, "Different title", "new-slug"), undefined);
  },
  "colons and question marks don't affect title matching": () => {
    assert.equal(normalizeTitle("Yoga: Why?"), normalizeTitle("yoga why"));
  },
  "file names and slugs are rejected as titles": () => {
    assert.ok(titleProblem("ChatGPT Image Jun 19, 2026, 10_00_00 AM"));
    assert.ok(titleProblem("Restorative Butterfly Pose in Bloom.png"));
    assert.ok(titleProblem("online-yoga-classes-india-international"));
    assert.equal(titleProblem(validPost.title), null);
  },
  "a complete post can be published": () => {
    assert.deepEqual(publishProblems({ ...validPost, metaTitle: "Yoga vs Gym" }), []);
  },
  "publishing is refused when required fields are weak": () => {
    const problems = publishProblems({
      title: "A".repeat(61),
      excerpt: "Too short",
      images: [],
    });
    assert.equal(problems.length, 3);
  },
  "a cover alt that repeats the title is refused": () => {
    const problems = publishProblems({
      ...validPost,
      metaTitle: "Yoga vs Gym",
      images: [{ alt: validPost.title }],
    });
    assert.equal(problems.length, 1);
  },
  "formatted content is recognised as HTML": () => {
    assert.ok(containsHtml("<h2>Heading</h2><ul><li>One</li></ul>"));
    assert.equal(containsHtml("Plain text with 3 < 5 in it"), false);
  },
  "redirects have one source each and never chain": () => {
    const sources = blogRedirects.map((redirect) => redirect.from);
    assert.equal(new Set(sources).size, sources.length);
    for (const { to } of blogRedirects) assert.ok(!sources.includes(to), to);
  },
};

let failed = 0;
for (const [name, run] of Object.entries(tests)) {
  try {
    run();
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL  ${name}\n      ${error instanceof Error ? error.message : error}`);
  }
}

console.log(`\n${Object.keys(tests).length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
