/** Public site origin for sitemap, robots, and Open Graph absolute URLs. */
export function getSiteOrigin(): string {
  return process.env.PUBLIC_SITE_ORIGIN?.trim() || "http://localhost:3000";
}
