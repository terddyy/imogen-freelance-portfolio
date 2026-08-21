# Implementation Handoff — Dev Compile Performance & Proxy Migration

Source of truth: `prd-development/PRD-DEV-PERFORMANCE.md`

## Phased task list

### Phase 1 — Proxy migration (required, mechanical)
1. Ensure clean git working state for `middleware.ts`.
2. Run `npx @next/codemod@canary middleware-to-proxy .` (or manually rename file + function).
3. Verify `proxy.ts` at root exports `proxy`, keeps `config.matcher = "/api/:path*"`, logic unchanged.
4. Delete `middleware.ts` if the codemod left it.
- **Verify:** boot shows no middleware-deprecation warning; `/api/project-inquiry` still returns 403/413/415/429 for bad origin/oversized/non-JSON/flood.

### Phase 2 — Turbopack explicit
1. In `package.json`, set `"dev": "next dev --turbopack"`.
- **Verify:** boot banner reports Turbopack.

### Phase 3 — optimizePackageImports
1. In `next.config.ts` `experimental`, add `optimizePackageImports: ["lucide-react", "motion"]`.
- **Verify:** app renders; no missing icon/export errors; measure `/` compile improvement.

### Phase 4 — Conditional motion lazy-load (ONLY if targets unmet)
1. Wrap heaviest motion-only components (`ProjectFilters`, `FeaturedProjectCarousel`) in `next/dynamic`.
- **Verify:** home visually identical; first `/` compile faster.

## Guardrails
- Do not change API-hardening logic, animation behavior, or library versions.
- Preserve all unrelated in-flight changes (the working tree has many modified files).
- No deploy / production actions.

---

**Handoff Prompt**

```text
You are continuing work in the imogen-freelance-portfolio Next.js 16 repo. Read prd-development/PRD-DEV-PERFORMANCE.md first, then inspect the current worktree (note: many files are already modified — do not touch them) and middleware.ts / next.config.ts / package.json before editing. Implement the dev-compile-performance and middleware→proxy migration in phases, using the PRD tasks and acceptance criteria as the source of truth. Read node_modules/next/dist/docs before writing Next-specific code — this Next.js has breaking changes vs training data. Preserve all unrelated changes. Do not deploy, restart production services, run migrations, or upgrade dependency versions unless explicitly approved. After implementation, run `npm run dev` (confirm no deprecation warning, Turbopack banner, faster Ready) and `next build` (must stay green), then manually exercise /api/project-inquiry (bad origin, oversized body, non-JSON, flood) to confirm proxy hardening is intact. Report changed files, checks run, measured Ready/compile times, blockers, and remaining risks.
```
