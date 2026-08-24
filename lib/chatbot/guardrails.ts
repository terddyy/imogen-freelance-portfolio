import { CHAT_MAX_MESSAGE_CHARS } from "@/lib/chatbot/config";

const blockedPatterns = [
  /\b(ignore|disregard|forget)\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)\b/i,
  /\b(you are now|act as|pretend to be|roleplay as)\b/i,
  /\b(system prompt|developer message|hidden instructions?)\b/i,
  /\b(jailbreak|dan mode|do anything now)\b/i,
];

const suspiciousPatterns = [
  /(https?:\/\/[^\s]+){4,}/i,
  /(.)\1{24,}/,
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/,
];

export type ChatGuardrailResult =
  | { ok: true; content: string }
  | { ok: false; error: string };

export function sanitizeChatContent(content: string) {
  return content.replace(/\u0000/g, "").trim();
}

export function validateUserChatMessage(content: string): ChatGuardrailResult {
  const sanitized = sanitizeChatContent(content);

  if (!sanitized) {
    return { ok: false, error: "Please enter a message before sending." };
  }

  if (sanitized.length > CHAT_MAX_MESSAGE_CHARS) {
    return {
      ok: false,
      error: `Messages must be ${CHAT_MAX_MESSAGE_CHARS.toLocaleString()} characters or fewer.`,
    };
  }

  for (const pattern of blockedPatterns) {
    if (pattern.test(sanitized)) {
      return {
        ok: false,
        error: "I can only help with questions about Imogen's freelance services.",
      };
    }
  }

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return {
        ok: false,
        error: "That message looks unusual. Please rephrase your question.",
      };
    }
  }

  return { ok: true, content: sanitized };
}
