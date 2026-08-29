# Security operations

## Public surface

- `POST /api/project-inquiry` is the only public API.
- There is no authentication, database, file upload, payment, webhook, or AI endpoint.
- Report suspected vulnerabilities privately to `terd@zentariph.com` instead of opening a public issue.

## Production controls

- **Vercel:** keep provider secrets scoped to Production, protect preview deployments, enable Firewall attack alerts and usage notifications, and use Attack Challenge Mode only during an active incident. Pro accounts should use spend notifications; do not enable team-wide automatic pause without reviewing every project on the team.
- **Turnstile:** use a production-only Managed widget restricted to `www.imogen.dev` and `imogen.dev`. Keep local test keys separate and review hostname/action analytics for unexpected traffic.
- **Resend:** use a Sending-only API key restricted to the verified Imogen domain.
- **Upstash:** use a database dedicated to this site. Use a least-privilege ACL where supported and keep its REST token server-only.
- **GitHub:** enable secret scanning, push protection, and Dependabot security alerts.

## Credential rotation

Create the replacement credential first, update the Vercel Production environment, deploy, and verify one controlled inquiry before revoking the old credential. Never print credential values in logs, tickets, commits, or review comments.

The retired xAI key must be revoked after the chat-free production deployment is verified, then its Vercel environment variables must be removed.

## Incident response

1. Review Vercel Firewall traffic by path, IP, ASN, country, user agent, and TLS fingerprint.
2. Enable Attack Challenge Mode for a confirmed flood; block narrow sources before broad regions.
3. Review Turnstile failures, Upstash command volume, and Resend key logs.
4. Rotate an exposed provider key with the staged procedure above.
5. Preserve timestamps and request identifiers without copying inquiry PII into the incident record.
