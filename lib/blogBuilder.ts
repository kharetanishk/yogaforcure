/**
 * Blog Builder: block types, HTML rendering and the save format.
 *
 * A builder post is stored in Blog.content as HTML that starts with a hidden
 * comment holding the builder's own data, so the post can reopen in the
 * builder later. No framework imports, so the server page and the client
 * editor both share it.
 */

import { getWhatsAppUrl } from "./whatsapp";

export type HeadingBlock ={ type: "heading"; text: string; level: 2 | 3 };
export type ParagraphBlock = { type: "paragraph"; text: string };
export type ListBlock = { type: "list"; ordered: boolean; items: string };
export type StatStripBlock = {
  type: "statStrip";
  stats: { value: string; label: string }[];
};
export type BigStatBlock = {
  type: "bigStat";
  value: string;
  label: string;
  source: string;
};
export type ComparisonBlock = {
  type: "comparison";
  leftTitle: string;
  leftItems: string;
  rightTitle: string;
  rightItems: string;
};
export type LocalSearchBlock = {
  type: "localSearch";
  query: string;
  location: string;
  note: string;
};
export type PullQuoteBlock = { type: "pullQuote"; quote: string; cite: string };
export type CtaBlock = {
  type: "cta";
  heading: string;
  text: string;
  buttonLabel: string;
  buttonUrl: string;
};

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | StatStripBlock
  | BigStatBlock
  | ComparisonBlock
  | LocalSearchBlock
  | PullQuoteBlock
  | CtaBlock;

export type BlockType = Block["type"];

export type BuilderMeta = {
  category: string;
  date: string;
  readTime: string;
  authorName: string;
  authorTagline: string;
  showToc: boolean;
};

export type BuilderDoc = {
  version: 1;
  meta: BuilderMeta;
  blocks: Block[];
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  list: "List",
  statStrip: "Stat strip",
  bigStat: "Big stat",
  comparison: "Comparison",
  localSearch: "Local search",
  pullQuote: "Pull quote",
  cta: "Call to action",
};

export function newBlock(type: BlockType): Block {
  switch (type) {
    case "heading":
      return { type, text: "", level: 2 };
    case "paragraph":
      return { type, text: "" };
    case "list":
      return { type, ordered: false, items: "" };
    case "statStrip":
      return {
        type,
        stats: [
          { value: "", label: "" },
          { value: "", label: "" },
          { value: "", label: "" },
        ],
      };
    case "bigStat":
      return { type, value: "", label: "", source: "" };
    case "comparison":
      return {
        type,
        leftTitle: "Without yoga",
        leftItems: "",
        rightTitle: "With regular yoga",
        rightItems: "",
      };
    case "localSearch":
      return { type, query: "", location: "", note: "" };
    case "pullQuote":
      return { type, quote: "", cite: "" };
    case "cta":
      return {
        type,
        heading: "Ready to start your practice?",
        text: "Join a live online class with Neha and practise from home.",
        buttonLabel: "Message Neha on WhatsApp",
        buttonUrl: getWhatsAppUrl(),
      };
  }
}

export function defaultMeta(): BuilderMeta {
  return {
    category: "Guide",
    date: formatDisplayDate(new Date()),
    readTime: "5 min read",
    authorName: "Neha",
    authorTagline: "Yoga Instructor, Yoga For Cure",
    showToc: true,
  };
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Escaping and inline formatting ── */

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Allows site paths, anchors, http(s), mailto, tel and WhatsApp links only. */
export function safeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (/^[/#]/.test(trimmed)) return trimmed;
  if (/^(www\.|wa\.me\/)/i.test(trimmed)) return `https://${trimmed}`;
  return "#";
}

/**
 * Escapes text, then applies **bold**, *italic* and [label](url).
 * Escaping first means a writer can never inject raw HTML.
 */
export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => {
      const href = safeUrl(url.replace(/&amp;/g, "&"));
      const external = /^https?:/i.test(href);
      return `<a href="${escapeHtml(href)}"${
        external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

function lines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);
}

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section"
  );
}

/** h2 headings with unique ids, in order. Used for ids and the guide list. */
export function headingAnchors(blocks: Block[]): Map<number, string> {
  const ids = new Map<number, string>();
  const used = new Set<string>();
  blocks.forEach((block, index) => {
    if (block.type !== "heading" || !block.text.trim()) return;
    const base = slugifyHeading(block.text);
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    ids.set(index, id);
  });
  return ids;
}

function tocHeadings(blocks: Block[]): { id: string; text: string }[] {
  const anchors = headingAnchors(blocks);
  return blocks.flatMap((block, index) =>
    block.type === "heading" && block.level === 2 && anchors.has(index)
      ? [{ id: anchors.get(index)!, text: block.text.trim() }]
      : []
  );
}

/* ── Rendering ── */

function renderBlock(block: Block, anchorId?: string): string {
  switch (block.type) {
    case "heading": {
      if (!block.text.trim()) return "";
      const tag = block.level === 3 ? "h3" : "h2";
      return `<${tag} id="${anchorId}">${inline(block.text.trim())}</${tag}>`;
    }
    case "paragraph":
      return block.text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${inline(p).replace(/\n/g, "<br />")}</p>`)
        .join("\n");
    case "list": {
      const items = lines(block.items);
      if (!items.length) return "";
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${items.map((i) => `<li>${inline(i)}</li>`).join("")}</${tag}>`;
    }
    case "statStrip": {
      const stats = block.stats.filter((s) => s.value.trim() || s.label.trim());
      if (!stats.length) return "";
      return `<div class="bb-stat-strip">${stats
        .map(
          (s) =>
            `<div class="bb-stat"><span class="bb-stat-n">${escapeHtml(
              s.value.trim()
            )}</span><span class="bb-stat-l">${escapeHtml(s.label.trim())}</span></div>`
        )
        .join("")}</div>`;
    }
    case "bigStat":
      if (!block.value.trim()) return "";
      return `<figure class="bb-big-stat"><span class="bb-big-n">${escapeHtml(
        block.value.trim()
      )}</span>${
        block.label.trim() ? `<p class="bb-big-l">${inline(block.label.trim())}</p>` : ""
      }${
        block.source.trim()
          ? `<figcaption class="bb-big-src">Source: ${inline(block.source.trim())}</figcaption>`
          : ""
      }</figure>`;
    case "comparison": {
      const left = lines(block.leftItems);
      const right = lines(block.rightItems);
      if (!left.length && !right.length) return "";
      const col = (title: string, items: string[], cls: string) =>
        `<div class="bb-compare-col ${cls}"><p class="bb-compare-title">${escapeHtml(
          title.trim()
        )}</p><ul>${items.map((i) => `<li>${inline(i)}</li>`).join("")}</ul></div>`;
      return `<div class="bb-compare">${col(block.leftTitle, left, "bb-compare-a")}${col(
        block.rightTitle,
        right,
        "bb-compare-b"
      )}</div>`;
    }
    case "localSearch": {
      if (!block.query.trim()) return "";
      const query = [block.query.trim(), block.location.trim()]
        .filter(Boolean)
        .join(" ");
      return `<div class="bb-search"><div class="bb-search-bar"><span class="bb-search-icon" aria-hidden="true">&#9906;</span><span class="bb-search-q">${escapeHtml(
        query
      )}</span></div>${
        block.note.trim() ? `<p class="bb-search-note">${inline(block.note.trim())}</p>` : ""
      }</div>`;
    }
    case "pullQuote":
      if (!block.quote.trim()) return "";
      return `<blockquote class="pull"><p>${inline(block.quote.trim())}</p>${
        block.cite.trim() ? `<cite class="bb-pull-cite">— ${escapeHtml(block.cite.trim())}</cite>` : ""
      }</blockquote>`;
    case "cta": {
      if (!block.heading.trim() && !block.buttonLabel.trim()) return "";
      const href = safeUrl(block.buttonUrl || getWhatsAppUrl());
      const external = /^https?:/i.test(href)
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<div class="cta-box">${
        block.heading.trim() ? `<h2>${escapeHtml(block.heading.trim())}</h2>` : ""
      }${block.text.trim() ? `<p>${inline(block.text.trim())}</p>` : ""}${
        block.buttonLabel.trim()
          ? `<a class="cta-btn" href="${escapeHtml(href)}"${external}>${escapeHtml(
              block.buttonLabel.trim()
            )}</a>`
          : ""
      }</div>`;
    }
  }
}

/** The article body: optional "In this guide" list, then each block. */
export function renderBody(doc: BuilderDoc): string {
  const anchors = headingAnchors(doc.blocks);
  const parts: string[] = [];

  const toc = tocHeadings(doc.blocks);
  if (doc.meta.showToc && toc.length >= 2) {
    parts.push(
      `<nav class="bb-toc" aria-label="In this guide"><p class="bb-toc-title">In this guide</p><ol>${toc
        .map((h) => `<li><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`)
        .join("")}</ol></nav>`
    );
  }

  doc.blocks.forEach((block, index) => {
    const html = renderBlock(block, anchors.get(index));
    if (html) parts.push(html);
  });

  return parts.join("\n");
}

/** Rough read time from the words in the blocks, at 200 words a minute. */
export function estimateReadTime(doc: BuilderDoc, standfirst = ""): string {
  const text = [standfirst, renderBody(doc).replace(/<[^>]+>/g, " ")].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/* ── Save format ── */

const MARKER = /^\s*<!--yfc-builder:([A-Za-z0-9+/=]+)-->/;

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(data: string): string {
  const binary = atob(data);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** What gets saved in Blog.content. */
export function serializeDoc(doc: BuilderDoc): string {
  return `<!--yfc-builder:${toBase64(JSON.stringify(doc))}-->\n${renderBody(doc)}`;
}

/** Reads builder data back out of Blog.content, or null for normal posts. */
export function parseDoc(content: string): BuilderDoc | null {
  const match = content.match(MARKER);
  if (!match) return null;
  try {
    const doc = JSON.parse(fromBase64(match[1])) as BuilderDoc;
    if (!doc || !Array.isArray(doc.blocks) || !doc.meta) return null;
    return { version: 1, meta: { ...defaultMeta(), ...doc.meta }, blocks: doc.blocks };
  } catch {
    return null;
  }
}

export function isBuilderContent(content: string): boolean {
  return MARKER.test(content);
}
