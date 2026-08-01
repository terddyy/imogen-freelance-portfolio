"use client";

import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FormEvent, useState } from "react";
import { assistantPrompts } from "@/lib/portfolio-data";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const assistantReplies: Record<string, string> = {
  "What kind of websites does Imogen build?":
    "Imogen builds clear, responsive marketing sites, portfolios, landing pages, and lightweight booking or inquiry flows.",
  "Can I request a landing page?":
    "Absolutely. A focused landing page is a great fit when you need one strong message, a clear CTA, and a fast path to launch.",
  "How do project inquiries work?":
    "Start with the contact page and share your goals, timeline, and any references. Imogen will help shape the right scope from there.",
};

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const shouldReduceMotion = useReducedMotion();

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();

    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text },
      {
        id: Date.now() + 1,
        role: "assistant",
        text:
          assistantReplies[text] ??
          "That is a good place to start. Send the details through the contact page and Imogen can turn the idea into a clear next step.",
      },
    ]);
    setDraft("");
  }

  function choosePrompt(prompt: string) {
    setDraft(prompt);
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {!open ? (
        <motion.button
          className="assistantLauncher"
          type="button"
          key="launcher"
          aria-label="Open Ask Imogen assistant"
          aria-expanded={false}
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        >
          <span className="assistantLauncherIcon" aria-hidden="true">
            <MessageCircle size={18} />
            <span className="assistantLauncherDot" />
          </span>
          <span>Ask Imogen</span>
        </motion.button>
      ) : (
        <motion.aside
          className="assistant"
          aria-label="Ask Imogen assistant"
          role="dialog"
          key="panel"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14, scale: shouldReduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: shouldReduceMotion ? 1 : 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="assistantHeader">
            <span className="assistantAvatar" aria-hidden="true">
              <Bot size={19} />
            </span>
            <div className="assistantHeaderCopy">
              <span className="assistantEyebrow">Portfolio guide</span>
              <strong>Ask Imogen</strong>
              <span className="assistantStatus"><i /> Ready to help</span>
            </div>
            <button className="assistantClose" type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <X size={17} />
            </button>
          </div>

          <div className="assistantBody" aria-live="polite">
            <div className="assistantWelcome">
              <span className="assistantWelcomeIcon" aria-hidden="true"><Sparkles size={16} /></span>
              <div>
                <strong>Looking for the right starting point?</strong>
                <p>Ask about services, project fit, or how to get in touch.</p>
              </div>
            </div>

            {messages.length > 0 && (
              <div className="assistantMessages">
                {messages.map((message) => (
                  <div className={`assistantMessage assistantMessage${message.role === "user" ? "User" : "Assistant"}`} key={message.id}>
                    {message.text}
                  </div>
                ))}
              </div>
            )}

            <div className="assistantPromptHeading">
              <span>Try asking</span>
              <span>{messages.length ? "More ideas" : "Quick prompts"}</span>
            </div>
            <div className="assistantPromptList">
              {assistantPrompts.map((prompt) => (
                <button type="button" key={prompt} onClick={() => choosePrompt(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form className="assistantComposer" onSubmit={sendMessage}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a question..."
              aria-label="Ask Imogen a question"
              rows={1}
              maxLength={240}
            />
            <button type="submit" aria-label="Send question" disabled={!draft.trim()}>
              <Send size={16} />
            </button>
          </form>
          <p className="assistantNote">A quick portfolio preview, not a live support inbox.</p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
