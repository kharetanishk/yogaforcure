// Reads the "Frequently Asked Questions" section out of a post's HTML so the
// FAQPage structured data comes from the same text readers see on the page.
//
// Posts write their FAQ as a heading line followed by question / answer lines:
//   Frequently Asked Questions<br />Question?<br />Answer.</p><p>Question?<br />Answer.
// The section ends at the first heading after an answer: a short line with no
// closing punctuation ("About Neha - Yoga For Cure") or a Title Case question
// ("Why Learn Yoga with an Experienced Instructor?"). Questions inside an FAQ
// are written in sentence case.
// Many posts also list "Frequently Asked Questions" in a table of contents near
// the top, so every mention is tried and the one with the most answers wins.

export type FaqItem = { question: string; answer: string };

const FAQ_HEADING = /^(?:frequently\s+asked\s+questions|faqs?)\b[^?]{0,60}$/i;
const MAX_QUESTION = 200;
const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
};

/** Some older posts were escaped several times ("&amp;amp;quot;"), so decode until stable. */
function decodeEntities(text: string): string {
  let previous = "";
  let current = text;
  for (let i = 0; i < 8 && current !== previous; i++) {
    previous = current;
    current = current.replace(/&(?:amp|quot|#39|#x27|lt|gt|nbsp);/g, (e) => ENTITIES[e] ?? e);
  }
  return current;
}

function toLines(html: string): string[] {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>|<\/(?:p|div|h[1-6]|li|section|summary|details|dt|dd)>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(text)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function isQuestion(line: string): boolean {
  return line.endsWith("?") && line.length <= MAX_QUESTION;
}

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "is", "it", "of", "on", "or", "the", "to", "vs", "with", "your", "you", "i", "my"]);

/** "Why Learn Yoga with an Experienced Instructor?" but not "Can I do yoga with PCOS?" */
function isTitleCase(line: string): boolean {
  const words = line.replace(/[^\p{L}\s'-]/gu, " ").split(/\s+/).filter(Boolean).slice(1);
  const content = words.filter((w) => !SMALL_WORDS.has(w.toLowerCase()));
  if (content.length < 3) return false;
  const capitalised = content.filter((w) => /^\p{Lu}/u.test(w)).length;
  return capitalised / content.length >= 0.75;
}

function looksLikeHeading(line: string): boolean {
  if (line.endsWith("?")) return isTitleCase(line);
  return line.length <= 80 && !/[.!?:;"'”’)]$/.test(line);
}

export function extractFaq(html: string): FaqItem[] {
  const lines = toLines(html);
  let best: FaqItem[] = [];
  lines.forEach((line, i) => {
    if (!FAQ_HEADING.test(line)) return;
    const items = readSection(lines.slice(i + 1));
    if (items.length > best.length) best = items;
  });
  return best;
}

function readSection(lines: string[]): FaqItem[] {
  const items: FaqItem[] = [];
  let current: { question: string; answer: string[] } | null = null;

  const finish = () => {
    if (current && current.answer.length) {
      items.push({ question: current.question, answer: current.answer.join(" ") });
    }
    current = null;
  };

  for (const line of lines) {
    if (current?.answer.length && looksLikeHeading(line)) break;
    if (isQuestion(line) && (!current || current.answer.length)) {
      finish();
      current = { question: line, answer: [] };
    } else if (current) {
      current.answer.push(line);
    } else {
      break; // the heading isn't followed by a question
    }
  }
  finish();
  return items;
}
