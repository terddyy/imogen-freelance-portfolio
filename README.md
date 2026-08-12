This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project inquiry delivery

The inquiry route sends a readable HTML email to `terd@zentariph.com` through Resend and a short notification SMS through UniSMS. Set these server-only environment variables in `.env.local` and your deployment provider:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Imogen Portfolio <notifications@your-verified-domain.com>
UNISMS_API_KEY=sk_...
UNISMS_RECIPIENT=+639xxxxxxxxx
UNISMS_SENDER_ID=UnisoftSMS
PUBLIC_SITE_ORIGIN=https://your-domain.example
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

`RESEND_FROM_EMAIL` must use a sender/domain verified in Resend. `UNISMS_RECIPIENT` must be your phone number in E.164 format, and `UNISMS_SENDER_ID` must match an active sender ID on your UniSMS account (this project uses `UnisoftSMS`). The SMS is a short heads-up to you; full inquiry details go by email. The route only reports success when both notifications are accepted by their providers.

For production, also set `PUBLIC_SITE_ORIGIN` to the public HTTPS origin and configure `UPSTASH_REDIS_REST_URL` plus `UPSTASH_REDIS_REST_TOKEN`. The inquiry route uses the Redis limiter for distributed protection and fails closed if Redis is missing or unavailable; it only uses an in-memory limiter during local development. The reverse proxy must overwrite, not pass through, `X-Forwarded-For`/`X-Real-IP` headers so the limiter sees the real client address.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
