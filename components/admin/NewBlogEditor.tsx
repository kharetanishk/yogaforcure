"use client";

import { useState } from "react";
import { FileText, LayoutTemplate } from "lucide-react";
import BlogBuilder from "@/components/admin/BlogBuilder";
import BlogForm from "@/components/admin/BlogForm";

type Mode = "builder" | "simple";

const MODES: { id: Mode; label: string; icon: typeof LayoutTemplate }[] = [
  { id: "builder", label: "Blog Builder", icon: LayoutTemplate },
  { id: "simple", label: "Simple editor", icon: FileText },
];

export default function NewBlogEditor() {
  const [mode, setMode] = useState<Mode>("builder");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a]">New blog</h1>
        <div
          role="tablist"
          aria-label="Editor type"
          className="inline-flex rounded-lg border border-[#ddd5c8] bg-white p-1 self-start"
        >
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === id ? "bg-[#2d5a2d] text-white" : "text-[#3d4a3d] hover:bg-[#f5f1eb]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
      {mode === "builder" ? <BlogBuilder /> : <BlogForm />}
    </div>
  );
}
