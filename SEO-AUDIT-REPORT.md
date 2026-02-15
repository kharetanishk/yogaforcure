# Full SEO Readiness Audit Report — Yoga for Cure (yogaforcure.in)

**Audit date:** Production-level technical SEO review  
**Framework:** Next.js 16 (App Router), React 19  
**Scope:** Crawlability, metadata, structure, performance, mobile, images, schema, indexing readiness

---

## 1. Project Architecture Analysis

| Aspect | Finding | SEO impact |
|--------|---------|------------|
| **Framework** | Next.js 16.1.4, App Router | ✅ Server-rendered initial HTML; good for indexing |
| **Routing** | Two routes: `/` (home), `/gallery` | Flat structure; minimal crawl depth |
| **Dynamic routes** | None | No parameterized URLs to manage |
| **Rendering** | Home: Server Component + client `HomeClient` (pre-rendered). Gallery: full client component (pre-rendered on server) | ✅ Content present in first response; no JS-required content for basic crawl |
| **API routes** | None under `app/api/` | No backend routes to block or expose |
| **Deployment** | Standard `next build` / `next start` | SSR by default; no static export |

**Conclusion:** Architecture supports indexing. Initial HTML includes main content; SplashScreen is a non-blocking overlay; no client-only content gates.

---

## 2. Crawlability & Indexing Audit

| Check | Status | Notes |
|-------|--------|------|
| **robots.txt** | ✅ Present | `public/robots.txt`: Allow /, Disallow /api/, Sitemap declared |
| **sitemap.xml** | ⚠️ Was missing | **Fixed:** `app/sitemap.ts` added; Next.js serves `/sitemap.xml` |
| **Sitemap coverage** | ✅ Complete | Home + Gallery; all public pages included |
| **Canonical (home)** | ✅ Set | `app/page.tsx`: `alternates.canonical: baseUrl + "/"` |
| **Canonical (gallery)** | ❌ Missing | Gallery has no page-level metadata (client component) |
| **noindex / nofollow** | ✅ None used | Correct for public site |
| **Duplicate content** | ✅ Low risk | Single domain; no duplicate URLs identified |
| **Blocked routes** | ✅ Correct | Only `/api/` disallowed (future-proofing) |

**Suggested production robots.txt (current — no change needed):**

```txt
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://yogaforcure.in/sitemap.xml
```

**Sitemap:** Implemented in `app/sitemap.ts`; generates `/sitemap.xml` with `/` and `/gallery`, `changeFrequency` and `priority` set.

---

## 3. Site Structure & Routing SEO

| Item | Status | Notes |
|------|--------|------|
| **Public pages to index** | `/`, `/gallery` | Both should be indexed |
| **Private routes** | None | No admin, auth, or dashboard |
| **API routes** | None | No `app/api/` usage |
| **URL cleanliness** | ✅ Clean | `/`, `/gallery`; no query params or redundant segments |
| **Route naming** | ✅ Semantic | `gallery` is descriptive |
| **Crawl depth** | ✅ Shallow | One level from home |
| **Internal linking** | ✅ Good | Footer: About, Programs, Schedule, Pricing, Gallery. Navbar: hash links + Gallery. Gallery: Home, Programs, Pricing. |

**Improvement:** Ensure `/gallery` has its own metadata and canonical (see Section 4).

---

## 4. Metadata & Head Tags Audit

| Page | Title | Meta description | OG | Twitter | Canonical | Viewport |
|------|--------|------------------|----|---------|-----------|----------|
| **Home** | ✅ Unique, ≤60 chars | ✅ Benefit-focused, ≤160 | ✅ | ✅ | ✅ | ✅ (Next default) |
| **Gallery** | ❌ Uses root layout only | ❌ Generic layout description | ❌ | ❌ | ❌ | ✅ |

**Issues:**

1. **Gallery** (`app/gallery/page.tsx`) is a **client component** (`"use client"`), so it cannot export `metadata`. The page therefore inherits root layout metadata: title "Yoga for Cure by Neha" and a generic description. It has no canonical, no OG, no Twitter card.
2. **Root layout** (`app/layout.tsx`) provides fallback metadata that is generic and not page-specific.

**Ideal metadata structure:**

- **Home:** Already correct in `app/page.tsx` (title, description, OG, Twitter, canonical).
- **Gallery:** Add `app/gallery/layout.tsx` (Server Component) that exports:
  - `metadata`: title (e.g. "Gallery — Yoga by Neha | Yoga for Cure"), description (e.g. "Moments from yoga practice and classes"), `alternates.canonical: baseUrl + "/gallery"`, openGraph, twitter.
- **Root layout:** Keep as fallback only; child routes override.

**Recommendation:** Create `app/gallery/layout.tsx` with gallery-specific metadata and canonical.

---

## 5. Content SEO Structure

| Check | Status | Notes |
|-------|--------|------|
| **H1 per page** | ✅ One per page | Home: single sr-only H1. Gallery: single visible H1 "Gallery". |
| **Heading hierarchy** | ✅ Logical | H1 → H2 (sections) → H3 (cards/subsections). No skipped levels. |
| **Semantic HTML** | ⚠️ One issue | **Nested `<main>`:** `HomeClient` has `<main>`, and `Hero` contains another `<main>`. Per HTML5, only one `<main>` per page. |
| **Hero text** | ✅ Real text | Hero uses headings and paragraphs; mobile uses background image + overlaid text (not image-only). |
| **Content for crawlers** | ✅ Available | No critical content only in images; main content in DOM from first response. |

**Fix for nested main:** In `Hero.tsx`, change the inner `<main>` to `<section aria-label="Hero">` (or similar) so the document has a single `<main>` (the one in `HomeClient`).

**Critical text in images:** None. Alt text present on images; hero messaging is in HTML.

---

## 6. Performance & Core Web Vitals Readiness

| Area | Finding | Recommendation |
|------|---------|----------------|
| **Image optimization** | Next/Image and sharp used; some plain `<img>` in Hero | Prefer `next/image` for hero image where possible; keep lazy loading on cards. |
| **Lazy loading** | Used on WhatWeOffer, WhyLearnWithMe; `priority` on LCP candidates (SplashScreen, first slide) | ✅ Good. |
| **Bundle size** | Framer Motion, Lucide used | Consider lazy-loading below-the-fold sections if bundle grows. |
| **Client-heavy rendering** | HomeClient and Gallery are client; content still pre-rendered | ✅ Acceptable. |
| **Hydration** | No obvious hydration mismatches | — |
| **Layout shift** | Masonry on gallery may cause CLS until dimensions load | Consider aspect-ratio or min-height to reduce CLS. |
| **Blocking scripts** | None explicit; Next handles loading | — |

**LCP:** Hero text and/or image; SplashScreen is overlay. Ensure hero image (desktop) and mobile background use appropriate `priority` or preload if needed.

**CLS:** Reserve space for gallery masonry (e.g. skeleton or min-height) to limit layout shift.

**INP:** No heavy input handlers identified; acceptable.

---

## 7. Mobile SEO Audit

| Check | Status | Notes |
|-------|--------|------|
| **Responsive layout** | ✅ | Tailwind breakpoints (sm, md, lg, xl) used throughout. |
| **Mobile-first** | ✅ | Styles scale from small to large. |
| **Viewport** | ✅ | Next.js App Router adds viewport meta by default. |
| **Hero on mobile** | ✅ | Background image + overlay; heading and CTA overlaid and readable. |
| **Mobile indexing** | ✅ | Same HTML as desktop; no separate mobile URLs; content visible from first paint. |

No critical mobile SEO blockers.

---

## 8. Internal Linking & Crawl Flow

| Source | Links | Assessment |
|--------|--------|-------------|
| **Footer** | About (#why-learn-with-me), Programs (#what-we-offer), Schedule (#weekly-live-sessions), Pricing (#pricing), Gallery (/gallery) | ✅ Strong; all key sections and gallery linked. |
| **Navbar** | Home, Programs (dropdown), About, Schedule, Pricing, Gallery | ✅ Good. |
| **Homepage** | CTA to gallery; WhatWeOffer "View pricing" / "View schedule"; ClosingCTA "View pricing" | ✅ Good. |
| **Gallery** | Home, Programs (#what-we-offer), Pricing (#pricing) | ✅ Back links to main content. |

**Orphan pages:** None. Gallery is linked from footer and navbar.

**Crawl path:** Home → in-page sections (hash) and /gallery. One click to gallery; shallow depth. No improvements strictly required; optional: add a “Gallery” or “See more” in hero or programs if you want more prominence.

---

## 9. Image SEO Audit

| Check | Status | Notes |
|-------|--------|------|
| **Alt attributes** | ⚠️ Mixed | WhatWeOffer, WhyLearnWithMe, Hero: descriptive alts. Gallery: generic ("Gallery photo 1", "Aasan video 1"). |
| **Formats** | ✅ | WebP used where implemented; JPEG/PNG where needed. |
| **Lazy loading** | ✅ | Cards and below-fold images use lazy; LCP candidates use priority. |
| **Background images** | ✅ | Mobile hero uses CSS background; no critical content in it; overlaid text is in HTML. |

**Recommendations:**

- **Gallery:** Improve alt text (e.g. "Yoga class in progress", "Student in tree pose") for accessibility and image search; keep concise.
- **Videos:** Ensure poster or captions where relevant; alt for video elements is present but generic.

---

## 10. Structured Data (Schema)

| Schema | Status | Location |
|--------|--------|----------|
| **Person** | ✅ | `app/page.tsx`: Neha, jobTitle, description, sameAs (Instagram, YouTube). |
| **Organization** | ✅ | `app/page.tsx`: Yoga by Neha, url, founder, areaServed. |
| **WebSite** | ❌ Missing | Recommended: add WebSite with `url`, `name`, `potentialAction` (e.g. SearchAction or contact). |
| **LocalBusiness** | N/A | Not local-only; global online. Optional if you add a location. |
| **FAQ** | N/A | No FAQ content on site. |
| **Article/Blog** | N/A | No blog. |

**Recommendation:** Add **WebSite** schema on the home page (e.g. `url: baseUrl`, `name: "Yoga by Neha"`, and optional `potentialAction`). Helps search engines understand the site and can support sitelinks.

---

## 11. Google Indexing Readiness Report

### Overall SEO readiness score: **78 / 100**

| Category | Score | Notes |
|----------|-------|------|
| Crawlability & indexing | 85 | robots.txt ✅; sitemap ✅ (added); gallery metadata missing. |
| Metadata & head | 70 | Home ✅; gallery uses generic layout metadata only. |
| Site structure & routing | 95 | Clean URLs; good internal links. |
| Content structure | 85 | One H1 per page ✅; nested `<main>` issue. |
| Performance / CWV | 75 | Good use of Next/Image and lazy load; some CLS risk on gallery. |
| Mobile SEO | 90 | Responsive; viewport; mobile hero fine. |
| Internal linking | 90 | Footer + nav + in-page; gallery linked. |
| Image SEO | 75 | Alts mixed; formats and lazy load good. |
| Structured data | 80 | Person + Organization ✅; WebSite missing. |

---

### Critical issues (must fix)

1. **Gallery has no page-level metadata**  
   - **Impact:** SERP may show wrong title/description; no canonical for /gallery.  
   - **Fix:** Add `app/gallery/layout.tsx` (Server Component) with `metadata` (title, description, canonical, OG, Twitter) for `yogaforcure.in/gallery`.

2. **Nested `<main>` on home**  
   - **Impact:** Invalid HTML; can confuse assistive tech and some crawlers.  
   - **Fix:** In `Hero.tsx`, replace the inner `<main>` with `<section aria-label="Hero">` (or similar).

---

### High-priority fixes

3. **Sitemap**  
   - **Status:** Implemented in `app/sitemap.ts`.  
   - **Verify:** Open `https://yogaforcure.in/sitemap.xml` after deploy.

4. **Gallery image alt text**  
   - Replace generic "Gallery photo N" / "Aasan video N" with short, descriptive alts (e.g. "Yoga class moment", "Tree pose practice") for accessibility and image SEO.

5. **WebSite schema**  
   - Add WebSite JSON-LD on the home page (url, name, optional potentialAction).

---

### Medium improvements

6. **Canonical for gallery**  
   - Set in gallery layout: `alternates.canonical: baseUrl + "/gallery"`.

7. **Gallery CLS**  
   - Reduce layout shift on gallery (e.g. skeleton height or aspect-ratio placeholders) until masonry layout is ready.

8. **Root layout metadata**  
   - Keep as fallback; ensure only pages without their own metadata use it (e.g. future 404 or error page).

---

### Optional optimizations

9. **Open Graph image**  
   - Add `openGraph.images` (and optionally `twitter.images`) for home and gallery (e.g. hero or logo) for better social sharing.

10. **Structured data for gallery**  
    - If gallery is a key landing page, consider ImageGallery or ItemList schema.

---

## Final Output Summary

### 1. SEO readiness score: **78/100**

### 2. Critical issues (must fix)

- Add **gallery metadata** via `app/gallery/layout.tsx` (title, description, canonical, OG, Twitter).
- Fix **nested `<main>`**: change Hero’s inner `<main>` to a `<section>`.

### 3. Suggested robots.txt

Current `public/robots.txt` is production-ready; no change needed:

```txt
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://yogaforcure.in/sitemap.xml
```

### 4. Sitemap

- **Done:** `app/sitemap.ts` added; includes `/` and `/gallery` with `changeFrequency` and `priority`.
- **Action:** Deploy and confirm `https://yogaforcure.in/sitemap.xml` returns 200 and lists both URLs.

### 5. Metadata fixes

- **Home:** Already correct.
- **Gallery:** Create `app/gallery/layout.tsx` with:
  - `metadata.title`: e.g. "Gallery — Yoga by Neha | Yoga for Cure"
  - `metadata.description`: e.g. "Moments from yoga practice and live classes."
  - `metadata.alternates.canonical`: `baseUrl + "/gallery"`
  - `metadata.openGraph` and `metadata.twitter` (reuse description; set `url` to `baseUrl + "/gallery"`).

### 6. Technical SEO improvements

- Fix nested `<main>` in `Hero.tsx` (use `<section>`).
- Add WebSite schema on home.
- Improve gallery image/video alt text.
- Optionally add OG/Twitter images for home and gallery.

### 7. Performance recommendations

- Keep `priority` on LCP images (SplashScreen, first hero image).
- Add masonry placeholder/skeleton or min-height on gallery to reduce CLS.
- Monitor bundle size if adding more client components or animations.

### 8. Final production checklist

- [x] robots.txt present and correct
- [x] Sitemap implemented and referenced
- [ ] Gallery metadata and canonical (add layout)
- [ ] Nested main fixed in Hero
- [x] One H1 per page
- [x] Internal links (footer, nav, gallery back-links)
- [ ] WebSite schema (recommended)
- [ ] Gallery alt text improved (recommended)
- [x] Mobile viewport and responsive layout
- [x] No blocking or private content for crawlers
- [ ] Submit sitemap in Google Search Console after deploy

---

*End of audit. Implement critical and high-priority items before or immediately after production launch for best indexing and ranking readiness.*
