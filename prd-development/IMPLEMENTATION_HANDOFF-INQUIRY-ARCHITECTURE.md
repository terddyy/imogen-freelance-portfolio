# Implementation Handoff — Project Inquiry Architecture Consolidation

**PRD:** [PRD-INQUIRY-ARCHITECTURE.md](./PRD-INQUIRY-ARCHITECTURE.md)  
**Source:** Architecture review (Aug 14, 2026)

---

## Objective

Collapse duplicate inquiry UI modules onto `useProjectInquiryForm`, unify validation in `lib/project-inquiry.ts`, add server-only structured logging, and optionally deepen the API route — without changing visitor-facing inquiry behaviour or adding client `console.*` noise.

---

## Before you edit

1. Read `prd-development/PRD-INQUIRY-ARCHITECTURE.md` (acceptance criteria per story)
2. Read `AGENTS.md` — check `node_modules/next/dist/docs/` for Next.js 16 APIs
3. Inspect worktree: `git status`, `git diff`
4. Baseline: `npm run build && npm run lint`
5. Know the active path: `InquirySection` → `ProjectInquiryForm` (home + `/inquire`). Dead path: `inquire/InquireSection` → `InquireForm`.

---

## Phase 1 — do first

### 1.1 Unify `ProjectInquiryForm` on hook

**Files:** `components/ProjectInquiryForm.tsx`, `hooks/useProjectInquiryForm.ts`

- Move inline state/submit/validation from `ProjectInquiryForm` into hook usage (mirror what `InquireForm` already does)
- Keep existing CSS classes and `compact` prop behaviour
- Hook may need small extensions if `ProjectInquiryForm` has logic not yet in hook — extend hook, don't duplicate

### 1.2 Delete dead inquiry UI

**Delete:**
- `components/inquire/InquireForm.tsx`
- `components/inquire/InquireSection.tsx`
- `components/inquire/` (if empty)

**Verify:** `rg "InquireForm|InquireSection"` returns nothing

### 1.3 Trust panel decision

**Default — delete:**
- `components/InquiryTrustPanel.tsx`
- `components/InquiryTrustPanel.module.css`

**Alternative — wire into `components/InquirySection.tsx` only if PRD open question #1 says wire.**

### Phase 1 verification

```bash
npm run build
npm run lint
npm start
```

Manual checks:
- [ ] `/` — compact inquiry form: all 5 steps, submit
- [ ] `/inquire` — full inquiry form: all 5 steps, submit
- [ ] Phone path and email-fallback path
- [ ] Thesis / capstone budget path
- [ ] Turnstile + cookie consent (if env configured)

---

## Phase 2 — validation seam

### 2.1 Canonical constants

**File:** `lib/project-inquiry.ts`

- Export `projectTypeValues` array (source of truth)
- Derive `inquiryProjectTypes` labels from it
- Remove `"Branding"` from server unless product says add to client

### 2.2 `parseInquiryPayload`

**Files:** `lib/project-inquiry.ts`, `app/api/project-inquiry/route.ts`

- Add `parseInquiryPayload(raw: unknown)` with discriminated union result
- Move `normalizePhone`, `normalizeWebsite`, field validation from route into lib (or call existing helpers)
- Route: parse body → `parseInquiryPayload` → 400 on failure → existing delivery path on success
- Delete inline `teamSizes`, `timelines`, `projectTypes` Sets from route

### Phase 2 verification

```bash
npm run build
npm run lint
```

Manual invalid payload checks (curl or devtools):
- [ ] Missing project types → 400
- [ ] Invalid team size → 400
- [ ] Invalid website → 400
- [ ] Valid payload → 200 (with env configured)

---

## Phase 3 — server logging

### 3.1 `lib/logger.ts`

```typescript
// Server-only. Never import from "use client" modules.
export function logError(scope: string, error: unknown, meta?: Record<string, string>): void
```

- JSON line in production; readable in development
- No PII in meta

### 3.2 Replace silent catches

**Files:** `middleware.ts`, `app/api/project-inquiry/route.ts`, optionally `lib/api-security.ts`

- `catch (error) { logError("rate-limit", error); return json(...503) }`
- Scopes: `rate-limit`, `turnstile`, `inquiry-delivery`, `middleware-fingerprint`
- **Do not** add `console.log` to client components

### Phase 3 verification

- [ ] `rg "console\\." app components lib hooks middleware` — only `lib/logger.ts` (and scripts/)
- [ ] Temporarily break Redis URL → 503 to client + log line in terminal

---

## Phase 4 — optional deepen

| Extract | From | To |
|---------|------|-----|
| Body read + size cap | `route.ts` | `lib/inquiry-body.ts` |
| Turnstile verify | `route.ts` | `lib/turnstile.ts` |
| Resend send | `route.ts` | `lib/inquiry-delivery.ts` |
| `MAX_BODY_BYTES` | duplicated | `lib/inquiry-body.ts` or `lib/rate-limit-config.ts` |

Add security contract comment in `lib/api-security.ts` or new `lib/api-security-contract.ts`.

---

## Do not

- Deploy to production
- Add runtime dependencies (Zod, Sentry) without approval
- Add browser dev console / debug UI
- Change rate limit numbers or API response shapes
- Refactor performance PRD items unless required
- Log phone, email, or inquiry body content

---

## Report back with

1. Changed / deleted files list
2. Line count before/after for inquiry form + route
3. `npm run build` and `npm run lint` results
4. Manual test checklist (Phase 1)
5. Open questions resolved from PRD §10
6. Remaining risks
