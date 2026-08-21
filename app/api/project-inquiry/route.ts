import { createHash } from "node:crypto";
import { hasAllowedRequestSource } from "@/lib/api-security";
import { getClientAddress, getClientFingerprint } from "@/lib/client-ip";
import { consumeRateLimit, rateLimitHeaders, type RateLimitDecision } from "@/lib/rate-limit";
import { isAcceptedBudgetValue, standardBudgets, thesisBudgets } from "@/lib/project-inquiry";

export const runtime = "nodejs";

const teamSizes = new Set(["Solo founder", "2–5 people", "6–15 people", "16–50 people", "50+ people"]);
const timelines = new Set(["ASAP", "1–2 months", "3–6 months", "6+ months", "Flexible"]);
const projectTypes = new Set([
  "Website",
  "Web app / SaaS",
  "Mobile app",
  "Internal system",
  "Improve an existing product",
  "Thesis / capstone",
  "Something else",
  "Branding",
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 16 * 1024;
import {
  GLOBAL_INQUIRY_RATE_LIMIT_MAX,
  INQUIRY_RATE_LIMIT_MAX,
} from "@/lib/rate-limit-config";

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
  if (!url.hostname || url.username || url.password || !["http:", "https:"].includes(url.protocol)) {
    throw new Error("Enter a valid website address.");
  }
  return url.toString();
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("63") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+63${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("9")) return `+63${digits}`;
  if (value.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return "";
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

async function readBody(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES)) {
    throw new RequestBodyTooLargeError();
  }

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

async function verifyTurnstileToken(token: string, remoteIp: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") throw new Error("Turnstile is required in production.");
    return true;
  }

  if (!token || token.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    redirect: "error",
    signal: AbortSignal.timeout(8000),
    body,
  });
  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function getDeliveryConfig() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim();

  if (!resendApiKey || !resendFromEmail) return null;
  return { resendApiKey, resendFromEmail };
}

function buildNotificationContent(body: {
  projectTypes: string[];
  project: string;
  website: string;
  budget: string;
  thesisBudget: string;
  teamSize: string;
  timeline: string;
  phone: string;
  email: string;
}) {
  const rows = [
    ["Project type", body.projectTypes.join(", ")],
    ["Project details", body.project || "Not provided"],
    ["Existing website", body.website || "Not provided"],
    ["Budget", body.budget || body.thesisBudget || "Not provided"],
    ["Team size", body.teamSize],
    ["Timeline", body.timeline || "Not provided"],
    ["Phone", body.phone || "Not provided"],
    ["Email", body.email || "Not provided"],
  ] as const;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = rows
    .map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value).replace(/\n/g, "<br />")}</td></tr>`)
    .join("");
  return { text, html: `<h1>New project inquiry</h1><table cellpadding="8" cellspacing="0">${html}</table>` };
}

async function sendInquiryEmail(
  content: ReturnType<typeof buildNotificationContent>,
  contact: { phone: string; email: string },
  config: NonNullable<ReturnType<typeof getDeliveryConfig>>,
) {
  const contactLabel = contact.phone || contact.email;
  const idempotencyKey = createHash("sha256").update(`${contactLabel}\n${content.text}`).digest("hex");
  const emailPayload: Record<string, unknown> = {
    from: config.resendFromEmail,
    to: ["terd@zentariph.com"],
    subject: "New project inquiry",
    html: content.html,
    text: content.text,
  };
  if (contact.email) emailPayload.reply_to = contact.email;

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    redirect: "error",
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify(emailPayload),
  });

  if (!emailResponse.ok) throw new Error("Notification delivery failed.");
}

function tooManyRequestsHeaders(decision: RateLimitDecision, max: number) {
  return {
    ...rateLimitHeaders(decision, max),
    "Retry-After": String(Math.max(1, Math.ceil((decision.resetAt - Date.now()) / 1000))),
  };
}

export async function POST(request: Request) {
  if (!hasAllowedRequestSource(request.headers, request.url)) {
    return json({ error: "Invalid project inquiry origin." }, 403);
  }

  const clientAddress = getClientAddress(request.headers);
  let clientFingerprint: string;
  try {
    clientFingerprint = await getClientFingerprint(request.headers);
  } catch {
    return json({ error: "Project inquiry delivery is temporarily unavailable. Please try again later." }, 503);
  }

  let inquiryRateLimit;
  let globalRateLimit;
  try {
    inquiryRateLimit = await consumeRateLimit("project-inquiry", clientFingerprint, INQUIRY_RATE_LIMIT_MAX);
    globalRateLimit = await consumeRateLimit("project-inquiry-global", "site", GLOBAL_INQUIRY_RATE_LIMIT_MAX);
  } catch {
    return json({ error: "Project inquiry delivery is temporarily unavailable. Please try again later." }, 503);
  }

  if (!inquiryRateLimit.allowed) {
    return json(
      { error: "Too many project inquiries. Please try again later." },
      429,
      tooManyRequestsHeaders(inquiryRateLimit, INQUIRY_RATE_LIMIT_MAX),
    );
  }

  if (!globalRateLimit.allowed) {
    return json(
      { error: "Project inquiries are temporarily limited. Please try again later." },
      429,
      tooManyRequestsHeaders(globalRateLimit, GLOBAL_INQUIRY_RATE_LIMIT_MAX),
    );
  }

  const inquiryHeaders = rateLimitHeaders(inquiryRateLimit, INQUIRY_RATE_LIMIT_MAX);

  let body: Record<string, unknown>;
  try {
    const rawBody = await readBody(request);
    const parsedBody = JSON.parse(rawBody) as unknown;
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      throw new Error("Invalid project inquiry.");
    }
    body = parsedBody as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return json({ error: "Project inquiry is too large." }, 413, inquiryHeaders);
    }
    return json({ error: "Invalid project inquiry." }, 400, inquiryHeaders);
  }

  if (body.consent !== true) {
    return json({ error: "Please confirm the privacy notice before sending your inquiry." }, 400, inquiryHeaders);
  }

  try {
    const captchaOk = await verifyTurnstileToken(getString(body.captchaToken), clientAddress);
    if (!captchaOk) {
      return json({ error: "Please complete the security check and try again." }, 400, inquiryHeaders);
    }
  } catch {
    return json({ error: "Project inquiry delivery is temporarily unavailable. Please try again later." }, 503, inquiryHeaders);
  }

  const selectedProjectTypes = getStrings(body.projectTypes);
  const project = getString(body.project);
  const website = getString(body.website);
  const budget = getString(body.budget);
  const thesisBudget = getString(body.thesisBudget);
  const teamSize = getString(body.teamSize);
  const timeline = getString(body.timeline);
  const phone = getString(body.phone);
  const email = getString(body.email);
  const normalizedPhone = normalizePhone(phone);
  const hasValidPhone = Boolean(normalizedPhone);
  const hasValidEmail = emailPattern.test(email);
  const hasThesis = selectedProjectTypes.includes("Thesis / capstone");
  const hasOtherProject = selectedProjectTypes.some((type) => type !== "Thesis / capstone");

  if (
    !selectedProjectTypes.length ||
    selectedProjectTypes.some((type) => !projectTypes.has(type)) ||
    project.length > 4000 ||
    phone.length > 20 ||
    email.length > 320 ||
    (hasOtherProject && !isAcceptedBudgetValue(budget, standardBudgets)) ||
    (hasThesis && !isAcceptedBudgetValue(thesisBudget, thesisBudgets)) ||
    !teamSizes.has(teamSize) ||
    !timelines.has(timeline) ||
    (!hasValidPhone && !hasValidEmail)
  ) {
    return json({ error: "Please complete the required project details." }, 400, inquiryHeaders);
  }

  let normalizedWebsite = "";
  try {
    normalizedWebsite = normalizeWebsite(website);
  } catch {
    return json({ error: "Enter a valid website address." }, 400, inquiryHeaders);
  }

  const deliveryConfig = getDeliveryConfig();
  if (!deliveryConfig) {
    return json({ error: "Project inquiry delivery is not configured yet. Please try again later." }, 503, inquiryHeaders);
  }

  try {
    const content = buildNotificationContent({
      projectTypes: selectedProjectTypes,
      project,
      website: normalizedWebsite,
      budget,
      thesisBudget,
      teamSize,
      timeline,
      phone: normalizedPhone,
      email,
    });
    await sendInquiryEmail(content, { phone: normalizedPhone, email }, deliveryConfig);
    return json({ ok: true }, 200, inquiryHeaders);
  } catch {
    return json({ error: "Unable to send your inquiry right now. Please try again shortly." }, 502, inquiryHeaders);
  }
}
