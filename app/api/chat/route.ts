import { hasAllowedRequestSource } from "@/lib/api-security";
import { getClientFingerprint } from "@/lib/client-ip";
import {
  CHAT_MAX_BODY_BYTES,
  getXaiChatModel,
  PORTFOLIO_CHAT_SYSTEM_PROMPT,
} from "@/lib/chatbot/config";
import type { ChatApiResponse } from "@/lib/chatbot/types";
import { parseChatMessages } from "@/lib/chatbot/validate-messages";
import { consumeRateLimit, rateLimitHeaders, type RateLimitDecision } from "@/lib/rate-limit";
import {
  CHAT_GLOBAL_RATE_LIMIT_MAX,
  CHAT_RATE_LIMIT_MAX,
} from "@/lib/rate-limit-config";
import { createChatCompletion, XaiApiError } from "@/lib/xai/client";

export const runtime = "nodejs";

class RequestBodyTooLargeError extends Error {}

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
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > CHAT_MAX_BODY_BYTES)) {
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
      if (totalBytes > CHAT_MAX_BODY_BYTES) {
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

function tooManyRequestsHeaders(decision: RateLimitDecision, max: number) {
  return {
    ...rateLimitHeaders(decision, max),
    "Retry-After": String(Math.max(1, Math.ceil((decision.resetAt - Date.now()) / 1000))),
  };
}

export async function POST(request: Request) {
  if (!hasAllowedRequestSource(request.headers, request.url)) {
    return json({ error: "Invalid chat request origin." }, 403);
  }

  let clientFingerprint: string;
  try {
    clientFingerprint = await getClientFingerprint(request.headers);
  } catch {
    return json({ error: "Chat is temporarily unavailable. Please try again later." }, 503);
  }

  let chatRateLimit;
  let globalRateLimit;
  try {
    chatRateLimit = await consumeRateLimit("portfolio-chat", clientFingerprint, CHAT_RATE_LIMIT_MAX);
    globalRateLimit = await consumeRateLimit("portfolio-chat-global", "site", CHAT_GLOBAL_RATE_LIMIT_MAX);
  } catch {
    return json({ error: "Chat is temporarily unavailable. Please try again later." }, 503);
  }

  if (!chatRateLimit.allowed) {
    return json(
      { error: "Too many chat messages. Please try again later." },
      429,
      tooManyRequestsHeaders(chatRateLimit, CHAT_RATE_LIMIT_MAX),
    );
  }

  if (!globalRateLimit.allowed) {
    return json(
      { error: "Chat is temporarily limited. Please try again later." },
      429,
      tooManyRequestsHeaders(globalRateLimit, CHAT_GLOBAL_RATE_LIMIT_MAX),
    );
  }

  const chatHeaders = rateLimitHeaders(chatRateLimit, CHAT_RATE_LIMIT_MAX);

  let body: Record<string, unknown>;
  try {
    const rawBody = await readBody(request);
    const parsedBody = JSON.parse(rawBody) as unknown;
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      throw new Error("Invalid chat request.");
    }
    body = parsedBody as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return json({ error: "Chat request is too large." }, 413, chatHeaders);
    }
    return json({ error: "Invalid chat request." }, 400, chatHeaders);
  }

  let messages;
  try {
    messages = parseChatMessages(body.messages);
  } catch {
    return json({ error: "Please send a valid chat message history." }, 400, chatHeaders);
  }

  const model = getXaiChatModel();

  try {
    const completion = await createChatCompletion(
      [{ role: "system", content: PORTFOLIO_CHAT_SYSTEM_PROMPT }, ...messages],
      model,
    );

    const responseBody: ChatApiResponse = {
      message: {
        role: "assistant",
        content: completion.content,
      },
      model: completion.model,
      usage: completion.usage,
    };

    return json(responseBody, 200, chatHeaders);
  } catch (error) {
    if (error instanceof XaiApiError) {
      if (error.status === 401 || error.status === 403) {
        return json({ error: "Chat is not configured yet. Please try again later." }, 503, chatHeaders);
      }
      if (error.status === 429) {
        return json({ error: "Chat is busy right now. Please try again shortly." }, 502, chatHeaders);
      }
    }

    return json({ error: "Unable to generate a reply right now. Please try again shortly." }, 502, chatHeaders);
  }
}
