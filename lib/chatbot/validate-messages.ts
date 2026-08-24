import { CHAT_MAX_MESSAGES } from "@/lib/chatbot/config";
import { validateUserChatMessage } from "@/lib/chatbot/guardrails";
import type { ChatMessage, ChatRole } from "@/lib/chatbot/types";

const allowedRoles = new Set<ChatRole>(["user", "assistant"]);

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseChatMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > CHAT_MAX_MESSAGES) {
    throw new Error("Invalid chat messages.");
  }

  const messages: ChatMessage[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Invalid chat messages.");
    }

    const role = getString((item as { role?: unknown }).role) as ChatRole;
    const content = getString((item as { content?: unknown }).content);
    const validation = validateUserChatMessage(content);

    if (!allowedRoles.has(role) || !validation.ok) {
      throw new Error("Invalid chat messages.");
    }

    messages.push({ role, content: validation.content });
  }

  if (messages.at(-1)?.role !== "user") {
    throw new Error("The latest chat message must be from the user.");
  }

  return messages;
}
