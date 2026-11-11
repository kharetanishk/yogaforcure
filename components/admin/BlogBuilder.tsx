"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import BlogImageManager from "@/components/admin/BlogImageManager";
import type { BlogImageInput } from "@/components/admin/BlogForm";
import {
  BLOCK_LABELS,
  defaultMeta,
  estimateReadTime,
  newBlock,
  renderBody,
  serializeDoc,
  type Block,
  type BlockType,
  type BuilderDoc,
  type BuilderMeta,
} from "@/lib/blogBuilder";

type BlogBuilderProps = {
  initial?: {
    id: string;
    title: string;
    excerpt: string;
    metaTitle: string;
    metaDescription: string;
    published: boolean;
    images: BlogImageInput[];
    doc: BuilderDoc;
  };
};

const BLOCK_ORDER: BlockType[] = [
  "heading",
  "paragraph",
  "list",
  "statStrip",
  "bigStat",
  "comparison",
  "localSearch",
  "pullQuote",
  "cta",
];

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[#ddd5c8] bg-white text-sm text-[#1a3a1a] focus:outline-none focus:ring-2 focus:ring-[#2d5a2d]/30";
const labelCls = "block text-xs font-medium text-[#3d4a3d] mb-1";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function hasContent(block: Block): boolean {
  return renderBody({ version: 1, meta: { ...defaultMeta(), showToc: false }, blocks: [block] }).length > 0;
}

export default function BlogBuilder({ initial }: BlogBuilderProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [standfirst, setStandfirst] = useState(initial?.excerpt ?? "");
  const [meta, setMeta] = useState<BuilderMeta>(initial?.doc.meta ?? defaultMeta());
  const [blocks, setBlocks] = useState<Block[]>(initial?.doc.blocks ?? []);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [headerOpen, setHeaderOpen] = useState(true);

  const [images, setImages] = useState<BlogImageInput[]>(initial?.images ?? []);
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingPostId, setExistingPostId] = useState<string | null>(null);

  const doc: BuilderDoc = useMemo(() => ({ version: 1, meta, blocks }), [meta, blocks]);
  const bodyHtml = useMemo(() => renderBody(doc), [doc]);
  const h2Count = blocks.filter((b) => b.type === "heading" && b.level === 2 && b.text.trim()).length;

  function updateMeta<K extends keyof BuilderMeta>(key: K, value: BuilderMeta[K]) {
    setMeta((prev) => ({ ...prev, [key]: value }));
  }

  function updateBlock(index: number, patch: Partial<Block>) {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? ({ ...b, ...patch } as Block) : b))
    );
  }

  function addBlock(type: BlockType) {
    setBlocks((prev) => [...prev, newBlock(type)]);
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= blocks.length) return;
    setBlocks((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
    setCollapsed(new Set());
  }

  function removeBlock(index: number) {
    if (hasContent(blocks[index]) && !window.confirm("Delete this block?")) return;
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setCollapsed(new Set());
  }

  function toggleCollapsed(index: number) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) => [...prev, { url: data.url, publicId: data.publicId, alt: "" }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    setError("");
    setExistingPostId(null);

    if (!title.trim()) return setError("Add an article title.");
    if (!standfirst.trim()) return setError("Add a standfirst / intro summary.");
    if (!blocks.some(hasContent)) return setError("Add at least one content block with text.");

    setSaving(true);
    try {
      const payload = {
        title,
        excerpt: standfirst,
        content: serializeDoc(doc),
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || standfirst,
        published,
        images,
      };
      const res = await fetch(isEdit ? `/api/blogs/${initial!.id}` : "/api/blogs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setExistingPostId(data.existingId ?? null);
        throw new Error(data.error || "Save failed");
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const metaLine = [meta.category, meta.date, meta.readTime].filter((s) => s.trim());
  const initialLetter = (meta.authorName.trim()[0] || "N").toUpperCase();

  return (
    <div className="rounded-2xl border border-[#ddd5c8] overflow-hidden bg-[#f3ede3] shadow-sm">
      {/* Top bar */}
      <div className="bg-[#1b2e22] text-white px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-sm sm:text-base">Blog Builder</h2>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-white/60">Preview updates as you type</span>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-3 py-1.5 rounded-lg border border-white/25 text-xs sm:text-sm hover:bg-white/10"
          >
            ← Cancel
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr]">
        {/* ── Editor pane ── */}
        <div className="lg:h-[calc(100vh-210px)] lg:min-h-[560px] overflow-y-auto border-b lg:border-b-0 lg:border-r border-[#ddd5c8] p-4 space-y-6">
          {/* Post header */}
          <section>
            <button
              type="button"
              onClick={() => setHeaderOpen((o) => !o)}
              className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.14em] uppercase text-[#5b6b5b] mb-2"
            >
              Post header
              {headerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {headerOpen && (
              <div className="bg-[#faf8f5] border border-[#ddd5c8] rounded-xl p-3.5 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Category">
                    <input className={inputCls} value={meta.category} onChange={(e) => updateMeta("category", e.target.value)} />
                  </Field>
                  <Field label="Date">
                    <input className={inputCls} value={meta.date} onChange={(e) => updateMeta("date", e.target.value)} />
                  </Field>
                  <Field label="Read time">
                    <input className={inputCls} value={meta.readTime} onChange={(e) => updateMeta("readTime", e.target.value)} />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => updateMeta("readTime", estimateReadTime(doc, standfirst))}
                  className="text-xs text-[#2d5a2d] underline -mt-1"
                >
                  Estimate read time from content
                </button>
                <Field label="Article title (h1 in the post)">
                  <textarea rows={2} className={`${inputCls} resize-y`} value={title} onChange={(e) => setTitle(e.target.value)} />
                </Field>
                <Field label="Standfirst / intro summary">
                  <textarea
                    rows={3}
                    className={`${inputCls} resize-y`}
                    value={standfirst}
                    onChange={(e) => setStandfirst(e.target.value)}
                    placeholder="Also used on blog cards and in Google results"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Author name">
                    <input className={inputCls} value={meta.authorName} onChange={(e) => updateMeta("authorName", e.target.value)} />
                  </Field>
                  <Field label="Author tagline">
                    <input className={inputCls} value={meta.authorTagline} onChange={(e) => updateMeta("authorTagline", e.target.value)} />
                  </Field>
                </div>
                <label className="flex items-center gap-2 text-xs text-[#3d4a3d] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={meta.showToc}
                    onChange={(e) => updateMeta("showToc", e.target.checked)}
                    className="accent-[#c99228]"
                  />
                  Show “In this guide” list (needs 2+ headings)
                </label>
              </div>
            )}
          </section>

          {/* Content blocks */}
          <section>
            <h2 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#5b6b5b] mb-2">
              Content blocks
            </h2>
            {blocks.length === 0 ? (
              <div className="border-2 border-dashed border-[#d9cdb8] rounded-xl py-7 text-center text-sm text-[#3d4a3d]">
                Add your first block below
              </div>
            ) : (
              <ol className="space-y-2.5">
                {blocks.map((block, index) => (
                  <li key={index} className="bg-[#faf8f5] border border-[#ddd5c8] rounded-xl">
                    <div className="flex items-center gap-1 px-3 py-2 border-b border-[#ede8e0]">
                      <button
                        type="button"
                        onClick={() => toggleCollapsed(index)}
                        className="flex-1 text-left text-xs font-semibold text-[#1a3a1a] truncate"
                      >
                        {BLOCK_LABELS[block.type]}
                        {block.type === "heading" && block.text && (
                          <span className="font-normal text-[#5b6b5b]"> · {block.text}</span>
                        )}
                      </button>
                      <button type="button" aria-label="Move up" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="p-1 rounded hover:bg-[#ede8e0] disabled:opacity-30">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" aria-label="Move down" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="p-1 rounded hover:bg-[#ede8e0] disabled:opacity-30">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" aria-label="Delete block" onClick={() => removeBlock(index)} className="p-1 rounded text-red-700 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {!collapsed.has(index) && (
                      <div className="p-3 space-y-2.5">
                        <BlockFields block={block} onChange={(patch) => updateBlock(index, patch)} />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {BLOCK_ORDER.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="px-3 py-1.5 rounded-full border border-dashed border-[#d9cdb8] bg-[#ede5d6] text-xs font-medium text-[#1a3a1a] hover:bg-[#e2d7c3]"
                >
                  + {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#5b6b5b] mt-2.5 leading-relaxed">
              In text fields: **bold**, *italic*, [link text](https://…). Leave a blank line to start a new paragraph.
            </p>
          </section>

          {/* Images */}
          <section>
            <h2 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#5b6b5b] mb-1">Images</h2>
            <p className="text-[11px] text-[#5b6b5b] mb-2">
              The first image is the cover on blog cards and social previews. Describe what it shows in the alt text.
            </p>
            <BlogImageManager
              images={images}
              onChange={setImages}
              uploading={uploading}
              onUpload={handleUpload}
              defaultAlt=""
            />
          </section>

          {/* SEO & publish */}
          <section className="bg-[#faf8f5] border border-[#ddd5c8] rounded-xl p-3.5 space-y-3">
            <h2 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#5b6b5b]">SEO & publish</h2>
            <Field label={`Meta title (max 60, now ${(metaTitle || title).trim().length})`}>
              <input className={inputCls} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "Defaults to the article title"} />
            </Field>
            <Field label={`Meta description (140–160, now ${(metaDescription || standfirst).trim().length})`}>
              <textarea rows={3} className={`${inputCls} resize-y`} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder={standfirst || "Defaults to the standfirst"} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-[#1a3a1a] cursor-pointer">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-[#2d5a2d]" />
              Publish (visible on /blog)
            </label>
          </section>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              {error}
              {existingPostId && (
                <>
                  {" "}
                  <Link href={`/admin/dashboard/blogs/${existingPostId}/edit`} className="font-semibold underline">
                    Open the existing post
                  </Link>
                </>
              )}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full px-6 py-3 rounded-lg bg-[#2d5a2d] text-white font-semibold hover:bg-[#1a3a1a] disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Update post" : published ? "Publish post" : "Save draft"}
          </button>
        </div>

        {/* ── Preview pane ── */}
        <div className="lg:h-[calc(100vh-210px)] lg:min-h-[560px] overflow-y-auto px-5 sm:px-8 py-6 bg-[#f3ede3]">
          <article className="max-w-[720px]">
            {metaLine.length > 0 && (
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#1b2e22] flex flex-wrap items-center gap-x-2.5">
                {metaLine.map((part, i) => (
                  <span key={i} className="flex items-center gap-2.5">
                    {i > 0 && <span className="text-[#c9bfae]">•</span>}
                    {part}
                  </span>
                ))}
              </p>
            )}
            {title.trim() && (
              <h1 className="mt-5 font-[family-name:var(--font-merriweather,Georgia,serif)] text-[clamp(26px,3.6vw,40px)] leading-tight font-bold text-[#1b2e22]">
                {title}
              </h1>
            )}
            {standfirst.trim() && (
              <p className="mt-4 text-lg leading-relaxed text-[#4a4a4a]">{standfirst}</p>
            )}
            <hr className="my-5 border-[#ddd5c8]" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#2b4d3a] text-white flex items-center justify-center font-bold">
                {initialLetter}
              </div>
              <div>
                <div className="font-semibold text-[#1b2e22]">{meta.authorName || "Author"}</div>
                {meta.authorTagline && <div className="text-sm text-[#656565]">{meta.authorTagline}</div>}
              </div>
            </div>
            {meta.showToc && h2Count === 1 && (
              <p className="text-xs text-[#9a8f7c] mb-4">Add one more main heading to show the “In this guide” list.</p>
            )}
            <div className="prose-blog" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </article>
        </div>
      </div>
    </div>
  );
}

function BlockFields({
  block,
  onChange,
}: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <>
          <Field label="Heading text">
            <input className={inputCls} value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
          </Field>
          <div className="flex gap-3 text-xs text-[#3d4a3d]">
            {([2, 3] as const).map((level) => (
              <label key={level} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={block.level === level} onChange={() => onChange({ level })} className="accent-[#2d5a2d]" />
                {level === 2 ? "Main heading (H2, listed in guide)" : "Sub-heading (H3)"}
              </label>
            ))}
          </div>
        </>
      );
    case "paragraph":
      return (
        <Field label="Text">
          <textarea rows={5} className={`${inputCls} resize-y`} value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
        </Field>
      );
    case "list":
      return (
        <>
          <Field label="Items (one per line)">
            <textarea rows={4} className={`${inputCls} resize-y`} value={block.items} onChange={(e) => onChange({ items: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-xs text-[#3d4a3d] cursor-pointer">
            <input type="checkbox" checked={block.ordered} onChange={(e) => onChange({ ordered: e.target.checked })} className="accent-[#2d5a2d]" />
            Numbered list
          </label>
        </>
      );
    case "statStrip":
      return (
        <>
          {block.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-[90px_1fr_auto] gap-2 items-end">
              <Field label="Number">
                <input
                  className={inputCls}
                  value={stat.value}
                  onChange={(e) =>
                    onChange({ stats: block.stats.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)) })
                  }
                />
              </Field>
              <Field label="Label">
                <input
                  className={inputCls}
                  value={stat.label}
                  onChange={(e) =>
                    onChange({ stats: block.stats.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)) })
                  }
                />
              </Field>
              <button
                type="button"
                aria-label="Remove stat"
                onClick={() => onChange({ stats: block.stats.filter((_, j) => j !== i) })}
                className="p-2 text-red-700 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {block.stats.length < 4 && (
            <button
              type="button"
              onClick={() => onChange({ stats: [...block.stats, { value: "", label: "" }] })}
              className="text-xs text-[#2d5a2d] underline"
            >
              + Add stat
            </button>
          )}
        </>
      );
    case "bigStat":
      return (
        <>
          <Field label="Big number (e.g. 72%)">
            <input className={inputCls} value={block.value} onChange={(e) => onChange({ value: e.target.value })} />
          </Field>
          <Field label="What it means">
            <textarea rows={2} className={`${inputCls} resize-y`} value={block.label} onChange={(e) => onChange({ label: e.target.value })} />
          </Field>
          <Field label="Source (optional)">
            <input className={inputCls} value={block.source} onChange={(e) => onChange({ source: e.target.value })} />
          </Field>
        </>
      );
    case "comparison":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Left title">
            <input className={inputCls} value={block.leftTitle} onChange={(e) => onChange({ leftTitle: e.target.value })} />
          </Field>
          <Field label="Right title">
            <input className={inputCls} value={block.rightTitle} onChange={(e) => onChange({ rightTitle: e.target.value })} />
          </Field>
          <Field label="Left points (one per line)">
            <textarea rows={4} className={`${inputCls} resize-y`} value={block.leftItems} onChange={(e) => onChange({ leftItems: e.target.value })} />
          </Field>
          <Field label="Right points (one per line)">
            <textarea rows={4} className={`${inputCls} resize-y`} value={block.rightItems} onChange={(e) => onChange({ rightItems: e.target.value })} />
          </Field>
        </div>
      );
    case "localSearch":
      return (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Field label="What people search">
              <input className={inputCls} value={block.query} onChange={(e) => onChange({ query: e.target.value })} placeholder="yoga for back pain" />
            </Field>
            <Field label="Place (optional)">
              <input className={inputCls} value={block.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="near me" />
            </Field>
          </div>
          <Field label="Note under the search bar">
            <textarea rows={2} className={`${inputCls} resize-y`} value={block.note} onChange={(e) => onChange({ note: e.target.value })} />
          </Field>
        </>
      );
    case "pullQuote":
      return (
        <>
          <Field label="Quote">
            <textarea rows={3} className={`${inputCls} resize-y`} value={block.quote} onChange={(e) => onChange({ quote: e.target.value })} />
          </Field>
          <Field label="Who said it (optional)">
            <input className={inputCls} value={block.cite} onChange={(e) => onChange({ cite: e.target.value })} />
          </Field>
        </>
      );
    case "cta":
      return (
        <>
          <Field label="Heading">
            <input className={inputCls} value={block.heading} onChange={(e) => onChange({ heading: e.target.value })} />
          </Field>
          <Field label="Text">
            <textarea rows={2} className={`${inputCls} resize-y`} value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Button label">
              <input className={inputCls} value={block.buttonLabel} onChange={(e) => onChange({ buttonLabel: e.target.value })} />
            </Field>
            <Field label="Button link">
              <input className={inputCls} value={block.buttonUrl} onChange={(e) => onChange({ buttonUrl: e.target.value })} />
            </Field>
          </div>
        </>
      );
  }
}
