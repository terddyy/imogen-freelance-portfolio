# Flow & data notes — Inquiry trust & hardening

**No application database.** Persistence remains mailbox + Resend + IPROG + Upstash rate counters. An ERD of tables is not applicable.

## Inquiry + privacy flow

```mermaid
flowchart TD
  A[User opens ProjectInquiry dialog] --> B[Steps 0-3: project details]
  B --> C[Step 4: phone or email]
  C --> D[Show privacy notice + link to /privacy]
  D --> E[Turnstile widget / token]
  E --> F{Consent checked?}
  F -->|No| C
  F -->|Yes| G[POST /api/project-inquiry JSON + captchaToken]
  G --> H{Origin / Sec-Fetch-Site OK?}
  H -->|No| R403[403]
  H -->|Yes| I[Rate limit fingerprint]
  I -->|Exceeded| R429[429]
  I -->|OK| J{Verify Turnstile server-side}
  J -->|Fail / misconfig prod| R4xx[400 or 503]
  J -->|OK| K[Validate enums / phone / email / website]
  K -->|Invalid| R400[400]
  K -->|OK| L[Resend email + IPROG SMS]
  L -->|Both OK| R200[200 ok]
  L -->|Fail| R502[502]
```

## Data handled (unchanged + additions)

| Data | Stored where | Notes |
|------|----------------|-------|
| Inquiry fields | Email (Resend) | Existing |
| Short alert | IPROG SMS to env recipient | Existing; no free-text body |
| IP fingerprint hash | Upstash counter key | Existing; not form PII |
| Consent boolean | Not persisted in DB | **Inferred:** prove via server requiring `consent: true` on POST; optional log later out of scope |
| Captcha token | Ephemeral verify call to Cloudflare | New; do not log token |

## Subprocessors (privacy page must list)

- Resend — inquiry email delivery  
- IPROG SMS — operator alert  
- Upstash Redis — rate-limit counters  
- Host (e.g. Vercel) — request logs  
- Cloudflare Turnstile — bot verification (**new**, if chosen)
