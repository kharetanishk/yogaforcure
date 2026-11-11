"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Plus, LayoutDashboard, ChevronRight } from "lucide-react";

const LEAF_LABELS: Record<string, string> = {
  new: "New blog",
  edit: "Edit blog",
};

function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const leaf = segments[segments.length - 1];
  const label = leaf !== "dashboard" ? LEAF_LABELS[leaf] : undefined;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-[#5b6b5b]">
        <li>
          <Link href="/admin/dashboard" className="hover:text-[#2d5a2d] transition-colors">
            Dashboard
          </Link>
        </li>
        {label && (
          <li className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5" />
            <span aria-current="page" className="font-medium text-[#1a3a1a]">
              {label}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}

export default function AdminDashboardShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <header className="bg-[#1a3a1a] text-[#faf8f5] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <LayoutDashboard className="w-5 h-5 text-[#9caf88] shrink-0" />
            <span className="font-semibold text-sm sm:text-base">Blog Admin</span>
            <span className="text-[#9caf88] text-xs sm:text-sm truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/dashboard/blogs/new"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#2d5a2d] text-white text-sm font-medium hover:bg-[#9caf88] hover:text-[#1a3a1a] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New blog
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-[#9caf88]/40 text-sm hover:bg-[#2d5a2d] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <AdminBreadcrumb />
        {children}
      </main>
    </div>
  );
}
