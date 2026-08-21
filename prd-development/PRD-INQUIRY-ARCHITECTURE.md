# Project Inquiry Architecture Consolidation PRD

**Status:** Draft — ready for implementation  
**Owner:** Imogen / Zentariph  
**Source:** Architecture review (Aug 14, 2026)  
**Last updated:** August 14, 2026

---

## 1. Executive Summary

We are consolidating the project inquiry stack in the Imogen freelance portfolio so that **one deep module** owns form behaviour, validation, and delivery — instead of two ~650-line form implementations, triplicated validation enums, and silent server failures. This initiative reduces maintenance cost on every future inquiry fix (consent, Turnstile, rate limits), eliminates client/server validation drift, and adds structured server logging without polluting the browser console. Expected impact: ~650 lines deleted, single seam for tests, and production failures that are diagnosable instead of invisible.

---

## 2. Problem Statement

### Who has this problem?

- **Imogen / maintainer** shipping inquiry UX and security fixes
- **Future AI or human developers** navigating the codebase
- **Operations** debugging failed inquiries in production (Redis, Turnstile, Resend)

### What is the problem?

The inquiry feature grew through parallel paths and layered security without consolidating seams:

1. **Duplicate UI modules** — `ProjectInquiryForm.tsx` (642 lines, active) and `inquire/InquireForm.tsx` (656 lines, dead path) implement the same 5-step flow; only the dead path uses `useProjectInquiryForm`.
2. **Validation triplication** — `lib/project-inquiry.ts`, `app/api/project-inquiry/route.ts`, and form/hook each define overlapping rules. Server includes `"Branding"` in `projectTypes`; client does not.
3. **Shallow API module** — `route.ts` (332 lines) orchestrates origin checks, rate limits, body parsing, Turnstile, validation, and Resend in one `POST` export.
4. **Silent failures** — 12+ empty `catch { }` blocks return generic 503/502 with zero server logs. Browser console is clean (good); observability is absent (bad).
5. **Dead artifacts** — `InquiryTrustPanel`, `inquire/InquireSection`, unused `HomeSections` exports add navigation noise.

### Why is it painful?

| Stakeholder | Pain |
|-------------|------|
| Maintainer | Every inquiry fix risks landing in the wrong file or twice |
| Developer | Understanding inquiry requires bouncing across 8+ files with no single interface |
| Operations | "Inquiry delivery unavailable" gives no scope (rate limit? Redis? Turnstile? Resend?) |
| Prospective client | Indirect — drift bugs could reject valid submissions |

### Evidence

| Source | Finding |
|--------|---------|
| Architecture review (Aug 2026) | Two ~650-line inquiry modules; hook used by dead path only |
| `app/api/project-inquiry/route.ts:11–20` | Inline `projectTypes` Set includes `"Branding"` — not in `inquiryProjectTypes` |
| Code audit | Zero `console.*` in app code; 5 silent catches in API route, 1 in middleware |
| Recent commits | `f3df5cf` consent/Turnstile, `6eeb00b` rate limiting, `314c91b` inquiry UX — all inquiry hot spots |
| Line counts | `ProjectInquiryForm` 642 + `InquireForm` 656 + `route.ts` 332 + hook 195 |

---

## 3. Target Users & Personas

### Primary persona: Maintainer Imogen

- **Role:** Solo developer / site owner
- **Goal:** Ship inquiry improvements once, confidently
- **Pain:** Duplicate forms mean double the diff on every consent or Turnstile change
- **JTBD:** *When I fix the inquiry flow, I want one module to change so I don't miss the parallel copy.*

### Secondary persona: Implementation agent (AI or contractor)

- **Role:** Executes features from PRD/handoff
- **Goal:** Find the inquiry seam quickly and test through one interface
- **JTBD:** *When I implement inquiry work, I want a single validation module and form hook so I don't re-litigate rules.*

### Tertiary persona: Future ops / on-call

- **Role:** Diagnoses production inquiry failures
- **Goal:** Know whether Redis, Turnstile, or Resend failed
- **JTBD:** *When inquiries fail, I want scoped server logs — not a browser dev console panel.*

---

## 4. Strategic Context

### Business goals

| Goal | How this PRD supports it |
|------|--------------------------|
| Reliable lead capture | Fewer validation drift bugs; better failure diagnosis |
| Faster iteration on inquiry UX | Single form module + shared validation |
| Sustainable solo maintenance | Depth at clean seams; delete ~650 lines of duplication |

### Why now?

- Inquiry security and consent work just landed — the next fix will hit duplicate code immediately
- No `CONTEXT.md` or ADRs yet; consolidating now prevents more entanglement
- Performance PRD is separate; this is the highest-leverage **correctness/maintainability** gap

### Competitive landscape

Not applicable — internal engineering quality initiative.

---

## 5. Solution Overview

Four implementation phases. **No visual redesign** unless wiring `InquiryTrustPanel` is explicitly chosen. **No browser dev console panel** — server-only logging.

### Phase 1 — Unify inquiry UI (ship first)

| # | Deliverable |
|---|-------------|
| 1.1 | Refactor `ProjectInquiryForm` to consume `useProjectInquiryForm` for all state, validation, and submit logic |
| 1.2 | Delete `components/inquire/InquireForm.tsx`, `InquireSection.tsx`, and `components/inquire/` if empty |
| 1.3 | Decision: wire `InquiryTrustPanel` into `InquirySection` **or** delete trust panel + CSS |

### Phase 2 — Single validation seam

| # | Deliverable |
|---|-------------|
| 2.1 | Export canonical `projectTypeValues`, `teamSizeValues`, `timelineValues` from `lib/project-inquiry.ts` |
| 2.2 | Add `parseInquiryPayload(raw: unknown)` returning `{ ok: true, data } \| { ok: false, error }` |
| 2.3 | API route delegates validation to `parseInquiryPayload`; remove inline Sets and duplicate `emailPattern` |
| 2.4 | Hook/form step validation imports same constants; remove `"Branding"` orphan or add to client (default: **remove**) |

### Phase 3 — Server logging module

| # | Deliverable |
|---|-------------|
| 3.1 | Add `lib/logger.ts` — `logError(scope, error, meta?)` server-only |
| 3.2 | Replace empty catches in `middleware.ts`, `route.ts`, `lib/api-security.ts` with scoped logs |
| 3.3 | Production: structured JSON to stdout; development: readable format. **No client bundle import.** |

### Phase 4 — Deepen delivery module (optional, after 1–3)

| # | Deliverable |
|---|-------------|
| 4.1 | Extract `lib/inquiry-delivery.ts` (Resend send + idempotency) |
| 4.2 | Extract `lib/turnstile.ts` (verify token) |
| 4.3 | Extract `lib/inquiry-body.ts` (readBody + size cap) |
| 4.4 | Route becomes thin orchestrator (~80 lines) |
| 4.5 | Document edge vs route security contract; single `MAX_BODY_BYTES` constant |

### User flow (unchanged for visitors)

```
Visit / or /inquire → 5-step inquiry form
                  → Cookie consent → Turnstile (if configured)
                  → Submit → POST /api/project-inquiry
                  → Email via Resend → success message
```

### Key technical decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Validation library | Plain TypeScript in `lib/project-inquiry.ts` | No new dependency; matches existing patterns |
| Form presentation | Keep `ProjectInquiryForm` styling (active path) | `InquireForm` Tailwind variant is dead |
| Trust panel | Delete unless owner wants it wired | Zero imports today |
| Client logging | None | Clean browser console is correct |
| Server logging | `lib/logger.ts` at error seams | Two adapters later: stdout + Sentry (out of scope) |
| Home composition | Defer (Phase 5 / speculative) | Low pain vs inquiry duplication |

---

## 6. Success Metrics

### Primary metric

**Inquiry module count** (form implementations that own submit logic)

| | Value |
|---|-------|
| Current | 2 (`ProjectInquiryForm` inline + `InquireForm` via hook) |
| Target | **1** (`ProjectInquiryForm` → `useProjectInquiryForm`) |

### Secondary metrics

| Metric | Current | Target |
|--------|---------|--------|
| Duplicate inquiry form lines | ~1,298 | **≤ 700** (one form + hook) |
| Validation definition sites | 3 | **1** (`parseInquiryPayload`) |
| Silent `catch { }` in inquiry path | 6+ | **0** (all log via `logError`) |
| Dead inquiry files | 3–4 | **0** |
| Client `console.*` calls | 0 | **0** (guardrail) |

### Guardrail metrics

| Metric | Threshold |
|--------|-----------|
| Inquiry form E2E | Submit still works with phone, email fallback, thesis budget, Turnstile |
| Rate limiting behaviour | Unchanged — same 429/503 responses to clients |
| Visual parity | Form on `/` and `/inquire` looks identical before/after Phase 1 |
| Bundle size | No increase from refactor (delete ≥ as much as add) |

---

## 7. User Stories & Requirements

### Epic hypothesis

> We believe that collapsing duplicate inquiry modules and unifying validation at one seam will cut inquiry fix effort by half and eliminate client/server drift because recent commits already touch both form paths. We'll measure success by a single form module, one `parseInquiryPayload`, and zero silent catches in the inquiry delivery path.

---

### Phase 1 stories

#### Story 1.1 — Unify form on hook

**As a** maintainer, **I want** `ProjectInquiryForm` to use `useProjectInquiryForm`, **so that** inquiry logic lives in one place.

**Acceptance criteria:**
- [ ] `ProjectInquiryForm` imports and uses `useProjectInquiryForm` for step state, validation, consent, captcha, submit
- [ ] Presentation/styling of active form preserved (compact mode on home, full on `/inquire`)
- [ ] All steps work: project types, team, budget (standard + thesis + custom), timeline, contact (phone + email fallback)
- [ ] Turnstile + cookie consent flow unchanged
- [ ] Success and error states unchanged

---

#### Story 1.2 — Remove dead inquiry UI

**As a** developer, **I want** unreachable inquiry files deleted, **so that** I don't edit the wrong module.

**Acceptance criteria:**
- [ ] `components/inquire/InquireForm.tsx` deleted
- [ ] `components/inquire/InquireSection.tsx` deleted
- [ ] `components/inquire/` directory removed if empty
- [ ] `npm run build` passes; no broken imports
- [ ] Grep confirms no references to `InquireForm` or `InquireSection`

---

#### Story 1.3 — Resolve trust panel

**As a** maintainer, **I want** a clear decision on `InquiryTrustPanel`, **so that** dead UI doesn't linger.

**Acceptance criteria (option A — delete, default):**
- [ ] `InquiryTrustPanel.tsx` and `.module.css` deleted
- [ ] No references remain

**Acceptance criteria (option B — wire):**
- [ ] `InquirySection` renders `InquiryTrustPanel` beside form on `/inquire`
- [ ] Visual QA on desktop and mobile

---

### Phase 2 stories

#### Story 2.1 — Canonical validation constants

**As a** maintainer, **I want** one source for inquiry enums, **so that** client and server cannot drift.

**Acceptance criteria:**
- [ ] `projectTypeValues`, `teamSizeValues`, `timelineValues` exported from `lib/project-inquiry.ts`
- [ ] `inquiryProjectTypes` derived from `projectTypeValues` (or vice versa)
- [ ] `"Branding"` removed from server-only list (unless product decision to add to client)
- [ ] API route inline Sets removed

---

#### Story 2.2 — parseInquiryPayload module

**As a** maintainer, **I want** a pure parse function for API bodies, **so that** validation is testable without HTTP.

**Acceptance criteria:**
- [ ] `parseInquiryPayload(raw: unknown)` in `lib/project-inquiry.ts`
- [ ] Returns discriminated union: success with normalized payload **or** error with safe client message
- [ ] Covers: project types, budgets (standard/thesis/custom), team, timeline, phone/email (at least one), website normalization, consent flag, field length limits
- [ ] API route uses `parseInquiryPayload`; returns 400 with same error messages as today where possible
- [ ] Hook step validation uses same constants (budget helpers already shared)

---

### Phase 3 stories

#### Story 3.1 — Server logger module

**As** ops, **I want** scoped error logs when inquiry delivery fails, **so that** I can diagnose without browser console noise.

**Acceptance criteria:**
- [ ] `lib/logger.ts` exports `logError(scope: string, error: unknown, meta?: Record<string, string>)`
- [ ] Server-only — never imported from `"use client"` modules
- [ ] Scopes include at minimum: `rate-limit`, `turnstile`, `inquiry-delivery`, `middleware`
- [ ] Does not log PII (no full phone/email/body in logs)
- [ ] No `console.log` added to client components

---

#### Story 3.2 — Replace silent catches

**As** ops, **I want** every swallowed error in the inquiry path to log, **so that** 503s are explainable.

**Acceptance criteria:**
- [ ] `middleware.ts` catch logs `rate-limit` scope
- [ ] `app/api/project-inquiry/route.ts` catches log: fingerprint, rate-limit, turnstile, delivery
- [ ] Client-facing error messages unchanged
- [ ] `lib/api-security.ts` catches log if they mask real failures (evaluate case-by-case)

---

### Phase 4 stories (optional)

#### Story 4.1 — Extract delivery adapters

**Acceptance criteria:**
- [ ] `sendInquiryEmail` moved to `lib/inquiry-delivery.ts`
- [ ] `verifyTurnstileToken` moved to `lib/turnstile.ts`
- [ ] `readBody` moved to `lib/inquiry-body.ts`
- [ ] `POST` handler ≤ 100 lines orchestration
- [ ] `MAX_BODY_BYTES` defined once, imported by middleware + body module

---

#### Story 4.2 — Security contract comment

**Acceptance criteria:**
- [ ] Comment block or `lib/api-security-contract.ts` documents what edge guarantees vs route guarantees
- [ ] Middleware error messages generic (`"Invalid request origin"` not inquiry-specific) if new API routes added later

---

### Constraints

- **No new runtime dependencies** without approval (no Zod unless explicitly approved)
- **Preserve** inquiry API response shapes, rate limit headers, Turnstile behaviour
- **Preserve** client bundle free of `console.*`
- **No production deploy** without owner approval
- Follow `AGENTS.md` — read Next.js 16 docs before API changes
- **File ceiling:** keep modules under 400 lines; split if form still exceeds after hook extraction

### Edge cases

| Case | Expected behaviour |
|------|-------------------|
| Thesis-only project type | Thesis budget required; standard budget skipped |
| Mixed thesis + other types | Both budget fields validated |
| Custom budget amount | `Enter specific amount` + valid ₱ amount |
| Email instead of phone | `useEmailInstead` toggle; server accepts email-only |
| Turnstile not configured | Form submits without captcha (existing `isTurnstileConfigured`) |
| Redis unavailable | 503 to client + `rate-limit` log server-side |
| Resend failure | 502 to client + `inquiry-delivery` log |

---

## 8. Out of Scope

| Item | Reason |
|------|--------|
| Browser dev console / debug panel | Not needed; server logs are the gap |
| Sentry / external APM integration | Future adapter; stdout logging only in this PRD |
| Zod / new validation library | Avoid dependency unless approved |
| Visual redesign of inquiry form | Consolidation only |
| Inquiry API behaviour changes | Same limits, same responses |
| Home page composition cleanup | Speculative; separate initiative |
| Performance PRD work | See `PRD.md` |
| E2E test suite | No test infra today; manual verification |
| `CONTEXT.md` / ADR creation | Optional follow-up from grilling loop |

---

## 9. Dependencies & Risks

### Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Working inquiry flow in production | Done | Recent commits stable |
| Resend + Turnstile env vars | Imogen | `check:production` script exists |
| Upstash Redis (prod rate limits) | Imogen | Required for rate-limit tests in staging |

### Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hook refactor breaks compact home form | Medium | High | Manual test `/` and `/inquire`; compare before/after screenshots |
| parseInquiryPayload changes error messages | Medium | Medium | Map errors to existing strings; test invalid payloads |
| Logger leaks PII | Low | High | Log scopes + error names only; no body fields |
| Deleting trust panel loses wanted UI | Low | Low | Confirm with owner; default delete |
| Phase 4 over-scopes | Medium | Medium | Ship Phases 1–3 first; Phase 4 only if time |

---

## 10. Open Questions

| # | Question | Proposed default | Decision |
|---|----------|------------------|----------|
| 1 | Delete or wire `InquiryTrustPanel`? | Delete | _TBD_ |
| 2 | Remove `"Branding"` from server or add to client? | Remove | _TBD_ |
| 3 | Phase 4 in same PR or follow-up? | Follow-up after 1–3 verified | _TBD_ |
| 4 | Add Zod for validation? | No — plain TS | _TBD_ |
| 5 | Home `HomeSections` cleanup in same initiative? | No — defer | _TBD_ |

---

## Implementation sequence

```
Phase 1 (ship first) ─────────────────────────────────────
  1.1 Unify ProjectInquiryForm on hook
  1.2 Delete dead inquire/ path
  1.3 Resolve InquiryTrustPanel
  → Verify: build, lint, manual submit on / and /inquire

Phase 2 ────────────────────────────────────────────────────
  2.1 Canonical constants
  2.2 parseInquiryPayload
  → Verify: invalid payloads return same 400s; valid submit works

Phase 3 ────────────────────────────────────────────────────
  3.1 lib/logger.ts
  3.2 Replace silent catches
  → Verify: induce failure (bad Redis URL locally) → log appears, client gets 503

Phase 4 (optional) ─────────────────────────────────────────
  4.1 Extract delivery modules
  4.2 Security contract doc
  → Verify: route.ts ≤ 100 lines; build + lint green
```

---

## Related documents

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_HANDOFF-INQUIRY-ARCHITECTURE.md](./IMPLEMENTATION_HANDOFF-INQUIRY-ARCHITECTURE.md) | Agent execution brief |
| [PRD.md](./PRD.md) | Separate performance initiative |
| Architecture review HTML | Aug 14, 2026 temp report |
