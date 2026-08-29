# Imogen — freelance portfolio

Next.js portfolio site for Imogen (Zentariph). Static marketing pages plus one public API for project inquiries.

**Stack:** Next.js 16 · React 19 · TypeScript · Resend (email) · Upstash Redis (rate limits)

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
| `npm run check:api-security` | Turnstile hostname/action regression |
| `npm run analyze` | Production build with bundle analyzer (`ANALYZE=true`) — opens HTML reports in browser after build |

## Environment variables

Copy `.env.example` to `.env.local`. Secrets stay **server-only**. The only public client value is `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Production | Resend API key for inquiry email |
| `RESEND_FROM_EMAIL` | Production | Verified Resend sender, e.g. `Imogen Portfolio <notifications@your-domain.com>` |
| `PUBLIC_SITE_ORIGIN` | Production | Public HTTPS origin, e.g. `https://your-domain.example` |
| `UPSTASH_REDIS_REST_URL` | Production | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Upstash Redis REST token |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production | Cloudflare Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | Production | Cloudflare Turnstile secret (server-only) |

Inquiry success requires Resend to accept the message. Full details go by email to `terd@zentariph.com`.

For local Turnstile testing, use Cloudflare’s always-pass dummy keys (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) in `.env.local`. Do not reuse a hostname-restricted production widget key on `localhost`; Cloudflare will reject it. If Turnstile env vars are omitted in development, the API skips CAPTCHA verification; **production fails closed** without `TURNSTILE_SECRET_KEY`.

The production Turnstile widget must authorize `www.imogen.dev` and `imogen.dev`. The API also requires the returned hostname and `project-inquiry` action to match. The inquiry UI keeps submission disabled when Turnstile fails, shows a retry action, and offers direct call/WhatsApp contact rather than bypassing verification.

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

The per-client limit runs **before** JSON parsing so junk bodies consume that visitor's quota. The separate 25-per-window delivery quota runs only after input and Turnstile validation, preventing junk traffic from locking out legitimate inquiries.

**Proxy requirement:** the reverse proxy must **overwrite**, not pass through, client-IP headers. Vercel overwrites `X-Vercel-Forwarded-For`, which the limiter prefers. If the app is moved behind another host, verify that trust boundary before relying on IP limits.

**Not a CAPTCHA alone.** Rate limiting is paired with **Cloudflare Turnstile** (server-verified) and required privacy consent on the final inquiry step.

### Bot protection (Turnstile)

| Setting | Value |
|---------|-------|
| Provider | Cloudflare Turnstile `siteverify` |
| Client | `components/TurnstileField.tsx` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |
| Server | `TURNSTILE_SECRET_KEY` verifies token, hostname, and `project-inquiry` action before delivery |
| Production | Missing secret → **503** |
| Development | Missing secret → verification skipped |

### Privacy consent

- Public page: `/privacy`
- Final inquiry step requires `consent: true` (UI checkbox + API enforcement)
- Contact page and footer link to the privacy notice

### Other request defenses

- Origin check: production requires `Origin` to match `PUBLIC_SITE_ORIGIN` or the request URL origin.
- `Sec-Fetch-Site: cross-site` → **403**
- Enum allowlists for project type, budget, team size; length caps; email regex; PH/E.164-ish phone normalization; website via `URL` (`http`/`https` only, no credentials).
- HTML email fields are escaped (`escapeHtml`).
- Outbound fetches use fixed HTTPS URLs, `redirect: "error"`, and timeouts.
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
| Upstash Redis | Rate-limit counters keyed by hashed IP fingerprint |
| Cloudflare Turnstile | Bot verification (not project free-text) |
| Host (e.g. Vercel) | Request logs / edge metadata per provider policy |

There is **no application database**. Retention lives in your mailbox and Resend dashboard. Deletion requests: `terd@zentariph.com`.

## Deploy checklist

1. Set all env vars above in the host (including Turnstile keys).
2. Verify Resend domain/sender.
3. Confirm Upstash Redis (production will not accept inquiries without it).
4. Set `PUBLIC_SITE_ORIGIN` to the live HTTPS origin.
5. Confirm the platform overwrites forwarded client IP headers.
6. Smoke-test: consent + Turnstile + one successful inquiry, then burst past 5/10m and expect `429`.
7. Confirm `/privacy` and contact-page privacy link.

## Learn more

- [Next.js docs](https://nextjs.org/docs)
- [Resend](https://resend.com/docs)
- [Upstash Redis](https://upstash.com/docs/redis)
