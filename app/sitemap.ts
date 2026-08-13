import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";

const staticRoutes = ["/", "/about", "/projects", "/inquire", "/contact", "/testimonials", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();

  return staticRoutes.map((path) => ({
    url: path === "/" ? origin : `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
