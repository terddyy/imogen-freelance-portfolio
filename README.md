# Imogen — freelance portfolio

Next.js portfolio site for Imogen (Zentariph). Static marketing pages plus one public API for project inquiries.

**Stack:** Next.js 16 · React 19 · TypeScript · Resend (email) · IPROG SMS · Upstash Redis (rate limits)

## Performance audit

Full review: **[PERFORMANCE-AUDIT.md](./PERFORMANCE-AUDIT.md)** — overall score **72/100**, with prioritized fixes to reach 90+.

**Next steps PRD:** **[prd-development/PRD.md](./prd-development/PRD.md)** — phased implementation plan with user stories and acceptance criteria.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development |
| `npm run build` / `npm start` | Production build + serve |
| `npm run lint` | ESLint |
| `npm run analyze` | Production build with bundle analyzer (`ANALYZE=true`) — opens HTML reports in browser after build |

## Environment variables

Copy `.env.example` to `.env.local`. Secrets stay **server-only**. The only public client value is `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Production | Resend API key for inquiry email |
| `RESEND_FROM_EMAIL` | Production | Verified Resend sender, e.g. `Imogen Portfolio <notifications@your-domain.com>` |
| `IPROG_SMS_API_TOKEN` | Production | IPROG SMS API token |
| `IPROG_SMS_RECIPIENT` | Production | Your PH mobile for SMS alerts (`+639…` or local format) |
| `PUBLIC_SITE_ORIGIN` | Production | Public HTTPS origin, e.g. `https://your-domain.example` |
| `UPSTASH_REDIS_REST_URL` | Production | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Upstash Redis REST token |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production | Cloudflare Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | Production | Cloudflare Turnstile secret (server-only) |

Inquiry success requires **both** Resend and IPROG to accept the message. Full details go by email to `terd@zentariph.com`; SMS is a short heads-up only (no free-text project body).

For local Turnstile testing, use Cloudflare’s always-pass dummy keys (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) in `.env.local`. Do not reuse a hostname-restricted production widget key on `localhost`; Cloudflare will reject it. If Turnstile env vars are omitted in development, the API skips CAPTCHA verification; **production fails closed** without `TURNSTILE_SECRET_KEY`.

The production Turnstile widget must authorize `www.imogen.dev` (and `imogen.dev` if the apex serves the form). The inquiry UI keeps submission disabled when Turnstile fails, shows a retry action, and offers direct call/WhatsApp contact rather than bypassing verification.

## Project inquiry API

| Item | Detail |
|------|--------|
| Endpoint | `POST /api/project-inquiry` |
| Content-Type | `application/json` only (`415` otherwise) |
| Max body | 16 KiB (route + `proxyClientMaxBodySize`) |
| Client UI | `components/ProjectInquiry.tsx` |

### Rate limiting (forms)

This is the primary abuse control for the inquiry form.

| Setting | Value |
|---------|-------|
| Limit | **5 requests / 10 minutes** per client fingerprint |
| Fingerprint | SHA-256 of client IP (truncated), not form content |
| Production backend | Upstash Redis (`INCR` + TTL via REST `EVAL`) |
| Development backend | In-memory `Map` only when `NODE_ENV !== "production"` |
| Fail-closed | Missing/broken Redis in production → **503** (no silent open inbox) |
| Response headers | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` |
| Over limit | **429** + `Retry-After` |

Rate limit runs **before** JSON parse so oversized or junk bodies still consume quota.

**Proxy requirement:** the reverse proxy (e.g. Vercel) must **overwrite**, not pass through, `X-Forwarded-For` / `X-Real-IP`. The limiter uses the **rightmost** `X-Forwarded-For` hop (the address the trusted proxy appended). If the app is reachable without a sanitizing proxy, clients can spoof IPs and bypass the limit.

**Not a CAPTCHA alone.** Rate limiting is paired with **Cloudflare Turnstile** (server-verified) and required privacy consent on the final inquiry step.

### Bot protection (Turnstile)

| Setting | Value |
|---------|-------|
| Provider | Cloudflare Turnstile `siteverify` |
| Client | `components/TurnstileField.tsx` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |
| Server | `TURNSTILE_SECRET_KEY` verified after rate limit, before delivery |
| Production | Missing secret → **503** |
| Development | Missing secret → verification skipped |

### Privacy consent

- Public page: `/privacy`
- Final inquiry step requires `consent: true` (UI checkbox + API enforcement)
- Contact page and footer link to the privacy notice

### Other request defenses

- Origin check: if `Origin` is present, it must match `PUBLIC_SITE_ORIGIN` (or the request URL origin). Missing `Origin` is allowed for non-browser clients only when rate limit + Turnstile (in production) still pass.
- `Sec-Fetch-Site: cross-site` → **403**
- Enum allowlists for project type, budget, team size; length caps; email regex; PH/E.164-ish phone normalization; website via `URL` (`http`/`https` only, no credentials).
- HTML email fields escaped (`escapeHtml`); SMS uses enum fields only, capped at 160 chars.
- Outbound fetches use fixed HTTPS URLs, `redirect: "error"`, and timeouts. SMS destination is env-configured, never from the request body.
- Resend `Idempotency-Key` derived from contact + message text.

## Security headers

Set globally in `next.config.ts` for `/:path*`:

- CSP: `default-src 'self'` plus Turnstile (`challenges.cloudflare.com`) on `script-src` / `frame-src` / `connect-src`; `object-src 'none'`; `frame-ancestors 'none'`
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Restrictive `Permissions-Policy`
- HSTS in production (`max-age=31536000; includeSubDomains`)
- `poweredByHeader: false`

There is no auth, database, file upload, or payment surface. Theme preference uses `localStorage` only.

## Privacy & compliance (PH Data Privacy Act)

The form may collect **phone and/or email**, optional website URL, project description, and budget/team metadata. See **[/privacy](/privacy)** on the live site.

| Subprocessor | What it receives |
|--------------|------------------|
| Resend | Full inquiry email (optional `reply_to` = submitter email) |
| IPROG SMS | Short alert to the operator number (no full free-text) |
| Upstash Redis | Rate-limit counters keyed by hashed IP fingerprint |
| Cloudflare Turnstile | Bot verification (not project free-text) |
| Host (e.g. Vercel) | Request logs / edge metadata per provider policy |

There is **no application database**. Retention lives in your mailbox, Resend dashboard, and IPROG history. Deletion requests: `terd@zentariph.com`.

## Deploy checklist

1. Set all env vars above in the host (including Turnstile keys).
2. Verify Resend domain/sender.
3. Confirm IPROG token + recipient format.
4. Confirm Upstash Redis (production will not accept inquiries without it).
5. Set `PUBLIC_SITE_ORIGIN` to the live HTTPS origin.
6. Confirm the platform overwrites forwarded client IP headers.
7. Smoke-test: consent + Turnstile + one successful inquiry, then burst past 5/10m and expect `429`.
8. Confirm `/privacy` and contact-page privacy link.

## Learn more

- [Next.js docs](https://nextjs.org/docs)
- [Resend](https://resend.com/docs)
- [IPROG SMS](https://www.iprogsms.com)
- [Upstash Redis](https://upstash.com/docs/redis)
