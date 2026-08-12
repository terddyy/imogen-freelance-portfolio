# Implementation Handoff — Portfolio Performance Optimization

**PRD:** [PRD.md](./PRD.md)  
**Audit baseline:** [PERFORMANCE-AUDIT.md](../PERFORMANCE-AUDIT.md)  
**Current score:** 72/100 → **Target:** 90+

---

## Objective

Implement Phases 1–3 from the PRD to improve Lighthouse mobile performance, reduce first-load JS and image transfer, and add regression guardrails — without changing inquiry API behavior or visual design intent.

---

## Before you edit

1. Read `prd-development/PRD.md` (acceptance criteria per story)
2. Read `PERFORMANCE-AUDIT.md` (technical context)
3. Read `AGENTS.md` — check `node_modules/next/dist/docs/` for Next.js 16 APIs
4. Inspect current worktree: `git status`, `git diff`
5. Run baseline: `npm run build` and note chunk sizes

---

## Phase 1 — do first (expected 1–2 days)

### 1.1 Convert project images

**Files:** `public/projects/*`, `lib/portfolio-data.ts`

- Convert 7 PNGs → WebP, target ≤80 KB each
- Update image paths in `portfolio-data.ts`
- Verify carousel (`FeaturedProjectCarousel`) and grid (`ProjectCard`) still render

### 1.2 Dynamic-import inquiry modal

**Files:** `app/layout.tsx`, `components/ProjectInquiry.tsx`

```tsx
import dynamic from "next/dynamic";

const ProjectInquiryProvider = dynamic(
  () => import("@/components/ProjectInquiry").then((m) => m.ProjectInquiryProvider),
  { ssr: false },
);
```

- Keep `ProjectInquiryTrigger` working from header, hero, contact, final CTA
- Consider prefetch on hover/focus for header CTA
- Test full form submit against `/api/project-inquiry`

### 1.3 Lazy-load below-fold images

**Files:** `components/HomeSections.tsx`

- Add `loading="lazy"` to hero brand logos (8 images)
- Audit other `Image` components for incorrect `priority`/`preload`

### 1.4 Fix hero LCP

**Files:** `components/HomeSections.tsx`

- Resolve preload console warning
- Tune `sizes` on hero background (`fill` + `sizes="100vw"`)
- Confirm LCP element is hero image in Lighthouse

### 1.5 Pause hero float animations

**Files:** `app/globals.css`, optionally small client hook in `HeroSection`

- Pause `hero-brand-float` when hero off-screen or tab hidden
- Preserve `prefers-reduced-motion: reduce` behavior

### Phase 1 verification

```bash
npm run build
npm start
# Lighthouse mobile on http://localhost:3000
npx lighthouse http://localhost:3000 --only-categories=performance --preset=desktop --quiet
```

**Pass criteria:** Lighthouse mobile Performance ≥ 85; no hero preload warning; inquiry form works.

---

## Phase 2 — structural (expected 3–5 days)

| Story | Primary files |
|-------|---------------|
| 2.1 Windowed carousel | `components/FeaturedProjectCarousel.tsx` |
| 2.2 Dynamic below-fold | `app/page.tsx` |
| 2.3 Backdrop-filter | `app/globals.css` (header, `.mobileDock`) |
| 2.4 Split icons | `lib/portfolio-data.ts` → `lib/portfolio-icons.ts` + consumers |

**Pass criteria:** Lighthouse mobile ≥ 90; carousel drag + auto-scroll work; no bundle size increase from icon split.

---

## Phase 3 — excellence

| Story | Primary files |
|-------|---------------|
| 3.1 AVIF/WebP config | `next.config.ts` |
| 3.2 Sitemap/robots/OG | `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx` |
| 3.3 Lighthouse CI | `.github/workflows/lighthouse.yml` (new) |
| 3.4 Bundle analyzer | `package.json` script + README note |

**Pass criteria:** Lighthouse mobile ≥ 95; CI fails on Performance < 90.

---

## Do not

- Deploy to production
- Change inquiry API rate limits, env vars, or security headers
- Add runtime dependencies without approval
- Refactor unrelated components (e.g. Footer, API route) unless required by a story
- Remove `prefers-reduced-motion` support

---

## Optional cleanup (low priority)

- Delete unused `components/ThemeToggle.tsx` if confirmed unreferenced
- SVGO-compress `public/logos/asu.svg` (9.8 KB)

---

## Report back with

1. Changed files list
2. Before/after Lighthouse scores (mobile)
3. Before/after first-load JS estimate
4. Tests run (`npm run build`, `npm run lint`)
5. Blockers and open questions from PRD §10
