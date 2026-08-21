# Dev Compile Performance & Middleware→Proxy Migration PRD

> Status: **Plan only — no implementation done yet.**
> Stack: Next.js `16.2.12`, React `19.2.4`, Tailwind v4, `motion` v12, `lucide-react` v1. Windows 11 dev host.

## 1. Executive Summary

We're improving local **dev compile speed** for the portfolio app (currently `✓ Ready in ~9.7s` plus a visible per-route `○ Compiling` stall) so the developer gets sub-second hot compiles and a faster cold boot. In the same pass we migrate the deprecated `middleware.ts` convention to the new `proxy.ts` convention required by Next.js 16, resolving the deprecation warning and future-proofing the API-hardening layer.

## 2. Problem Statement

### What is the problem?
- Cold boot is ~9.7s and the first hit to `/` shows a long `○ Compiling / ...` pause.
- A deprecation warning fires on every boot: *"The `middleware` file convention is deprecated. Please use `proxy` instead."*

### Why is it painful?
- Slow feedback loop on every restart and on the first visit to each route hurts iteration speed.
- The deprecation warning is noise now and a hard break in a future Next.js major.

### Evidence (from repo inspection)
- `next dev` script has **no explicit `--turbopack` flag** and `next.config.ts` sets **no `experimental.optimizePackageImports`**.
- `motion` (Framer Motion v12, a large package) is imported in **5 client components** (`AnimatedSection`, `Header`, `FeaturedProjectCarousel`, `HomeTestimonialsStack`, `ProjectFilters`).
- `lucide-react` is barrel-imported across **~20 files** (`import { X } from "lucide-react"`).
- `middleware.ts` exists at repo root with `export async function middleware(...)` and `config.matcher = "/api/:path*"`.
- Windows host: `node_modules` filesystem scanning + antivirus is a known multiplier on cold compile.

## 3. Target User

Primary: **the solo developer** running the app locally (`terddy`). Secondary: any future contributor / CI cold builds.

## 4. Strategic Context / Why Now

Next.js 16 already deprecated `middleware`; doing the proxy migration now (small, mechanical) avoids a forced rush later and pairs cleanly with the perf work since both touch boot-time config. Faster dev loops compound across every future change to this actively-evolving inquiry/portfolio codebase.

## 5. Solution Overview

Four independent, low-risk workstreams. Each is verifiable on its own; ship in order.

### 5.1 — Migrate `middleware.ts` → `proxy.ts` (required by Next 16)
- Prefer the official codemod: `npx @next/codemod@canary middleware-to-proxy .`
  - It renames the file **and** the exported function (`middleware` → `proxy`).
- Manual equivalent if the codemod is not desired:
  - Rename `middleware.ts` → `proxy.ts` (same repo-root location, sibling to `app/`).
  - Rename `export async function middleware(request)` → `export async function proxy(request)`.
  - Keep `export const config = { matcher: "/api/:path*" }` unchanged.
  - No logic changes — the request-hardening body (method/origin/content-length/content-type checks + `consumeRateLimit`) stays identical.
- Note: Proxy defaults to the **Node.js runtime** in v16 (the current file already relies on Node APIs via `getClientFingerprint`/rate-limit, so this is compatible). Do **not** add a `runtime` config to the proxy file — it throws.
- `experimental.proxyClientMaxBodySize: "16kb"` in `next.config.ts` is already the new-name flag; leave it.

### 5.2 — Confirm/force Turbopack for dev
- Next 16 uses Turbopack for `next dev` by default, but make it explicit and greppable: set `"dev": "next dev --turbopack"`.
- Verify the boot banner reports Turbopack; if a webpack fallback is happening it silently costs seconds.

### 5.3 — Enable `optimizePackageImports` for heavy barrels
- Add to `next.config.ts` under `experimental`:
  ```ts
  optimizePackageImports: ["lucide-react", "motion"],
  ```
- This rewrites barrel imports to per-module imports so the compiler stops pulling the entire icon set / animation library on every route touch. `lucide-react` is often covered by Next's default list, but `motion` (the new package name) should be declared explicitly.

### 5.4 — Reduce eager `motion` cost (measure first, then optimize)
- `motion/react-client` (used in `Header`, `AnimatedSection`) pulls the client runtime into otherwise-light components. After 5.2/5.3, **measure** whether `/` compile is still slow before refactoring.
- If still slow: lazy-load the heaviest animation-only components (e.g. `ProjectFilters`, `FeaturedProjectCarousel`) via `next/dynamic` so `motion` is not in the critical first-compile path of the landing route.
- This step is **conditional** — do not pre-optimize if 5.2 + 5.3 already hit the target.

## 6. Success Metrics

| Metric | Current | Target |
|---|---|---|
| Deprecation warning on boot | present | **gone** |
| Cold `✓ Ready` | ~9.7s | ≤ 6s (best-effort on Windows) |
| First `/` compile (`○ Compiling`) | multi-second stall | noticeably reduced / sub-second warm |
| Hot recompile after edit | — | sub-second |

Guardrails (must NOT regress):
- `next build` (production) still succeeds.
- API hardening behavior unchanged: 405/403/413/415/429 responses and rate limiting on `/api/*` still fire identically.
- No visual/animation regression on home, inquiry, testimonials pages.

## 7. Requirements & Acceptance Criteria

**Story A — Proxy migration**
- [ ] `proxy.ts` exists at repo root; `middleware.ts` removed.
- [ ] Exported function named `proxy`; `config.matcher` preserved as `/api/:path*`.
- [ ] Boot log no longer shows the middleware-deprecation warning.
- [ ] Manual check: POSTing invalid origin / oversized body / non-JSON / flooding `/api/project-inquiry` still returns 403 / 413 / 415 / 429 respectively.

**Story B — Turbopack explicit**
- [ ] `dev` script includes `--turbopack`; boot banner confirms Turbopack.

**Story C — Package import optimization**
- [ ] `experimental.optimizePackageImports` includes `lucide-react` and `motion`.
- [ ] App renders with no missing-icon / missing-export errors.

**Story D — Conditional motion lazy-load**
- [ ] Only if targets unmet after B+C: heaviest motion components dynamically imported; home route visually identical.

## 8. Out of Scope
- Upgrading Next.js / React versions.
- Production runtime/CDN performance, image pipeline, or bundle-size-for-users work (this PRD is **dev-loop** focused).
- Replacing `motion` or `lucide-react` with lighter libraries.
- Antivirus/Windows Defender exclusion config (mention to user as an optional host-level win, not a code change).

## 9. Dependencies & Risks
- **Risk:** Codemod touches an unexpected file. **Mitigation:** run on clean git state, review the diff, it should only affect `middleware.ts`.
- **Risk:** `optimizePackageImports` on `motion` mis-resolves a subpath export. **Mitigation:** smoke-test all animated pages; remove `motion` from the list if any export breaks.
- **Dependency:** none external; all changes are local config + one file rename.

## 10. Open Questions
- Is the ~9.7s boot partly antivirus scanning `node_modules`? (Host-level; suggest a Defender exclusion for the repo dir as a free win — not part of code changes.)
- After B+C, is step D even necessary? (Decide by measurement, not assumption.)

## Verification Commands
```bash
# after changes
rtk npm run dev          # confirm: no deprecation warning, Turbopack banner, faster Ready
rtk next build           # production build still green
```
Then manually exercise `/api/project-inquiry` (bad origin, oversized, non-JSON, flood) to confirm proxy hardening is intact.
