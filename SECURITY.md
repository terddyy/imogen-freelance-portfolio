# Security operations

## Public surface

- This is a static portfolio site with no public API.
- There is no authentication, database, file upload, payment, webhook, form submission, or AI endpoint.
- Contact happens through direct `mailto:` and `tel:`/WhatsApp links; the site itself collects and stores nothing.
- Report suspected vulnerabilities privately to `terd@zentariph.com` instead of opening a public issue.

## Production controls

- **Vercel:** keep any provider secrets scoped to Production, protect preview deployments, enable Firewall attack alerts and usage notifications, and use Attack Challenge Mode only during an active incident. Pro accounts should use spend notifications; do not enable team-wide automatic pause without reviewing every project on the team.
- **Security headers:** a strict Content-Security-Policy, HSTS (production), `X-Content-Type-Options`, `X-Frame-Options: DENY`, and a restrictive `Permissions-Policy` are set in `next.config.ts`.
- **GitHub:** enable secret scanning, push protection, and Dependabot security alerts.

## Incident response

1. Review Vercel Firewall traffic by path, IP, ASN, country, user agent, and TLS fingerprint.
2. Enable Attack Challenge Mode for a confirmed flood; block narrow sources before broad regions.
3. Preserve timestamps and request identifiers for the incident record.
