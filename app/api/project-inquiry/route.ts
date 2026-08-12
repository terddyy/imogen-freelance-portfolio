import { createHash } from "node:crypto";

export const runtime = "nodejs";

const budgets = new Set(["Under ₱100k", "₱100k–₱350k", "₱350k–₱650k", "₱650k–₱1.2M", "₱1.2M+"]);
const thesisBudgets = new Set(["Under ₱50k", "₱50k–₱100k", "₱100k–₱300k", "₱300k+"]);
const teamSizes = new Set(["Solo founder", "2–5 people", "6–15 people", "16–50 people", "50+ people"]);
const projectTypes = new Set(["Website", "Web app / SaaS", "Mobile app", "Internal system", "Improve an existing product", "Thesis / capstone", "Something else"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();

type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

class RequestBodyTooLargeError extends Error {}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getStrings(value: unknown) {
  return Array.isArray(value) && value.length <= projectTypes.size ? [...new Set(value.map(getString).filter(Boolean))] : [];
}

function normalizeWebsite(value: string) {
  if (!value) return "";
  if (value.length > 2048) throw new Error("Enter a valid website address.");
  const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  if (!url.hostname || url.username || url.password || !["http:", "https:"].includes(url.protocol)) throw new Error("Enter a valid website address.");
  return url.toString();
}

function json(body: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function getClientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const addresses = forwarded?.split(",").map((value) => value.trim()).filter(Boolean);
  return addresses?.at(-1) || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getClientFingerprint(request: Request) {
  return createHash("sha256").update(getClientAddress(request)).digest("hex").slice(0, 32);
}

function createRateLimitDecision(count: number, now: number): RateLimitDecision {
  const resetAt = (Math.floor(now / RATE_LIMIT_WINDOW_MS) + 1) * RATE_LIMIT_WINDOW_MS;
  return {
    allowed: count <= RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - count),
    resetAt,
  };
}

function consumeMemoryRateLimit(key: string, now: number) {
  if (memoryRateLimits.size > 10_000) {
    for (const [storedKey, value] of memoryRateLimits) {
      if (value.resetAt <= now) memoryRateLimits.delete(storedKey);
    }
  }

  const current = memoryRateLimits.get(key);
  const count = !current || current.resetAt <= now ? 1 : current.count + 1;
  const resetAt = (Math.floor(now / RATE_LIMIT_WINDOW_MS) + 1) * RATE_LIMIT_WINDOW_MS;
  memoryRateLimits.set(key, { count, resetAt });
  return createRateLimitDecision(count, now);
}

async function consumeRateLimit(key: string): Promise<RateLimitDecision> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$/, "");
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const now = Date.now();

  if (Boolean(redisUrl) !== Boolean(redisToken)) throw new Error("Rate limiter configuration is incomplete.");

  if (redisUrl && redisToken) {
    const windowSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);
    const bucket = Math.floor(now / RATE_LIMIT_WINDOW_MS);
    const redisKey = `project-inquiry:rate:${bucket}:${key}`;
    const script = "local count = redis.call('INCR', KEYS[1]); if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return count";
    const response = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", script, "1", redisKey, String(windowSeconds)]),
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) throw new Error("Rate limiter request failed.");
    const result = (await response.json()) as { result?: unknown };
    const count = typeof result.result === "number" ? result.result : Number(result.result);
    if (!Number.isInteger(count) || count < 1) throw new Error("Rate limiter returned an invalid result.");
    return createRateLimitDecision(count, now);
  }

  if (process.env.NODE_ENV === "production") throw new Error("A distributed rate limiter is required in production.");
  // ponytail: memory fallback is for local development only; production fails closed without Redis.
  return consumeMemoryRateLimit(key, now);
}

async function readBody(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES)) throw new RequestBodyTooLargeError();

  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(body);
}

function hasAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const expectedOrigin = process.env.PUBLIC_SITE_ORIGIN?.trim() || new URL(request.url).origin;
    return new URL(origin).origin === new URL(expectedOrigin).origin;
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function getDeliveryConfig() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const unismsApiKey = process.env.UNISMS_API_KEY?.trim();
  const unismsRecipient = process.env.UNISMS_RECIPIENT?.trim();
  const unismsSenderId = process.env.UNISMS_SENDER_ID?.trim();

  if (!resendApiKey || !resendFromEmail || !unismsApiKey || !/^\+\d{8,15}$/.test(unismsRecipient ?? "") || !unismsSenderId || unismsSenderId.length > 11) return null;
  return { resendApiKey, resendFromEmail, unismsApiKey, unismsRecipient, unismsSenderId };
}

function buildNotificationContent(body: {
  projectTypes: string[];
  project: string;
  website: string;
  budget: string;
  thesisBudget: string;
  teamSize: string;
  email: string;
}) {
  const rows = [
    ["Project type", body.projectTypes.join(", ")],
    ["Project details", body.project || "Not provided"],
    ["Existing website", body.website || "Not provided"],
    ["Budget", body.budget || body.thesisBudget || "Not provided"],
    ["Team size", body.teamSize],
    ["Email", body.email],
  ] as const;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = rows.map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value).replace(/\n/g, "<br />")}</td></tr>`).join("");
  return { text, html: `<h1>New project inquiry</h1><table cellpadding="8" cellspacing="0">${html}</table>` };
}

async function sendNotifications(content: ReturnType<typeof buildNotificationContent>, email: string, config: NonNullable<ReturnType<typeof getDeliveryConfig>>) {
  const idempotencyKey = createHash("sha256").update(`${email}\n${content.text}`).digest("hex");
  const [emailResponse, smsResponse] = await Promise.all([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: config.resendFromEmail,
        to: ["terd@zentariph.com"],
        reply_to: email,
        subject: "New project inquiry",
        html: content.html,
        text: content.text,
      }),
    }),
    fetch("https://unismsapi.com/api/sms", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.unismsApiKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        recipient: config.unismsRecipient,
        sender_id: config.unismsSenderId,
        content: `New inquiry from ${email}. ${content.text.replace(/\n/g, " | ").slice(0, 120)}`,
      }),
    }),
  ]);

  if (!emailResponse.ok || !smsResponse.ok) throw new Error("Notification delivery failed.");
}

function rateLimitHeaders(decision: RateLimitDecision) {
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
    "X-RateLimit-Remaining": String(decision.remaining),
    "X-RateLimit-Reset": String(Math.ceil(decision.resetAt / 1000)),
  };
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) return json({ error: "Invalid project inquiry origin." }, 403);
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return json({ error: "Project inquiry must be sent as JSON." }, 415);
  }

  let rateLimit: RateLimitDecision;
  try {
    rateLimit = await consumeRateLimit(getClientFingerprint(request));
  } catch {
    return json({ error: "Project inquiry delivery is temporarily unavailable. Please try again later." }, 503);
  }

  if (!rateLimit.allowed) {
    return json(
      { error: "Too many project inquiries. Please try again later." },
      429,
      {
        ...rateLimitHeaders(rateLimit),
        "Retry-After": String(Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))),
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await readBody(request);
    const parsedBody = JSON.parse(rawBody) as unknown;
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) throw new Error("Invalid project inquiry.");
    body = parsedBody as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return json({ error: "Project inquiry is too large." }, 413, rateLimitHeaders(rateLimit));
    return json({ error: "Invalid project inquiry." }, 400, rateLimitHeaders(rateLimit));
  }

  const selectedProjectTypes = getStrings(body.projectTypes);
  const project = getString(body.project);
  const website = getString(body.website);
  const budget = getString(body.budget);
  const thesisBudget = getString(body.thesisBudget);
  const teamSize = getString(body.teamSize);
  const email = getString(body.email);
  const hasThesis = selectedProjectTypes.includes("Thesis / capstone");
  const hasOtherProject = selectedProjectTypes.some((type) => type !== "Thesis / capstone");

  if (!selectedProjectTypes.length || selectedProjectTypes.some((type) => !projectTypes.has(type)) || project.length > 4000 || email.length > 320 || (hasOtherProject && !budgets.has(budget)) || (hasThesis && !thesisBudgets.has(thesisBudget)) || !teamSizes.has(teamSize) || !emailPattern.test(email)) {
    return json({ error: "Please complete the required project details." }, 400, rateLimitHeaders(rateLimit));
  }

  let normalizedWebsite = "";
  try {
    normalizedWebsite = normalizeWebsite(website);
  } catch {
    return json({ error: "Enter a valid website address." }, 400, rateLimitHeaders(rateLimit));
  }

  const deliveryConfig = getDeliveryConfig();
  if (!deliveryConfig) {
    return json({ error: "Project inquiry delivery is not configured yet. Please try again later." }, 503, rateLimitHeaders(rateLimit));
  }

  try {
    const content = buildNotificationContent({ projectTypes: selectedProjectTypes, project, website: normalizedWebsite, budget, thesisBudget, teamSize, email });
    await sendNotifications(content, email, deliveryConfig);
    return json({ ok: true }, 200, rateLimitHeaders(rateLimit));
  } catch {
    return json({ error: "Unable to send your inquiry right now. Please try again shortly." }, 502, rateLimitHeaders(rateLimit));
  }
}
