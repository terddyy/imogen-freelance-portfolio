# Cursor handoff — Inquiry trust & hardening

Copy everything below the line into a fresh Cursor agent chat.

---

You are continuing work in `imogen-freelance-portfolio` (Next.js 16 App Router). Read these sources of truth first, in order:

1. `PLAN/inquiry-trust-hardening/PRD.md`
2. `PLAN/inquiry-trust-hardening/IMPLEMENTATION_PLAN.md`
3. `PLAN/inquiry-trust-hardening/ACCEPTANCE_CRITERIA.md`
4. `PLAN/inquiry-trust-hardening/ERD.md`

Then inspect the current worktree and relevant source files before editing (`git status --short`; read `app/api/project-inquiry/route.ts`, `components/ProjectInquiry.tsx`, `app/contact/page.tsx`, `next.config.ts`, `README.md`, `.env.example`). Follow `AGENTS.md` / Next docs under `node_modules/next/dist/docs/` for any Next-specific APIs.

**Objective:** Implement inquiry trust & hardening — privacy page + in-form consent for submitters, server-verified bot challenge (default Cloudflare Turnstile), stricter Origin/`Sec-Fetch-Site` checks, and incremental CSP — without weakening existing Upstash rate limiting or dual Resend/IPROG delivery.

**Implement in phases** using the PRD, implementation plan, and acceptance criteria as the source of truth. Prefer fewest files; no new npm dependencies unless the user explicitly approves. Preserve unrelated changes (performance work, UI, images, `prd-development/` performance PRD). Do not deploy, restart services, run migrations, rotate keys, or touch production systems unless explicitly approved.

**Non-goals:** auth/CRM/DB, replacing Resend/IPROG, changing 5/10m rate limits, performance optimization scope, analytics.

**Verify:** `npm run lint`, `npm run build`, and the manual QA checklist in `ACCEPTANCE_CRITERIA.md`.

**Final response must include:**

- Files changed
- Behavior implemented
- Tests or checks run, with pass/fail status
- Any migrations, env vars, deployment, or manual steps needed
- Remaining risks, open questions, or skipped checks
