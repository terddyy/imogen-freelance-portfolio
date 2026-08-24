"use client";

import { useCallback, useEffect, useRef } from "react";
import { format } from "date-fns";
import { AlertCircle, Bot, LoaderCircle, SendIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CHAT_MAX_MESSAGE_CHARS } from "@/lib/chatbot/config";
import { validateUserChatMessage } from "@/lib/chatbot/guardrails";
import type { ChatMessage } from "@/lib/chatbot/types";
import { cn } from "@/lib/utils";

const ASSISTANT_NAME = "Imogen AI";
const ASSISTANT_AVATAR = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150";
const USER_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150";

export type PortfolioChatMessage = ChatMessage & {
  id: string;
  sender: string;
  avatar: string;
  timestamp: string;
  isOwn: boolean;
  status?: "sending" | "sent" | "error";
};

type PortfolioChatPanelProps = {
  messages: PortfolioChatMessage[];
  draft: string;
  isLoading: boolean;
  error: string | null;
  canSend: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  className?: string;
};

function formatMessageTime(timestamp: string) {
  return format(new Date(timestamp), "h:mm a");
}

function scrollViewportToBottom(container: HTMLElement | null) {
  const viewport = container?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null;
  if (viewport) {
    viewport.scrollTop = viewport.scrollHeight;
  }
}

export function PortfolioChatPanel({
  messages,
  draft,
  isLoading,
  error,
  canSend,
  onDraftChange,
  onSend,
  className,
}: PortfolioChatPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollViewportToBottom(scrollAreaRef.current);
  }, []);

  useEffect(() => {
    scrollToBottom();
    const timeout = window.setTimeout(scrollToBottom, 100);
    return () => window.clearTimeout(timeout);
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = () => {
    if (!canSend || isLoading || !draft.trim()) return;
    onSend();
    window.setTimeout(() => scrollViewportToBottom(scrollAreaRef.current), 100);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const remainingChars = CHAT_MAX_MESSAGE_CHARS - draft.length;
  const isNearLimit = remainingChars <= 120;

  return (
    <div
      className={cn(
        "relative flex h-[min(560px,calc(100dvh-10rem))] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] shadow-[var(--shadow-glass)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 border border-[color:var(--line)]">
            <AvatarImage src={ASSISTANT_AVATAR} alt={ASSISTANT_NAME} />
            <AvatarFallback>
              <Bot className="h-4 w-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[color:var(--text)]">{ASSISTANT_NAME}</p>
            <p className="text-xs text-[color:var(--muted)]">Portfolio assistant · replies may take a moment</p>
          </div>
        </div>
        <span className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--green)]">
          Beta
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <div ref={scrollAreaRef} className="h-full">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.isOwn ? "flex-row-reverse" : "flex-row")}
                >
                  <Avatar className="h-8 w-8 shrink-0 border border-[color:var(--line)]">
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback>
                      {message.isOwn
                        ? "Y"
                        : message.sender
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex max-w-[78%] flex-col gap-1",
                      message.isOwn ? "items-end" : "items-start",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[color:var(--text)]">{message.sender}</span>
                      <span className="text-xs text-[color:var(--muted)]">
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                        message.isOwn
                          ? "bg-[linear-gradient(135deg,var(--cyan),var(--green))] text-[#04120a]"
                          : "border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]",
                        message.status === "error" && "border border-red-400/40 bg-red-500/10 text-red-100",
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="flex items-center gap-2 px-1 text-xs text-[color:var(--muted)]">
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Imogen AI is typing...
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-[color:var(--surface-strong)] to-transparent" />
      </div>

      <div className="relative z-20 shrink-0 border-t border-[color:var(--line)] bg-[color:var(--surface-strong)] p-3">
        {error ? (
          <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        ) : null}

        <div className="flex gap-2">
          <Input
            placeholder={canSend ? "Ask about services, process, or timelines..." : "Accept cookies to chat"}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!canSend || isLoading}
            maxLength={CHAT_MAX_MESSAGE_CHARS}
            aria-label="Chat message"
            className="flex-1 border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)] placeholder:text-[color:var(--dim)] focus-visible:ring-[color:var(--cyan)]"
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!canSend || isLoading || !draft.trim()}
            aria-label="Send message"
            className="bg-[linear-gradient(135deg,var(--cyan),var(--green))] text-[#04120a] hover:opacity-90"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-[color:var(--muted)]">
          <p>Portfolio questions only. No sensitive personal data.</p>
          <p className={cn(isNearLimit && "text-[color:var(--amber)]")}>{remainingChars}</p>
        </div>
      </div>
    </div>
  );
}

export function createWelcomeMessage(): PortfolioChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    sender: ASSISTANT_NAME,
    avatar: ASSISTANT_AVATAR,
    content:
      "Hi — I'm Imogen's portfolio assistant. Ask about services, project types, timelines, or how to start an inquiry.",
    timestamp: new Date().toISOString(),
    isOwn: false,
    status: "sent",
  };
}

export function createUserMessage(content: string): PortfolioChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "user",
    sender: "You",
    avatar: USER_AVATAR,
    content,
    timestamp: new Date().toISOString(),
    isOwn: true,
    status: "sending",
  };
}

export function createAssistantMessage(content: string): PortfolioChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    sender: ASSISTANT_NAME,
    avatar: ASSISTANT_AVATAR,
    content,
    timestamp: new Date().toISOString(),
    isOwn: false,
    status: "sent",
  };
}

export function validateDraftMessage(draft: string) {
  return validateUserChatMessage(draft);
}
