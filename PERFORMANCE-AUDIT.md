# Performance Audit — Imogen Freelance Portfolio

**Audit date:** August 12, 2026  
**Stack:** Next.js 16.2.12 · React 19 · App Router · Turbopack  
**Scope:** Full application — pages, components, assets, API, build output

---

## Overall score: **72 / 100**

| Grade | Range | Meaning |
|-------|-------|---------|
| A | 90–100 | Production-grade, fast on mobile, minimal waste |
| B | 75–89 | Solid; a few targeted fixes left |
| **C+** | **60–74** | **Good foundation, meaningful wins still on the table** |
| D | 40–59 | Noticeable slowness on mid-tier devices |
| F | 0–39 | Critical performance debt |

**Verdict:** The app is well-structured for a portfolio — static pages, `next/image`, `next/font`, a tiny dependency tree, and thoughtful motion fallbacks. The main drag is **homepage weight** (images + client JS) and **always-on client code in the root layout**. With focused work, this can realistically reach **90+**.

---

## Score breakdown

| Area | Score | Weight | Notes |
|------|-------|--------|-------|
| Architecture & rendering | 85 | 15% | All marketing routes are statically generated (`○` in build) |
| JavaScript bundle | 62 | 20% | No code-splitting; inquiry modal + Motion on critical path |
| CSS delivery | 65 | 10% | ~48 KB built CSS; monolithic `globals.css` |
| Images & media | 58 | 20% | Hero WebP is good; project PNGs are heavy; carousel duplicates images |
| Fonts | 82 | 5% | `next/font` with Latin subsets — self-hosted, no layout shift |
| Network & caching | 75 | 10% | Hashed static assets; deployment/CDN dependent |
| Runtime / main thread | 64 | 15% | `backdrop-filter`, RAF carousel, CSS animations |
| API efficiency | 80 | 5% | Rate limits, timeouts, body caps — not user-perceived perf, but solid |

**Weighted total: 72**

---

## What is already working well

### 1. Static-first App Router setup
All public pages pre-render at build time:

```
○ /          ○ /about     ○ /projects
○ /contact   ○ /testimonials
ƒ /api/project-inquiry   (dynamic — correct)
```

No unnecessary server rendering on every request for content pages.

### 2. Lean dependency footprint
Only four runtime dependencies: `next`, `react`, `react-dom`, `motion`, `lucide-react`. No UI kit bloat, no state library, no analytics SDK.

### 3. Image component usage
`next/image` is used consistently with `sizes` on responsive layouts (`ProjectCard`, carousel, hero). The hero background is WebP (~59 KB) and correctly marked `preload`.

### 4. Font optimization
`Manrope` and `Geist Mono` load via `next/font/google` with CSS variables — no external Google Fonts request chain, no FOUT from late font discovery.

### 5. Motion accessibility
- `useReducedMotion()` in `AnimatedSection`, `FeaturedProjectCarousel`, `ProjectFilters`
- `prefers-reduced-motion: reduce` blocks in `globals.css` disable scroll animations and carousel auto-scroll

### 6. Smart carousel behavior
`FeaturedProjectCarousel` only runs its `requestAnimationFrame` loop when the section is in view (`useInView`). Drag uses `translate3d` for GPU-friendly transforms.

### 7. API route discipline
`/api/project-inquiry` has distributed rate limiting (Upstash Redis in prod), 16 KB body cap, origin checks, and 1.5–8 s fetch timeouts. Prevents abuse without blocking legitimate users.

---

## Issues found (by severity)

### Critical — fix first

#### C1. Project screenshots are unoptimized PNGs (~905 KB total)
| File | Size |
|------|------|
| `public/projects/ayyan-tech.png` | 155.7 KB |
| `public/projects/zentari.png` | 147.9 KB |
| `public/projects/waterlinks.png` | 141.8 KB |
| `public/projects/nexcrm.png` | 141.8 KB |
| `public/projects/balanceflow.png` | 128.5 KB |
| `public/projects/sk-logistics.png` | 122.9 KB |
| `public/projects/terdai.png` | 99.9 KB |

`next/image` re-encodes at request time, but source PNGs still inflate build cache, dev reload, and first-hit optimization cost. WebP/AVIF sources at ≤80 KB each would cut transfer ~60–70%.

#### C2. Homepage carousel loads every project image twice
`FeaturedProjectCarousel` renders `[...projects, ...projects]` for the infinite loop — **14 `<Image>` nodes** for 7 projects. Browsers will fetch optimized variants for all visible/near-visible cards on first paint.

**Impact:** LCP/FCP competition, main-thread decode work, mobile data usage.

#### C3. Root layout forces heavy client JS on every route
`app/layout.tsx` wraps the entire app in `ProjectInquiryProvider` (~450 lines, many Lucide icons, dialog state, scroll lock). Combined with client `Header`, `MobileNav`, and `WhatsAppContact`, **every page pays for the inquiry modal even if the user never opens it**.

Production JS chunks (uncompressed, from `.next/static/chunks`):

| Chunk | Size |
|-------|------|
| Main framework chunk | 222 KB |
| Shared vendor chunks (×4) | ~138 KB each |
| Route helpers | 43–134 KB |

Estimated first-load JS after gzip: **~150–190 KB** — acceptable for a SaaS dashboard, heavy for a portfolio.

---

### High — noticeable on mid-tier phones

#### H1. Motion library on the homepage critical path
The home page wraps **9 sections** in `AnimatedSection`, each importing `motion/react-client`. `ProjectFilters` and the carousel add more Motion usage. Motion is well-implemented but not free.

#### H2. Monolithic CSS (~56 KB source → ~48 KB built)
`app/globals.css` is a single 3,200+ line file loaded on every route. Contains glassmorphism (`backdrop-filter: blur(18px) saturate(135%)`), grid overlays, hero float keyframes, and inquiry modal styles — all parsed on every page.

#### H3. Hero brand logos load eagerly
Eight SVG/PNG logos in `HeroSection` have no `loading="lazy"`. They sit below the fold on many viewports but still compete for connection slots during initial load.

#### H4. Hero preload warning (observed in dev)
Playwright logs show:
> *The resource … Hero-background.webp … was preloaded using link preload but not used within a few seconds*

The hero uses `fill` + CSS layering. Verify LCP element timing — preload may be fighting with paint order or responsive `sizes="100vw"` variant selection.

#### H5. Expensive CSS effects stack
Multiple `backdrop-filter` surfaces (header, cards, mobile dock, dialogs) force extra compositor layers. On low-end Android GPUs this shows up as scroll jank and battery drain.

---

### Medium — polish and maintainability

#### M1. No `next/dynamic` anywhere
Heavy client modules (`ProjectInquiry`, `ProofGallery`, `FeaturedProjectCarousel`) are statically imported. No route-level or interaction-based splitting.

#### M2. `portfolio-data.ts` couples icons to data
The data module imports 20+ Lucide icons. Any client import of `portfolio-data` risks pulling icon metadata into client bundles. Split `icons` from serializable data.

#### M3. `scroll-behavior: smooth` on `<html>`
Global smooth scrolling can cause jank during programmatic scroll and conflicts with reduced-motion expectations on some browsers.

#### M4. Continuous CSS animations on hero brands
`hero-brand-float` runs `infinite alternate` on seven brand elements — constant repaints even when the user is not looking at the hero.

#### M5. Missing performance metadata
No `sitemap.xml`, `robots.txt`, Open Graph images, or `metadata.viewport` tuning. Not Core Web Vitals, but affects SEO and social preview load behavior.

#### M6. `X-DNS-Prefetch-Control: off`
Set in `next.config.ts`. Disables DNS prefetch for external links (WhatsApp, project URLs, social). Minor, but works against perceived speed on outbound navigation.

#### M7. Dead code: `ThemeToggle.tsx`
Exported but never mounted. Small, but adds confusion and potential accidental import.

---

### Low — nice to have

- No `@next/bundle-analyzer` in CI to catch regressions
- No Lighthouse CI or Web Vitals monitoring (Vercel Analytics, etc.)
- No `loading.tsx` / Suspense boundaries (low value for fully static pages)
- `ASU` logo SVG is 9.8 KB — could be SVGO-compressed

---

## Route-by-route notes

### `/` (Home) — highest risk
- LCP candidate: hero background image
- Largest JS + image payload of any route
- 9 scroll-triggered Motion observers created on mount
- Proof gallery images are lightweight SVGs (good)

### `/projects`
- `ProjectFilters` is client-only; loads all 7 project images when grid mounts
- Filter animation re-mounts entire grid on category change

### `/about`, `/contact`, `/testimonials`
- Lighter than home, but still inherit layout client bundle (inquiry modal, header, mobile nav)
- `TestimonialList` is a small client island — good pattern, could be replicated elsewhere

### `/api/project-inquiry`
- Performance is server-side latency (Resend + IPROG SMS in parallel) — acceptable
- Redis rate-limit call adds ~50–200 ms; necessary for protection

---

## Recommendations — path to 90+

Prioritized by impact ÷ effort.

### Phase 1 — Quick wins (1–2 days, expected +10–15 points)

| # | Action | Expected gain |
|---|--------|---------------|
| 1 | **Convert project PNGs → WebP** (keep PNG fallback only if needed). Target ≤80 KB each. | −500 KB transfer on `/projects`; faster carousel |
| 2 | **Lazy-load `ProjectInquiry` with `next/dynamic`** (`ssr: false`, load on first trigger click) | −30–50 KB initial JS |
| 3 | **Add `loading="lazy"` to hero brand logos** and any below-fold `Image` | Better connection prioritization |
| 4 | **Fix hero preload** — confirm LCP element; adjust `sizes` or remove `preload` if CSS delays paint | Cleaner LCP, no console warning |
| 5 | **Pause hero float animations** when `document.hidden` or hero leaves viewport | Less idle CPU/battery |

```tsx
// Example: defer inquiry modal until needed
import dynamic from "next/dynamic";

const ProjectInquiryProvider = dynamic(
  () => import("@/components/ProjectInquiry").then((m) => m.ProjectInquiryProvider),
  { ssr: false },
);
```

### Phase 2 — Structural improvements (3–5 days, expected +8–12 points)

| # | Action | Expected gain |
|---|--------|---------------|
| 6 | **Carousel: render 3–5 cards + clone edges** instead of duplicating full project list | −50% image nodes on home |
| 7 | **Split `globals.css`** into `base.css` + route/component modules (CSS Modules or `@import`) | Faster parse on inner routes |
| 8 | **Replace `backdrop-filter` with semi-opaque backgrounds** on scroll surfaces (header, dock) | Smoother scroll on mobile |
| 9 | **Dynamic-import `FeaturedProjectCarousel` and `ProofGallery`** below the hero | Smaller initial JS parse |
| 10 | **Split `portfolio-data.ts`** — pure JSON/TS data vs. icon map | Cleaner client bundles |

### Phase 3 — Excellence (ongoing, expected +5–8 points)

| # | Action | Expected gain |
|---|--------|---------------|
| 11 | Add **`images.formats: ['image/avif', 'image/webp']`** in `next.config.ts` | Best format per browser |
| 12 | Add **Lighthouse CI** threshold (LCP < 2.5 s, CLS < 0.1, INP < 200 ms) | Regression prevention |
| 13 | Add **`app/sitemap.ts` + `app/robots.ts` + OG image** | SEO + social preview perf |
| 14 | Enable **Vercel Speed Insights** or Web Vitals RUM | Real-user monitoring |
| 15 | Consider **`content-visibility: auto`** on below-fold sections | Faster initial render |
| 16 | Audit with `@next/bundle-analyzer` after each major feature | Ongoing discipline |

---

## Target metrics (what “really good” looks like)

| Metric | Current (est.) | Target |
|--------|----------------|--------|
| Lighthouse Performance (mobile) | ~75–82 | **95+** |
| LCP | ~2.5–3.5 s | **< 2.0 s** |
| INP | ~150–250 ms | **< 200 ms** |
| CLS | ~0 (good) | **< 0.05** |
| Total JS (first load, gzip) | ~150–190 KB | **< 100 KB** |
| Homepage image transfer | ~1.0+ MB | **< 400 KB** |
| CSS (gzip) | ~10–12 KB | **< 8 KB critical, rest deferred** |

*Estimates based on build output and asset sizes. Run Lighthouse on production URL for ground truth.*

---

## Suggested implementation order

```
Week 1
├── Convert project images to WebP
├── Dynamic-import ProjectInquiry
├── Lazy-load below-fold images
└── Fix hero preload / LCP

Week 2
├── Slim carousel image strategy
├── Reduce backdrop-filter usage
└── Split portfolio-data icons from data

Week 3
├── CSS modularization
├── Lighthouse CI + bundle analyzer
└── sitemap / OG / monitoring
```

---

## How to verify improvements

```bash
# Production build
npm run build && npm start

# Lighthouse (Chrome DevTools or CLI)
npx lighthouse http://localhost:3000 --only-categories=performance --view

# Bundle analysis (after adding analyzer)
ANALYZE=true npm run build
```

Re-test on:
- **Mobile throttling** (Slow 4G, 4× CPU slowdown)
- **Mid-tier Android** (not just desktop Chrome)
- **First visit** (cold cache) and **repeat visit** (service worker / HTTP cache)

---

## Summary

This portfolio already does the important structural things right: static generation, optimized fonts, accessible motion, and a minimal dependency graph. The score is held back mainly by **homepage image volume**, **eager client JS in the root layout**, and **visual effects that tax the GPU**.

Implementing Phase 1 alone should move the score into the **low 80s**. Completing Phases 1–3 makes **90+** realistic on a typical Vercel deployment with a custom domain and CDN.

---

*Generated from static analysis of the codebase and `npm run build` output. Re-run this audit after major feature work or dependency upgrades.*
