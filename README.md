# Imogen — freelance portfolio

Next.js portfolio site for Imogen (Zentariph). Static marketing pages with direct contact links (email, phone, WhatsApp) — no backend API.

**Stack:** Next.js 16 · React 19 · TypeScript

## Performance audit

Full review: **[PERFORMANCE-AUDIT.md](./PERFORMANCE-AUDIT.md)** — overall score **72/100**, with prioritized fixes to reach 90+.

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

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `PUBLIC_SITE_ORIGIN` | Production | Public HTTPS origin, e.g. `https://www.imogen.dev` (used for metadata, sitemap, and robots) |

## Contact

The site has no form or backend. The "Contact me" buttons open the visitor's email app addressed to `terddy03@gmail.com`; the contact page also offers phone and WhatsApp links. See **[/privacy](/privacy)** for how contact details are handled.

## Security headers

Set globally in `next.config.ts` for `/:path*`:

- CSP: `default-src 'self'`; `object-src 'none'`; `frame-ancestors 'none'`
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Restrictive `Permissions-Policy`
- HSTS in production (`max-age=31536000; includeSubDomains`)
- `poweredByHeader: false`

There is no auth, database, API, file upload, or payment surface. Theme preference and cookie consent use `localStorage` only.

## Deploy checklist

1. Set `PUBLIC_SITE_ORIGIN` to the live HTTPS origin.
2. Confirm `/privacy` and the contact-page links resolve.
3. Verify the "Contact me" buttons open a `mailto:` to the correct address.

## Learn more

- [Next.js docs](https://nextjs.org/docs)
