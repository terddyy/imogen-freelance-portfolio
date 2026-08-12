# Implementation plan — Inquiry trust & hardening

Plan-only. Executor must inspect the worktree before editing and preserve unrelated changes (performance, UI, images, etc.).

## Phase 0 — Safety & baseline

**Actions**

1. `git status --short` — note dirty files; do not revert unrelated work.
2. Read:
   - `app/api/project-inquiry/route.ts`
   - `components/ProjectInquiry.tsx`
   - `app/contact/page.tsx`
   - `app/layout.tsx` / footer if any for nav links
   - `next.config.ts`
   - `README.md`, `.env.example`
   - `AGENTS.md` + Next docs under `node_modules/next/dist/docs/` before Next-specific APIs
3. Confirm no existing `/privacy`, Turnstile, or consent fields.

**Commands:** `npm run lint` (baseline optional)

**Outcome:** Clear edit list; no production env changes yet.

**Stop:** If user has not approved adding Cloudflare (or alt) account/keys, implement privacy stories first and stub CAPTCHA behind env fail-closed with documented `.env.example` only.

---

## Phase 1 — Privacy contracts & copy

**Files (expected)**

- `app/privacy/page.tsx` (new)
- Possibly `lib/privacy-copy.ts` or inline content (prefer one place; avoid over-abstraction)
- `README.md` — short privacy/CAPTCHA env section
- `.env.example` — CAPTCHA keys placeholders

**Edits**

- Plain-language privacy page: purpose, fields, subprocessors, retention, deletion contact (`terd@zentariph.com` or owner-approved).
- Document new env vars; do not commit secrets.

**Outcome:** `/privacy` renders on desktop + mobile.

---

## Phase 2 — API hardening

**File:** `app/api/project-inquiry/route.ts`

**Edits**

1. After Origin check (improved), keep rate limit, then verify CAPTCHA token with provider API via `fetch` (timeout, `redirect: "error"`).
2. Require `consent === true` (boolean) in JSON body.
3. Origin policy (default):
   - If `Origin` present → must match `PUBLIC_SITE_ORIGIN` / request origin (existing).
   - If `Sec-Fetch-Site` is `cross-site` → 403.
   - Missing Origin still allowed for non-browser clients **only if** CAPTCHA + rate limit pass.
4. Production: missing CAPTCHA secret → 503 fail-closed.
5. Do not log tokens, API keys, or full PII.

**Commands:** manual `curl` tests (see acceptance).

**Stop:** Do not weaken Redis fail-closed behavior. Do not add Zod/npm unless user approves.

---

## Phase 3 — UI (form + contact)

**Files**

- `components/ProjectInquiry.tsx` (+ context types if inquiry shape lives elsewhere)
- `app/contact/page.tsx`
- Header/footer/nav only if a Privacy link already fits existing patterns (prefer contact + form link first; avoid nav clutter unless site already has legal links)

**Edits**

- Final step: privacy blurb, link to `/privacy`, required consent checkbox, Turnstile widget (Next `Script` or official approach — check current Next 16 docs).
- Include `consent` + captcha token in POST body.
- Client validation: cannot submit without consent + token (UX); server remains source of truth.
- Contact page: link to privacy near CTA.

**Outcome:** Submitter sees notice before contact details leave the browser.

---

## Phase 4 — CSP (incremental)

**File:** `next.config.ts`

**Edits**

- Extend CSP carefully: allow `'self'`, required font/CDN hosts, Turnstile domains.
- QA home, contact, inquiry open/submit, theme toggle.
- If breakage: narrow allowlist or temporarily report-only (document in PR).

**No DB migrations.**

---

## Phase 5 — Verify & docs

**Commands**

- `npm run lint`
- `npm run build`
- Manual QA from `ACCEPTANCE_CRITERIA.md`

**Docs:** Update `README.md` rate-limit/security section with CAPTCHA + privacy.

**Do not:** deploy, rotate prod keys, or push without user ask.

---

## Preserving unrelated changes

- Do not “fix” performance, carousel, proof gallery, or image format changes while in this package.
- Do not delete `prd-development/` performance PRD.
- Avoid reformatting untouched files.
