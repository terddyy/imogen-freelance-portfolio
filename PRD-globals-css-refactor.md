# Globals.css Modularization — PRD

## 1. Executive Summary
`app/globals.css` has grown to 3,681 lines mixing theme tokens, shared layout, and five unrelated feature areas (inquiry flow, mobile nav, header, chatbot, footer/whatsapp/cookie-consent), violating this repo's 400-line file limit and making the cascade unreadable — `.siteHeader` alone is defined twice (line 275 and line 3300, the second intentionally overriding the first). We will split it into a trimmed `globals.css` (tokens/reset/truly-shared utilities, target ≤400 lines) plus one CSS Module per component, extracted via independent, non-overlapping workstreams so multiple people/agents can work in parallel without merge conflicts, each verified against a visual baseline before merge.

## 2. Problem Statement

**What is the problem?**
- `globals.css` mixes five feature domains that have nothing to do with each other: theme tokens/reset (L6–258), shared layout primitives (L260–1463), inquiry form (L1465–2893, ~1,400 lines), mobile nav (L2934–3296), a header redesign block that overrides an earlier header block (L3298–3484), and the chatbot (L3607–3669).
- `.siteHeader` is defined at L275 and redefined at L3300 under a comment `/* Reference-style hero update */`. Nothing marks which rules in the second block are overrides vs. duplicates vs. dead. Any edit to header styling requires reading both blocks and reasoning about cascade order across 3,000 lines of unrelated CSS in between.
- Every component (`Header.tsx`, `MobileNav.tsx`, `PortfolioChatbot.tsx`, `WhatsAppContact.tsx`, `CookieConsent.tsx`, `Footer.tsx`, `InquireForm.tsx`, etc.) currently reads global classNames as plain strings (`className="siteHeader"`), not CSS Modules — there's no ownership boundary preventing an unrelated change from silently breaking another feature's styling.
- The repo already establishes the target pattern: `HeroSection.module.css`, `InquirySection.module.css`, `ProcessSection.module.css`, etc. exist as colocated CSS Modules. `globals.css` is the one holdout.

**Why is it painful?**
- Exceeds the repo's 400-line file convention by 9x, blocking any automated file-size lint/review gate.
- One giant file means one merge-conflict surface: any two people touching CSS collide in the same file even for unrelated components.
- The duplicate `.siteHeader` definition is a landmine — a future edit to the first block silently does nothing because the second block wins the cascade.

**Evidence**
- `wc -l app/globals.css` → 3,681 lines.
- `grep -n "^\.siteHeader" app/globals.css` → two matches: line 275, line 3300.
- 8 existing `*.module.css` files in `components/` confirm CSS Modules is the established pattern for anything added post-`globals.css`.

## 3. Scope Note
This is an internal engineering/architecture refactor, not a user-facing feature — sections on personas, market sizing, and business OKRs are omitted as not applicable. The "user" here is the engineering team (and coding agents) working in this repo in parallel.

## 4. Solution Overview

### 4.1 End state
- `app/globals.css` trimmed to **≤400 lines**: Tailwind import, `:root` design tokens, `[data-theme]` overrides, reset/base element rules, and only classes truly shared across ≥3 unrelated features (`.shell`, `.srOnly` if present, `.primaryButton`/`.secondaryButton`, `.pageSection`, `.sectionHeading`, card primitives used by multiple route sections, etc.).
- New CSS Modules, colocated next to their component, matching the existing pattern:
  - `components/Header.module.css`
  - `components/Footer.module.css`
  - `components/MobileNav.module.css` (classes currently named `mobileDock*`)
  - `components/PortfolioChatbot.module.css`
  - `components/WhatsAppContact.module.css`
  - `components/CookieConsent.module.css`
  - `components/inquire/InquireForm.module.css` (or split further if the ~1,400-line inquiry block has sub-boundaries — confirm during Track A's own audit)
- Each component switches from `className="foo"` to `className={styles.foo}` (import `styles from "./X.module.css"`) as part of the same PR that moves its CSS — these two changes are inseparable and must land atomically per component.

### 4.2 Header cascade conflict — explicit resolution strategy
The `.siteHeader` block at L3300 (and its associated `[data-scrolled]`, `.navLinks`, `.headerCta` sub-rules through ~L3484) is the **authoritative, currently-rendered** version, since it appears later in source order and nothing after it overrides it again. Before any extraction:
1. Diff the L275 block against the L3300+ block property-by-property.
2. Capture the current computed styles of the live header (dev server + browser devtools, or a Playwright snapshot) as the ground-truth baseline.
3. Merge into a single authoritative rule set in `Header.module.css` — the merged rules must reproduce the L3300+ (later-wins) computed values exactly, not a blend.
4. Any property that exists only in the L275 block and is never overridden by L3300+ must still be included (it's live, just not fought over).
5. Delete both original blocks from `globals.css` only after the new module's rendered output is confirmed to match the baseline.

This is the single highest-risk step in the whole refactor and is called out as its own workstream (Track C) rather than folded into general header cleanup, so it gets a dedicated verification pass.

### 4.3 Parallel workstreams (non-overlapping ownership)

| Track | Owns (globals.css line ranges, subject to re-check since lines shift) | Deliverable | Components touched |
|---|---|---|---|
| **A — Inquiry** | ~1465–2893 (~1,400 lines) | `InquireForm.module.css` (+ split further if warranted) | `components/inquire/InquireForm.tsx`, `InquireSection.tsx`, `ProjectInquiryForm.tsx`, `ProjectInquiryTrigger.tsx` |
| **B — Mobile nav** | ~2934–3296 | `MobileNav.module.css` | `components/MobileNav.tsx` |
| **C — Header consolidation** | ~275–298 (first block) + ~3298–3484 (redesign block) — merge per §4.2 | `Header.module.css` | `components/Header.tsx` |
| **D — Chatbot** | ~3607–3669 | `PortfolioChatbot.module.css` | `components/PortfolioChatbot.tsx` |
| **E — Footer / WhatsApp / Cookie consent** | ~1030–1349, ~1136–1250 (cookie), ~1254–1349 (whatsapp) | `Footer.module.css`, `WhatsAppContact.module.css`, `CookieConsent.module.css` | `components/Footer.tsx`, `WhatsAppContact.tsx`, `CookieConsent.tsx` |
| **F — Globals trim & shared utilities** (runs last, after A–E land) | Everything remaining after A–E extraction | Slimmed `globals.css` | none directly; removes now-dead selectors |

Rules for parallel safety:
- Each track only edits its own CSS Module file(s) + its own component file(s). No track edits another track's component.
- Each track deletes only the rules it owns from `globals.css`, in its own PR — never a bulk delete of someone else's range. Deletions are additive/independent since each range is disjoint, so PRs from A–E can merge in any order without conflicting with each other in `globals.css` (git will show non-overlapping diff hunks).
- Track F is sequenced last because it needs A–E's deletions merged first to know what's actually left as "truly shared."
- Shared/ambiguous classes discovered mid-extraction (e.g., a class used by both Header and Footer) get flagged in the PR description and resolved by leaving them in `globals.css` for Track F to classify — no track silently claims a shared class into its own module.

### 4.4 Verification per workstream
Since this is a pure refactor (no intended visual/functional change), each track's PR must include:
1. Before/after screenshot (or Playwright snapshot) of the affected component in both light and dark theme, at desktop and mobile breakpoints where relevant (mobile nav, header `[data-scrolled]` state).
2. Confirmation that computed styles for the component's root class match pre-refactor values (devtools computed panel spot-check on 3–5 key properties, or automated visual diff if available).
3. `rtk grep` / manual check that no other component references the classNames being moved (guards against an untracked shared-class collision).
4. Manual interaction check for stateful components: header scroll state, mobile nav active tab, chatbot open/close, cookie consent dismiss, inquiry form step navigation.

## 5. Success Metrics
- **Primary:** `app/globals.css` line count ≤400 (from 3,681).
- **Secondary:**
  - Zero duplicate top-level selectors remaining in `globals.css` (currently ≥1: `.siteHeader`).
  - 6 new colocated `*.module.css` files exist, one per listed component.
  - No visual regression on any of: header (both scroll states, light/dark), mobile nav, chatbot, whatsapp contact, cookie consent, footer, inquiry form (all steps).
- **Guardrail:** No change to rendered DOM class output visible to users beyond the CSS Module hash suffix (i.e., no accidental styling change).

## 6. Out of Scope
- No visual/design changes — this is a structural refactor only.
- No change to `app/inquiry-light.css` (separate file, already scoped) unless a track discovers it also needs splitting — flag as a follow-up, don't fold in here.
- No introduction of a CSS-in-JS or Tailwind-only rewrite — CSS Modules matches the existing repo pattern and is the explicit choice per the requirements.
- No re-architecture of component logic/props — only `className` string → `styles.className` object access changes.

## 7. Dependencies & Risks

**Dependencies**
- Track F depends on A–E merging first.
- All tracks depend on a shared baseline (current `main`) — recommend each track branches from the same commit and rebases before merge to avoid the line-number ranges drifting mid-flight.

**Risks**
- **Risk:** A class is shared across two "owned" ranges undetected (e.g., `.projectFooter a` appears near the header block at L343 but is a footer-link style used inside nav). *Mitigation:* each track greps the full component tree for the class name before deleting it from `globals.css`, not just its "assigned" component.
- **Risk:** Header merge (§4.2) reproduces the wrong precedence and silently reverts to pre-"reference-style hero update" appearance. *Mitigation:* mandatory baseline screenshot comparison before Track C's PR is considered done; this is called out as the highest-risk track.
- **Risk:** Line ranges cited in this PRD shift as tracks land (each deletion changes downstream line numbers). *Mitigation:* ranges here are for initial orientation only — each track re-locates its rules by selector name/comment markers, not by line number, once work starts.

## 8. Open Questions
- Should the ~1,400-line inquiry block be split further than one `InquireForm.module.css` (e.g., separate files per inquiry step)? Leave to Track A's judgment once it audits the actual selector list.
- Is there an existing visual regression tool in this repo (Playwright already appears to be set up per `.playwright-mcp/` artifacts in git status)? If so, Track leads should reuse it instead of manual screenshot diffing.
