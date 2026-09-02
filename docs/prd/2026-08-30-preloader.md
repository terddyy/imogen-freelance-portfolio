# PRD — "Boot Sequence" Site Preloader

**Status:** Draft (best-guess mode — creative direction decided, see §10 for override points)
**Date:** 2026-08-30
**Owner:** Terd
**Replaces:** `components/SiteEntryLoader.tsx` + `components/ui/core-spin-loader.tsx`

---

## 1. Executive Summary

We're replacing the current concentric-rings spinner with a **"boot sequence" preloader** — a real-time 3D wireframe core rendered on canvas, wrapped in a system-initialization HUD (live progress %, mono-spaced log lines, corner brackets) that exits through a choreographed lock-in-and-wipe reveal — for prospective clients visiting the portfolio, to solve the problem that the current loader reads as a generic spinner and undersells the engineering craft the site is selling, which will make the first 2 seconds of the visit a portfolio piece in themselves.

---

## 2. Problem Statement

### Who has this problem?
First-time visitors to the portfolio — prospective clients and recruiters evaluating whether Terd is the caliber of engineer they want to hire.

### What is the problem?
The current preloader (`CoreSpinLoader`) is a competent but generic stacked-rings spinner with cycling placeholder text ("Fetching Data..", "Syncing..."). It looks like a UI-kit loading state, not like the opening frame of a high-end engineering portfolio. The text cycles are also fiction — nothing is being fetched or synced — which slightly undercuts trust for a technical audience.

### Why is it painful?
- **User impact:** The first 1.5–3 seconds of the visit — the highest-attention window of the entire session — communicate "template" instead of "craft."
- **Business impact:** For a freelance portfolio, the site itself is the work sample. A forgettable first frame lowers the perceived ceiling of everything after it.

### Evidence
- Current implementation: `components/ui/core-spin-loader.tsx` — 5 nested spinning divs + rotating status strings on a 1s interval.
- The site's own design language (Geist tokens, mono-spaced labels, `#ffb200` accent on `#000`, pixel-square display font) is already "engineered instrument" — the loader is the only surface that doesn't speak it.
- The homepage critique (`.impeccable/critique/2026-08-30T10-28-53Z__app-page-tsx.md`) already flagged generic-template risk elsewhere on the page; the loader is the same genre of problem.

---

## 3. Target Users & Personas

### Primary: Prospective Client (non-technical founder / PM)
- First visit, often on mobile, deciding in under 30 seconds whether this person feels "premium."
- Doesn't know what an icosahedron is — but registers *precision, motion polish, intentionality*.

### Secondary: Technical Evaluator (recruiter, lead engineer, fellow dev)
- Will absolutely view-source the preloader. A hand-rolled dependency-free 3D renderer is a stronger signal than an imported spinner.
- Notices when loading text is fake. Real progress > theater.

---

## 4. Strategic Context

- **Business goal:** The portfolio's only job is conversion to inquiry. Differentiation vs. every other freelance-dev portfolio is the strategy; the entry sequence is the cheapest surface to make unforgettable.
- **Why now:** The loader is a self-contained, low-risk surface (one mount point in `app/layout.tsx:75`, no data dependencies) — high visual ROI for small blast radius.

---

## 5. Solution Overview

**Concept: "BOOT SEQUENCE."** The site introduces itself as a machine coming online.

### Visual composition (dark theme — primary)

1. **3D core (canvas, center viewport):** A wireframe icosahedron rendered with a hand-rolled 3D projection on a 2D canvas context — no WebGL, no new dependencies. Slow continuous rotation on two axes; vertices glow amber (`--green: #ffb200`), edges at reduced opacity, a faint cyan (`#0090ff`) inner core wireframe counter-rotating. Crisp at any devicePixelRatio.
2. **HUD frame (DOM overlay):**
   - Corner brackets at viewport edges (mono, low-opacity white).
   - Bottom-left: mono-spaced log lines appearing sequentially, tied to *real* load milestones — e.g. `MOUNT /layout … OK`, `HYDRATE /app … OK`, `READY` — not fake flavor text.
   - Bottom-right: real progress percentage `000 → 100` in the pixel/mono display font.
   - Optional faint scanline / grid backdrop at very low opacity.
3. **Exit sequence (the payoff):** When ready — rotation accelerates briefly, the core snaps to a front-facing orientation ("lock-in"), a single amber flash/frame pulse, then the overlay splits and wipes away (top/bottom panels parting, or an iris-out from the core) revealing the hero beneath. Choreographed with the already-installed `motion` library.

### Light theme
Same structure, ink-on-paper: near-black wireframe on white, per the existing `html[data-theme="light"]` tokens. No amber flood — light theme is deliberately colorless elsewhere.

### Key technical decision — no Three.js
A 1.5–3s preloader does not justify ~600KB of WebGL bundle on a site whose performance *is* the sales pitch. A perspective-projected wireframe on Canvas 2D is ~120 lines, renders at 60fps, and is itself a craft signal to anyone who inspects it. Three.js is the documented fallback if free-camera 3D or shading is ever wanted (see §10).

---

## 6. Success Metrics

### Primary
- **First-impression quality** (qualitative): the loader is something the owner is proud to screen-record and share. Verified by design review against this PRD's composition.

### Secondary
- **Exit timing:** overlay fully gone ≤ 2.2s after `DOMContentLoaded` on a warm cache; hard cap 3s (preserves current force-hide behavior).
- **Runtime cost:** preloader JS+CSS adds ≤ 15KB gzipped to the entry bundle; zero new npm dependencies.
- **Frame rate:** core animation holds 60fps on a mid-tier Android (no dropped-frame jank visible in DevTools performance trace).

### Guardrails
- **LCP / INP:** no regression vs. current loader (LCP element must not become the loader canvas).
- **Accessibility:** `prefers-reduced-motion` fully respected; overlay never traps focus; page remains usable if JS fails (overlay must not require JS to *dismiss* — see Story 5).

---

## 7. User Stories & Requirements

### Epic hypothesis
We believe that replacing the generic spinner with a real-time 3D boot-sequence preloader will measurably raise perceived craft of the portfolio because the entry frame currently reads as a UI-kit default, and we'll validate it by design review, performance budget checks, and a screen-recorded before/after.

### Story 1 — 3D wireframe core
**As a** visitor, **I want** to see a precise 3D wireform rotating at the center of the screen, **so that** the wait feels engineered rather than stalled.

Acceptance criteria:
- [ ] Icosahedron wireframe rendered on `<canvas>` via custom perspective projection (no 3D library import).
- [ ] Continuous two-axis rotation; inner counter-rotating core in cyan at low opacity.
- [ ] Amber vertex points with subtle glow; edges ~40% opacity white/amber.
- [ ] Canvas scales to viewport and renders sharply at devicePixelRatio ≥ 2.
- [ ] Animation pauses when `document.hidden` (no background battery drain).

### Story 2 — Real progress + system log HUD
**As a** technical visitor, **I want** the progress readout to reflect actual loading milestones, **so that** the sequence feels honest.

Acceptance criteria:
- [ ] Percentage driven by real signals (DOM parsed → fonts ready → `document.fonts.ready` → window load), eased between milestones — never decreases, never sits at 100 while waiting.
- [ ] Log lines correspond to the same milestones and print sequentially in Geist Mono, bottom-left.
- [ ] Corner brackets + percentage in bottom-right; all HUD text ≤ 11px, letter-spaced, uppercase.
- [ ] No fabricated statuses ("Fetching Data", "Syncing") — every line maps to a real event.

### Story 3 — Lock-in exit reveal
**As a** visitor, **I want** the loader to resolve with a deliberate reveal, **so that** the transition into the site feels like a designed moment.

Acceptance criteria:
- [ ] On ready: brief rotation ease-out, core snaps to front-facing orientation, single accent pulse.
- [ ] Overlay exits via split-wipe or iris-out (pick one during build; both specced in the handoff) revealing the hero — not a plain opacity fade.
- [ ] Total sequence: min display ~1.4s (enough to read the boot), exit animation ≤ 600ms, hard cap 3s to fully hidden (preserves current `SiteEntryLoader` failsafe semantics).
- [ ] Hero entrance animation (if any) starts *after* the wipe begins, not after it ends.

### Story 4 — Theme + reduced-motion variants
**As a** visitor with motion sensitivity or light theme, **I want** an appropriate variant, **so that** the site respects my settings.

Acceptance criteria:
- [ ] `prefers-reduced-motion: reduce`: no rotation, no wipe — static wordmark + thin progress bar, simple opacity exit.
- [ ] Light theme: ink wireframe on `--bg: #ffffff`, no amber flood, per existing light tokens.
- [ ] Theme resolved before first paint (no dark flash for light-theme users — loader background must read the same theme source the rest of the app uses).

### Story 5 — Resilience
**As a** visitor on a broken/slow connection, **I want** the site to appear regardless, **so that** the loader never becomes a wall.

Acceptance criteria:
- [ ] Force-hide failsafe preserved (currently 3000ms in `SiteEntryLoader.tsx`) — overlay unmounts even if load events never fire.
- [ ] Canvas context failure (null context, etc.) degrades to the reduced-motion static variant, not a blank screen.
- [ ] Overlay is `pointer-events: none` and `aria-hidden` once exiting; while visible it carries `aria-busy` + a polite "Loading" announcement, matching current behavior.
- [ ] No `console` errors; CSP-compatible (no inline event handlers, no new external origins — current CSP is `script-src 'self' 'unsafe-inline' 'unsafe-eval'`).

---

## 8. Out of Scope

- **WebGL / Three.js / shaders** — documented alternative, deliberately rejected for bundle cost (see §5).
- **Sound design** — no boot-up audio; autoplaying sound on entry is a conversion killer.
- **Skip button** — sequence is ≤ 3s hard-capped; a skip control adds clutter for no real gain.
- **Per-route loaders** — this replaces the site-entry loader only; `CoreSpinLoader` remains for any in-app async states (it's a shared UI primitive — verify usages before deleting anything).
- **Return-visit skip / session storage "seen it" logic** — keep it simple; the sequence is short enough to replay. (Candidate fast-follow if it ever feels repetitive.)

---

## 9. Dependencies & Risks

### Dependencies
- None external. Uses existing stack: React 19, `motion` (already installed), existing CSS tokens in `app/globals.css`.
- Mount point unchanged: `app/layout.tsx:75`.

### Risks & mitigations
- **Risk:** Canvas paint blocks first paint on low-end devices.
  - **Mitigation:** Initialize canvas on `requestAnimationFrame` after mount; keep geometry to ≤ 42 edges; budget check in §6.
- **Risk:** Loader background flashes wrong theme before hydration.
  - **Mitigation:** Read theme from the same source `layout.tsx` uses (inline theme script / `data-theme` attribute) — verify during implementation.
- **Risk:** The wipe reveal fights the hero's own entrance animation.
  - **Mitigation:** Story 3 criterion — coordinate timing; hero entrance triggers on wipe start.

---

## 10. Open Questions (decided in best-guess mode — override anytime)

| # | Question | Decision taken | Override if… |
|---|----------|----------------|--------------|
| 1 | Three.js vs hand-rolled canvas? | **Hand-rolled Canvas 2D projection** — zero deps, ~120 lines, craft signal | You want free camera moves, shading, or particle fields — then Three.js (~600KB) becomes justified |
| 2 | Exit style? | **Split-wipe (top/bottom panels part)** specced as primary, iris-out as builder's alternative | You prefer the iris — both are specced, pick at build time |
| 3 | Keep the old `CoreSpinLoader`? | **Keep** as an in-app async spinner if it has other usages; the entry loader is what changes | If it's used nowhere else, delete it |
| 4 | Min display time? | **~1.4s** (down from 1.5s) — long enough to register the boot, short enough to never annoy | If the boot log reads as rushed, bump to 1.8s |

---

## Handoff

Implementation source of truth: this file. Suggested build order: Story 1 → Story 5 (failsafe) → Story 2 → Story 3 → Story 4. Verify with `npm run lint`, `npm run build`, and a Playwright pass at `localhost:3000` checking timing budgets and reduced-motion variant.
