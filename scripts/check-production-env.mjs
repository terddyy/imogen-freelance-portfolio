/**
 * Production readiness check for imogen.dev — prints missing env vars only.
 * Usage: node scripts/check-production-env.mjs
 */
const required = [
  { name: "PUBLIC_SITE_ORIGIN", hint: "https://www.imogen.dev" },
  { name: "UPSTASH_REDIS_REST_URL", hint: "Upstash Redis REST URL (rate limiting)" },
  { name: "UPSTASH_REDIS_REST_TOKEN", hint: "Upstash Redis REST token" },
  { name: "TURNSTILE_SECRET_KEY", hint: "Cloudflare Turnstile secret" },
  { name: "NEXT_PUBLIC_TURNSTILE_SITE_KEY", hint: "Cloudflare Turnstile site key" },
  { name: "RESEND_API_KEY", hint: "Resend API key for inquiry email" },
  { name: "RESEND_FROM_EMAIL", hint: "Verified Resend sender" },
];

const missing = required.filter(({ name }) => !process.env[name]?.trim());
const dummyTurnstileValues = new Set([
  "1x00000000000000000000AA",
  "1x0000000000000000000000000000000AA",
]);
const invalid = required.filter(
  ({ name }) => name.includes("TURNSTILE") && dummyTurnstileValues.has(process.env[name]?.trim()),
);

if (missing.length === 0 && invalid.length === 0) {
  console.log("OK — all production environment variables are set.");
  process.exit(0);
}

console.log("Production environment issues:");
for (const { name, hint } of missing) {
  console.log(`  - ${name} (${hint})`);
}
for (const { name } of invalid) {
  console.log(`  - ${name} (replace the local test value with a production Turnstile credential)`);
}
process.exit(1);
