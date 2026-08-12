# Acceptance criteria — Inquiry trust & hardening

## Functional

- [ ] `/privacy` is reachable and explains: purpose, data collected, Resend, IPROG, Upstash, host, Turnstile (if used), retention, deletion contact.
- [ ] Inquiry final step shows a short privacy notice and link to `/privacy`.
- [ ] Submit is blocked in UI without consent checked.
- [ ] `POST /api/project-inquiry` rejects missing/`false` consent with 400.
- [ ] Contact page links to `/privacy`.

## API / security

- [ ] Valid same-origin inquiry with consent + valid CAPTCHA still returns 200 when providers accept (or 502 on provider failure — existing behavior).
- [ ] Invalid/missing CAPTCHA token → 400 (or 403); no Resend/IPROG calls.
- [ ] Production without CAPTCHA secret configured → 503 (fail-closed).
- [ ] Mismatched `Origin` → 403 (existing + preserved).
- [ ] `Sec-Fetch-Site: cross-site` → 403.
- [ ] Rate limit still 5/10m; 429 + `Retry-After` still returned; Redis fail-closed unchanged.
- [ ] No secrets in client bundles (`NEXT_PUBLIC_` only for site key if required).
- [ ] CAPTCHA tokens and API keys never logged.

## CSP / headers

- [ ] Site loads: home, contact, privacy, inquiry dialog.
- [ ] Turnstile widget loads if enabled.
- [ ] Fonts and Motion still work.
- [ ] Existing headers (frame deny, nosniff, HSTS prod) preserved.

## Regression

- [ ] Enum/length/phone/email/website validation unchanged in spirit.
- [ ] Dual delivery gate (email + SMS) unchanged.
- [ ] Body size 16 KiB still enforced.
- [ ] Unrelated portfolio/performance changes in the worktree untouched.

## Manual QA

1. Open inquiry → complete steps → confirm notice + checkbox + widget on last step.
2. Uncheck consent → submit blocked.
3. Successful submit with consent + CAPTCHA (dev keys or test keys).
4. `curl` without token → rejected.
5. Burst 6 requests → 429 on 6th (same IP).
6. Open `/privacy` on mobile width.

## Evidence executor must report

- Files changed
- Behavior implemented
- Lint/build (+ manual QA) pass/fail
- New env vars / provider setup steps
- Remaining risks or skipped checks
