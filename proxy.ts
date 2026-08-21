import { NextResponse, type NextRequest } from "next/server";
import { hasAllowedRequestSource } from "@/lib/api-security";
import { getClientFingerprint } from "@/lib/client-ip";
import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

import { API_FLOOD_MAX } from "@/lib/rate-limit-config";
const MAX_BODY_BYTES = 16 * 1024;

export const config = {
  matcher: "/api/:path*",
};

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export async function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  if (!hasAllowedRequestSource(request.headers, request.url)) {
    return json({ error: "Invalid project inquiry origin." }, 403);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES)) {
    return json({ error: "Project inquiry is too large." }, 413);
  }

  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return json({ error: "Project inquiry must be sent as JSON." }, 415);
  }

  try {
    const fingerprint = await getClientFingerprint(request.headers);
    const floodLimit = await consumeRateLimit("api-flood", fingerprint, API_FLOOD_MAX);

    if (!floodLimit.allowed) {
      return json(
        { error: "Too many requests. Please try again later." },
        429,
        {
          ...rateLimitHeaders(floodLimit, API_FLOOD_MAX),
          "Retry-After": String(Math.max(1, Math.ceil((floodLimit.resetAt - Date.now()) / 1000))),
        },
      );
    }
  } catch {
    return json({ error: "Project inquiry delivery is temporarily unavailable. Please try again later." }, 503);
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  return response;
}
