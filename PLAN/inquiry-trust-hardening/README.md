# Inquiry trust & hardening

**Objective:** Make project inquiry feel trustworthy for submitters (privacy clarity + consent) while hardening the form against spam/cost abuse (CAPTCHA, Origin, CSP).

**Status:** Draft — plan only (no implementation in this package)

**Date:** 2026-08-12

## Files in this package

| File | Purpose |
|------|---------|
| [PRD.md](./PRD.md) | Problem, scope, stories, metrics |
| [ERD.md](./ERD.md) | Inquiry + privacy flow diagram (no DB) |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Phased executor steps |
| [ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md) | Done checklist |
| [CURSOR_HANDOFF.md](./CURSOR_HANDOFF.md) | Copy-paste prompt for a fresh agent |

## Recommended Cursor entrypoint

Paste the contents of `CURSOR_HANDOFF.md` into a new chat. Do not implement from chat history alone.

## Execution summary

1. Privacy page + form notice/consent (submitter-facing)  
2. Server-verified bot challenge on `POST /api/project-inquiry`  
3. Stricter Origin / `Sec-Fetch-Site` policy  
4. Incremental CSP tightening without breaking fonts/motion  

## Safety warning

Touches env secrets (CAPTCHA keys), outbound verification calls, and CSP headers. Do **not** deploy, rotate production keys, or change production Redis/Resend/IPROG settings without explicit approval.
