"use client";

import { useCallback, useState } from "react";
import { CHAT_MAX_MESSAGES } from "@/lib/chatbot/config";
import { validateUserChatMessage } from "@/lib/chatbot/guardrails";
import type { ChatMessage } from "@/lib/chatbot/types";
import {
  createAssistantMessage,
  createUserMessage,
  createWelcomeMessage,
  type PortfolioChatMessage,
} from "@/components/ui/portfolio-chat-panel";

type ChatApiSuccess = {
  message: ChatMessage;
};

function toApiMessages(messages: PortfolioChatMessage[]): ChatMessage[] {
  return messages
    .filter((message) => message.id !== "welcome" && message.status !== "error")
    .map(({ role, content }) => ({ role, content }));
}

export function usePortfolioChat(canSend: boolean) {
  const [messages, setMessages] = useState<PortfolioChatMessage[]>([createWelcomeMessage()]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async () => {
    if (!canSend || isLoading) return;

    const validation = validateUserChatMessage(draft);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    const userMessage = createUserMessage(validation.content);
    const apiMessages = [...toApiMessages(messages), { role: "user" as const, content: validation.content }];

    if (apiMessages.length > CHAT_MAX_MESSAGES) {
      setError(`Please start a shorter thread — max ${CHAT_MAX_MESSAGES} messages.`);
      return;
    }

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const payload = (await response.json()) as ChatApiSuccess & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to get a reply right now.");
      }

      setMessages((current) => [
        ...current.map((message) =>
          message.id === userMessage.id ? { ...message, status: "sent" as const } : message,
        ),
        createAssistantMessage(payload.message.content),
      ]);
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : "Unable to get a reply right now.";
      setMessages((current) =>
        current.map((entry) => (entry.id === userMessage.id ? { ...entry, status: "error" as const } : entry)),
      );
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [canSend, draft, isLoading, messages]);

  return {
    messages,
    draft,
    isLoading,
    error,
    setDraft,
    sendMessage,
    setError,
  };
}
