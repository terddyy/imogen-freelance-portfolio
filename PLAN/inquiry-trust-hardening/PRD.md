# Inquiry Trust & Hardening PRD

**Status:** Draft — ready for phased implementation  
**Owner:** Imogen / Zentariph  
**Source:** Security & compliance audit (2026-08-12); guided PRD Q1–Q2 then best-guess fill  
**Repo:** `imogen-freelance-portfolio` (Next.js 16.2.12 App Router)  
**Last updated:** August 12, 2026

---

## 1. Executive Summary

We're building **inquiry trust & hardening** for prospective clients who fill out Imogen's project inquiry form, so they understand how their phone/email is used and can consent before submitting—while the site owner gains stronger bot/abuse controls on top of the existing 5/10-minute Upstash rate limit. Impact: higher submitter trust, clearer PH Data Privacy Act posture, and lower spam/cost risk without changing the portfolio's marketing surface.

---

## 2. Problem Statement

### Who has this problem?

**Primary:** Prospective clients (inquiry submitters) sharing phone and/or email through the multi-step inquiry dialog.  
**Secondary:** Site owner (Imogen / operator) who receives Resend email + IPROG SMS and pays provider costs.

### What is the problem?

1. **No privacy clarity** — the form collects PII (phone/email, optional website, free-text project) and sends it to Resend (and a short alert via IPROG) with no privacy policy page and no in-form notice/consent.
2. **Trust friction** — the final contact step asks for personal details with no explanation of who receives data, retention, or how to request deletion.
3. **Abuse residual** — rate limiting exists, but there is no CAPTCHA/honeypot; Origin may be absent on scripted posts; CSP is only a framing/base/object baseline.

### Why is it painful?

| Stakeholder | Pain |
|-------------|------|
| Submitter | Unclear what happens to their number/email; may abandon or use WhatsApp/email instead |
| Owner | Harder to claim good privacy practice; residual bot cost via Resend/IPROG |
| Business | Portfolio credibility gap on a contact path that should feel professional and safe |

### Evidence (repo)

- Only mutable API: `app/api/project-inquiry/route.ts` (`POST`)
- Client form: `components/ProjectInquiry.tsx` — no privacy/consent strings (grep empty)
- Contact page: `app/contact/page.tsx` — CTA only; no privacy link
- Rate limit already: 5 req / 10 min / hashed IP; fail-closed Redis in production
- Secrets/subprocessors documented in `README.md` and `.env.example`
- No `/privacy` route; no Turnstile/hCaptcha/honeypot

> **Assumption (best guess):** Submitter pain is both clarity and trust; we optimize copy and UX for them first, then owner-side abuse controls.

---

## 3. Target Users & Personas

### Primary — Prospective Client Pat

- Founder / thesis student / small team lead considering a build with Imogen
- Tech savviness: mixed; comfortable with WhatsApp and forms
- Goals: get a clear next step without leaking contact details into an opaque pipeline
- Pain: “Who sees my number? Will I get spammed?”
- JTBD: *When I share project details, I want to know how my contact info is used so I can decide whether to submit.*

### Secondary — Operator Imogen

- Receives inquiries by email + SMS
- Goals: real leads only; stay compliant enough for PH freelance practice
- JTBD: *When bots or scrapers hit the form, I want cost and inbox noise contained without blocking real clients.*

---

## 4. Strategic Context

### Business goals

- Protect brand trust on the highest-intent conversion path (inquiry).
- Reduce compliance gap before wider promotion of the portfolio.
- Keep Resend/IPROG spend predictable.

### Why now?

Security audit found **no medium+ CVEs**, but called out privacy copy and bot economics as the next production polish. Rate limiting is already production-ready; privacy + CAPTCHA are the missing trust layers.

### Competitive / market

> **Assumption:** Peer freelancers in PH increasingly show privacy notices on contact forms; absence reads as “early / unfinished,” not “minimal.”

### Not this PRD

Performance work is tracked separately in `prd-development/` (Lighthouse / payload). Do not merge scopes.

---

## 5. Solution Overview

### High-level

1. **Privacy page** (`/privacy`) explaining purpose, data collected, subprocessors (Resend, IPROG, Upstash, host), retention (no app DB — mailbox/provider logs), and how to request deletion.
2. **In-form notice + consent** on the final inquiry step (and a short link from contact page): submitters see who gets what before phone/email is sent; submit requires acknowledging the notice.
3. **Server-verified bot challenge** (prefer Cloudflare Turnstile — free, privacy-friendlier default) verified in `POST /api/project-inquiry` before delivery.
4. **Stricter browser origin policy**: reject requests that look like cross-site browser posts; keep rate limit for non-browser scripts.
5. **Incremental CSP** expansion that does not break `next/font`, Motion, or Turnstile widgets.

### User flow (submitter)

```text
Open inquiry → steps 0–3 (unchanged) → step 4 (contact)
  → see short privacy notice + link to /privacy
  → complete Turnstile (invisible or managed widget)
  → acknowledge consent → Submit
  → API: Origin/Sec-Fetch check → rate limit → CAPTCHA verify → validate → Resend+IPROG
```

### Key features

| Feature | Priority |
|---------|----------|
| `/privacy` page | P0 |
| Form notice + required consent on final step | P0 |
| Contact page link to privacy | P0 |
| Turnstile (or approved CAPTCHA) server verify | P0 |
| Stricter Origin / Sec-Fetch-Site | P1 |
| CSP tighten | P1 |
| Honeypot field | P2 (optional if Turnstile ships) |

---

## 6. Success Metrics

### Primary

**Submitter trust clarity:** privacy notice visible on the contact step before submit; consent required.  
Proxy measure (manual): 100% of successful submits require consent + valid CAPTCHA token (server-enforced).

### Secondary

- Bot/abuse: spam inquiry rate / unexpected SMS volume down (baseline = owner judgment first 30 days).
- Conversion guardrail: inquiry completion rate does not drop >15% week-over-week after launch (**assumption** — no analytics yet; owner watches qualitatively).
- Support: fewer “who has my number?” / uncomfortable-contact questions (qualitative).

### Guardrails

- Do not weaken existing rate limit fail-closed behavior.
- Do not put secrets in client bundles.
- Do not add npm deps without explicit approval (Turnstile is script + server `fetch` only).

---

## 7. User Stories & Requirements

### Epic hypothesis

We believe that adding clear privacy notice/consent and server-verified bot protection on the inquiry path will increase submitter trust and reduce spam cost because the form currently ships PII with no transparency and only IP rate limits. We’ll know it works when consent + CAPTCHA are enforced server-side and real inquiries still complete.

### Story A — Privacy policy page

As a prospective client, I want a readable privacy page so I know who processes my inquiry data.

**Acceptance criteria:** see `ACCEPTANCE_CRITERIA.md` § Privacy page.

### Story B — In-form notice & consent

As a prospective client, I want to see and acknowledge how my contact details are used before submit.

### Story C — Server-verified CAPTCHA

As the site operator, I want automated posts without a valid challenge to fail so Resend/IPROG aren’t burned.

### Story D — Stricter Origin policy

As the site operator, I want cross-site browser posts rejected while same-origin inquiry still works.

### Story E — CSP incremental harden

As a maintainer, I want a stronger CSP that still allows fonts, Motion, and CAPTCHA without breaking the site.

### Constraints & edge cases

- At least one of phone or email still required (existing rule).
- Rate limit still runs; CAPTCHA failure should not skip rate limit accounting (**decision:** consume rate limit before CAPTCHA verify — same order as today vs body parse — or after Origin, before expensive provider calls; prefer: Origin → rate limit → CAPTCHA → validate → deliver).
- Turnstile site key is public; secret key is server-only.
- If CAPTCHA env missing in production → fail closed (503), mirroring Redis policy.
- Dual delivery (email + SMS) success gate unchanged.
- Preserve unrelated dirty worktree changes (performance, UI, etc.).

---

## 8. Out of Scope

- Full legal counsel opinion / formal DPA registration filings
- Auth, accounts, CRM, inquiry database, admin dashboard
- Newsletter, payments, booking calendars
- Replacing Resend or IPROG
- Changing rate limit numbers (5/10m) unless abuse data demands it later
- Performance optimization (separate PRD under `prd-development/`)
- Analytics instrumentation (optional later)
- Mobile-app push / WhatsApp Business API automation

---

## 9. Dependencies & Risks

### Dependencies

| Dependency | Notes |
|------------|-------|
| Cloudflare Turnstile (or approved alt) | Site key + secret; domain allowlist |
| Existing Upstash / Resend / IPROG | Must keep working |
| `PUBLIC_SITE_ORIGIN` | Needed for Origin checks |
| Copy approval | Privacy text must be accurate for PH practice |

### Risks & mitigations

| Risk | Mitigation |
|------|------------|
| CAPTCHA hurts conversion | Prefer managed/invisible Turnstile; watch completion qualitatively |
| CSP breaks fonts/widget | Ship CSP in report-only first **or** incremental allowlist with manual QA |
| Over-strict Origin blocks legitimate clients | Allow same-origin + matching `PUBLIC_SITE_ORIGIN`; document curl/dev behavior |
| Privacy copy inaccurate | Keep language plain; list only real subprocessors; owner reviews before prod |
| New npm dependency creep | Forbid unless user approves; use native `fetch` + script tag / Next Script |

---

## 10. Open Questions

| # | Question | Default (best guess) until decided |
|---|----------|-------------------------------------|
| 1 | Turnstile vs hCaptcha vs honeypot-only? | **Turnstile** |
| 2 | Consent = checkbox vs “By submitting you agree…”? | **Explicit checkbox** (stronger for DPA narrative) |
| 3 | Privacy page tone — legalistic vs plain? | **Plain language** |
| 4 | Require `Origin` always, or allow missing Origin for scripts? | **Allow missing Origin** but require CAPTCHA + rate limit; reject mismatched Origin / cross-site Sec-Fetch-Site |
| 5 | CSP report-only first? | **Direct enforce with minimal additions** if QA passes; else report-only |
| 6 | Retention period to publish? | **“Inquiries kept in email/SMS provider logs until deleted on request”** — no fixed days unless owner sets one |

---

## Assumptions to validate

1. Submitter pain is clarity + trust (not UX step count).
2. Turnstile is acceptable (Cloudflare account available).
3. Explicit checkbox is preferred over passive notice.
4. Performance PRD remains a separate track.
5. No analytics → success measured by server enforcement + owner observation.
