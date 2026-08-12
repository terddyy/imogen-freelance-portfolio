# Portfolio Performance Optimization PRD

**Status:** Draft — ready for implementation  
**Owner:** Imogen / Zentariph  
**Source audit:** [PERFORMANCE-AUDIT.md](../PERFORMANCE-AUDIT.md)  
**Last updated:** August 12, 2026

---

## 1. Executive Summary

We are optimizing the Imogen freelance portfolio (Next.js 16) to move from a **72/100** performance baseline to **90+** by reducing homepage payload, deferring non-critical client JavaScript, and tightening image delivery. The site already has strong foundations (static pages, `next/image`, `next/font`, accessible motion), but visitors—especially on mobile—pay for unoptimized project screenshots, a always-loaded inquiry modal, and GPU-heavy visual effects. This initiative delivers faster first paint, better Core Web Vitals, and a portfolio that feels as polished in performance as it does in design.

---

## 2. Problem Statement

### Who has this problem?

- **Prospective clients** visiting the portfolio on mobile or mid-tier devices
- **Imogen** (site owner) whose credibility depends on a fast, professional first impression
- **Future maintainers** who need guardrails against performance regressions

### What is the problem?

The portfolio loads too much too soon:

1. **~905 KB of PNG project screenshots** (7 files, 100–156 KB each)
2. **14 carousel image nodes** on the homepage (full project list duplicated for infinite scroll)
3. **~150–190 KB gzipped JS on every route** because `ProjectInquiryProvider` lives in the root layout
4. **~48 KB monolithic CSS** with multiple `backdrop-filter` layers causing scroll jank on low-end GPUs

### Why is it painful?

| Stakeholder | Pain |
|-------------|------|
| Visitor | Slow LCP on home, wasted mobile data, scroll jank on glass surfaces |
| Owner | Portfolio undermines “I build quality software” positioning if it feels sluggish |
| Team | No Lighthouse CI or bundle analysis — regressions go unnoticed |

### Evidence

| Source | Finding |
|--------|---------|
| [PERFORMANCE-AUDIT.md](../PERFORMANCE-AUDIT.md) | Weighted score **72/100**; images **58/100**, JS bundle **62/100** |
| Build output | Largest JS chunk **222 KB** uncompressed; built CSS **47.7 KB** |
| Asset inventory | Hero WebP **58.8 KB** (good); project PNGs **905 KB** total (bad) |
| Dev console | Hero preload warning — preloaded image not used within a few seconds |
| Code review | No `next/dynamic` usage; `ProjectInquiryProvider` in `app/layout.tsx` |

---

## 3. Target Users & Personas

### Primary persona: Mobile Prospect Maya

- **Role:** Founder or ops lead evaluating freelancers on their phone
- **Context:** Slow 4G, limited patience, compares 3–5 portfolios in one session
- **Goal:** Quickly assess credibility, view work samples, start an inquiry
- **Pain:** Abandons sites that take >3 s to feel interactive or jank while scrolling
- **JTBD:** *When I'm vetting a freelancer, I want to browse their work without waiting, so I can decide whether to reach out.*

### Secondary persona: Desktop Referrer Dan

- **Role:** Colleague who shares the portfolio link in Slack/email
- **Goal:** Link preview loads fast; recipient sees polished OG image and snappy page
- **JTBD:** *When I recommend Imogen, I want the site to load instantly so my referral reflects well on me.*

### Tertiary persona: Maintainer (future self / dev)

- **Goal:** Ship features without silently bloating bundles or images
- **JTBD:** *When I add a project or section, I want CI to catch perf regressions before deploy.*

---

## 4. Strategic Context

### Business goals

| Goal | How this PRD supports it |
|------|--------------------------|
| Increase inquiry conversion | Faster, smoother site → fewer drop-offs before CTA |
| Strengthen brand credibility | Performance matches visual polish |
| Reduce hosting/CDN cost | Smaller assets = less transfer per visit |

### Competitive landscape

Peer freelancer and agency portfolios on Vercel typically score **85–95** Lighthouse mobile when optimized. This site’s static architecture already matches best practice; the gap is asset and bundle discipline, not framework choice.

### Why now?

- Performance audit is complete with a clear 72 → 90+ path
- Site is pre-launch / early production — cheaper to fix now than after content freeze
- Inquiry API and security work are done; performance is the highest-leverage remaining quality gap

---

## 5. Solution Overview

Three implementation phases, ordered by impact ÷ effort. **No visual redesign** — preserve current UI and motion language unless a change is required for performance.

### Phase 1 — Quick wins (Week 1)

| # | Deliverable |
|---|-------------|
| 1.1 | Convert `public/projects/*.png` → WebP (≤80 KB each); update `portfolio-data.ts` paths |
| 1.2 | Dynamic-import `ProjectInquiryProvider` — load on first trigger click, `ssr: false` |
| 1.3 | `loading="lazy"` on hero brand logos and below-fold images |
| 1.4 | Fix hero LCP — resolve preload warning; tune `sizes` / `preload` on hero background |
| 1.5 | Pause `hero-brand-float` when hero is off-screen or `document.hidden` |

### Phase 2 — Structural (Week 2)

| # | Deliverable |
|---|-------------|
| 2.1 | Carousel: render visible window + edge clones (not full `[...projects, ...projects]`) |
| 2.2 | Dynamic-import `FeaturedProjectCarousel` and `ProofGallery` below hero |
| 2.3 | Replace `backdrop-filter` on header + mobile dock with semi-opaque solid backgrounds |
| 2.4 | Split `portfolio-data.ts` — serializable data vs. icon map module |

### Phase 3 — Excellence (Week 3)

| # | Deliverable |
|---|-------------|
| 3.1 | `images.formats: ['image/avif', 'image/webp']` in `next.config.ts` |
| 3.2 | `app/sitemap.ts`, `app/robots.ts`, OG image metadata |
| 3.3 | Lighthouse CI thresholds in GitHub Actions |
| 3.4 | `@next/bundle-analyzer` script for local/CI bundle checks |
| 3.5 | Optional: Vercel Speed Insights or Web Vitals RUM |

### User flow (unchanged for visitors)

```
Land on / → Hero loads fast (LCP = background)
         → Scroll → sections animate in (reduced-motion respected)
         → Tap "Start a project" → inquiry modal loads (deferred JS)
         → Submit → existing API route (no change)
```

### Key technical decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Inquiry modal loading | Interaction-based `next/dynamic` | Biggest JS win without UX change |
| Image format | WebP sources + Next AVIF output | Best compression with existing `next/image` |
| CSS strategy | Phase 2: split critical base from component CSS | Avoid big-bang rewrite; incremental |
| Carousel loop | Windowed DOM nodes | Halves image nodes without removing feature |

---

## 6. Success Metrics

### Primary metric

**Lighthouse Performance score (mobile, simulated Slow 4G)**

| | Value |
|---|-------|
| Current (est.) | 75–82 |
| Phase 1 target | ≥ 85 |
| Phase 3 target | **≥ 95** |

Measure on production URL after each phase deploy.

### Secondary metrics

| Metric | Current (est.) | Target |
|--------|----------------|--------|
| LCP | 2.5–3.5 s | **< 2.0 s** |
| Total JS (first load, gzip) | 150–190 KB | **< 100 KB** |
| Homepage image transfer | 1.0+ MB | **< 400 KB** |
| Performance audit score | 72/100 | **≥ 90/100** |

### Guardrail metrics

| Metric | Threshold |
|--------|-----------|
| CLS | Stay **< 0.05** (currently good — do not regress) |
| Inquiry form completion rate | No decrease after dynamic import |
| Visual parity | No user-visible layout shifts from image format change |
| Accessibility | `prefers-reduced-motion` behavior preserved |

---

## 7. User Stories & Requirements

### Epic hypothesis

> We believe that reducing initial payload and deferring non-critical JavaScript will increase Lighthouse mobile performance from ~78 to 95+ because the audit shows images and root-layout client code as the primary bottlenecks. We'll measure success via Lighthouse mobile after Phase 1 and Phase 3 deploys.

---

### Phase 1 stories

#### Story 1.1 — Optimize project screenshots

**As a** mobile visitor, **I want** project images to load quickly, **so that** I can browse work without waiting on large downloads.

**Acceptance criteria:**
- [ ] All 7 project images converted to WebP at ≤80 KB each (visual quality acceptable at 2× retina)
- [ ] `lib/portfolio-data.ts` image paths updated
- [ ] `/projects` and homepage carousel display correctly
- [ ] PNG originals removed or kept only if a fallback is explicitly required
- [ ] Total `public/projects/` size reduced by ≥50%

---

#### Story 1.2 — Defer inquiry modal JavaScript

**As a** visitor on any page, **I want** the site to load fast even if I never open the inquiry form, **so that** my first impression isn't slowed by code I don't use.

**Acceptance criteria:**
- [ ] `ProjectInquiryProvider` loaded via `next/dynamic` with `ssr: false`
- [ ] Modal opens correctly from all triggers: header CTA, hero CTA, contact page, final CTA
- [ ] First-load JS (gzip) reduced by ≥30 KB vs. baseline (measure with build analyzer or Lighthouse)
- [ ] No hydration errors; form submission still works end-to-end
- [ ] Loading state acceptable if user clicks CTA before chunk arrives (spinner or instant open after prefetch on hover — implementer's choice, document in PR)

---

#### Story 1.3 — Lazy-load below-fold images

**As a** visitor, **I want** above-the-fold content prioritized, **so that** the hero appears faster.

**Acceptance criteria:**
- [ ] Hero brand logos use `loading="lazy"` (or equivalent Next.js lazy default where appropriate)
- [ ] Below-fold section images do not use `priority` or `preload`
- [ ] LCP element remains hero background

---

#### Story 1.4 — Fix hero LCP and preload warning

**As a** visitor, **I want** the hero image to paint immediately, **so that** the page feels loaded.

**Acceptance criteria:**
- [ ] No "preloaded but not used" console warning in Chrome devtools
- [ ] Hero `sizes` attribute matches actual rendered width
- [ ] LCP ≤ 2.5 s on mobile Lighthouse after Phase 1

---

#### Story 1.5 — Pause idle hero animations

**As a** mobile visitor, **I want** the site to not waste battery when I'm not viewing the hero, **so that** scrolling elsewhere stays smooth.

**Acceptance criteria:**
- [ ] `hero-brand-float` paused when hero section leaves viewport (`IntersectionObserver`) or `document.hidden`
- [ ] Animations resume when hero is visible again
- [ ] `prefers-reduced-motion: reduce` still disables animations entirely

---

### Phase 2 stories

#### Story 2.1 — Windowed carousel images

**As a** homepage visitor, **I want** the project carousel without downloading every image twice, **so that** the page loads faster.

**Acceptance criteria:**
- [ ] Carousel renders ≤8 `<Image>` nodes regardless of project count (window + edge clones)
- [ ] Infinite scroll and drag behavior unchanged
- [ ] No visible flicker at loop boundary
- [ ] `prefers-reduced-motion` still disables auto-scroll

---

#### Story 2.2 — Defer below-fold client components

**As a** homepage visitor, **I want** the hero and first section interactive before heavy JS parses, **so that** the site feels fast.

**Acceptance criteria:**
- [ ] `FeaturedProjectCarousel` and `ProofGallery` dynamically imported in `app/page.tsx`
- [ ] Skeleton or static fallback renders during chunk load (no layout shift)
- [ ] Functionality unchanged after load

---

#### Story 2.3 — Reduce backdrop-filter on scroll surfaces

**As a** mobile visitor, **I want** smooth scrolling, **so that** the site feels native.

**Acceptance criteria:**
- [ ] Header and mobile dock use semi-opaque `background` instead of `backdrop-filter`
- [ ] Visual appearance within acceptable parity (screenshot before/after in PR)
- [ ] Scroll jank reduced on throttled mobile (subjective + Lighthouse TBT improvement)

---

#### Story 2.4 — Split portfolio data from icons

**As a** maintainer, **I want** client components to import only the data they need, **so that** bundles stay small.

**Acceptance criteria:**
- [ ] `lib/portfolio-data.ts` contains no Lucide icon imports
- [ ] `lib/portfolio-icons.ts` (or similar) maps keys → icon components
- [ ] Server components updated to resolve icons at render time
- [ ] No increase in client bundle size from refactor

---

### Phase 3 stories

#### Story 3.1 — Image format config

**Acceptance criteria:**
- [ ] `next.config.ts` includes `images.formats: ['image/avif', 'image/webp']`
- [ ] Build succeeds; images serve AVIF to supporting browsers

#### Story 3.2 — SEO metadata

**Acceptance criteria:**
- [ ] `app/sitemap.ts` lists all static routes
- [ ] `app/robots.ts` allows indexing
- [ ] Root `metadata` includes `openGraph.images`

#### Story 3.3 — Lighthouse CI

**Acceptance criteria:**
- [ ] GitHub Action runs Lighthouse on PR or main
- [ ] Fails if Performance < 85 (raise to 90 after Phase 2)
- [ ] Artifacts uploaded for review

#### Story 3.4 — Bundle analyzer script

**Acceptance criteria:**
- [ ] `npm run analyze` (or `ANALYZE=true npm run build`) produces bundle report
- [ ] Documented in README

---

### Constraints

- **No new runtime dependencies** without explicit approval (bundle-analyzer and lighthouse CI are dev-only exceptions)
- **Preserve** inquiry API behavior, rate limiting, and security headers
- **Preserve** `prefers-reduced-motion` and accessibility patterns
- **No production deploy** from implementation agent without owner approval
- Follow [AGENTS.md](../AGENTS.md) — read Next.js 16 docs in `node_modules/next/dist/docs/` before API changes

### Edge cases

| Case | Expected behavior |
|------|-------------------|
| User clicks inquiry CTA before chunk loads | Show brief loading state; do not lose click |
| User has reduced motion enabled | No auto-scroll, no hero float, no section reveal animations |
| WebP unsupported browser | `next/image` serves optimized fallback |
| Carousel has 1 project | Carousel still works without duplicate images |
| JS disabled | Static content and mailto/tel links still work; inquiry modal unavailable (acceptable) |

---

## 8. Out of Scope

| Item | Reason |
|------|--------|
| Full visual redesign | Performance initiative, not rebranding |
| Replacing Motion with CSS-only animations | High effort; defer unless Phase 2 metrics miss target |
| Full CSS rewrite to CSS Modules | Phase 2 splits critical CSS only; full modularization is future work |
| CDN migration or hosting change | Deployment platform unchanged |
| CAPTCHA on inquiry form | Security scope, not performance |
| Image CDN (Cloudinary, etc.) | `next/image` + static assets sufficient for portfolio scale |
| Service worker / offline mode | Overkill for marketing site |
| Removing inquiry modal from layout entirely | Still needed globally; only defer loading |
| `ThemeToggle` implementation | Dead code; may delete in Phase 1 cleanup if trivial |

---

## 9. Dependencies & Risks

### Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| [PERFORMANCE-AUDIT.md](../PERFORMANCE-AUDIT.md) | Done | Baseline metrics |
| Image source files (project screenshots) | Imogen | Available in `public/projects/` |
| Production URL for Lighthouse | Imogen | Needed for Phase 3 RUM |
| GitHub Actions (for Lighthouse CI) | Dev | Required for Story 3.3 |

### Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| WebP conversion degrades screenshot quality | Medium | Medium | Side-by-side review before deleting PNGs |
| Dynamic inquiry import causes click delay | Medium | Medium | Prefetch on CTA hover/focus; measure INP |
| Carousel windowing introduces loop bugs | Medium | High | Manual test drag + auto-scroll on mobile/desktop |
| Lighthouse CI flaky on CI runners | Medium | Low | Run 3 medians; threshold on Performance only |
| `backdrop-filter` removal looks too flat | Low | Low | Tune opacity/border to match glass feel |

---

## 10. Open Questions

| # | Question | Proposed default | Decision |
|---|----------|------------------|----------|
| 1 | Delete PNG originals after WebP conversion? | Yes, if visual QA passes | _TBD_ |
| 2 | Prefetch inquiry chunk on header CTA hover? | Yes | _TBD_ |
| 3 | Lighthouse CI on every PR or main only? | Every PR | _TBD_ |
| 4 | Enable Vercel Speed Insights? | Yes, if on Vercel | _TBD_ |
| 5 | Re-audit score target: 90 or 95? | 90 minimum, 95 stretch | _TBD_ |

---

## Implementation sequence

```
Phase 1 (ship first) ─────────────────────────────────────
  1.1 WebP images
  1.2 Dynamic inquiry modal
  1.3 Lazy below-fold images
  1.4 Hero LCP fix
  1.5 Pause hero animations
  → Verify: Lighthouse mobile ≥ 85

Phase 2 ────────────────────────────────────────────────────
  2.1 Windowed carousel
  2.2 Dynamic below-fold components
  2.3 Backdrop-filter reduction
  2.4 Split portfolio-data icons
  → Verify: Lighthouse mobile ≥ 90, audit score ≥ 85

Phase 3 ────────────────────────────────────────────────────
  3.1–3.4 Config, SEO, CI, analyzer
  → Verify: Lighthouse mobile ≥ 95, audit score ≥ 90
```

---

## Related documents

| Document | Purpose |
|----------|---------|
| [PERFORMANCE-AUDIT.md](../PERFORMANCE-AUDIT.md) | Baseline findings and technical detail |
| [IMPLEMENTATION_HANDOFF.md](./IMPLEMENTATION_HANDOFF.md) | Agent execution brief |
| [README.md](../README.md) | Project setup and API docs |
