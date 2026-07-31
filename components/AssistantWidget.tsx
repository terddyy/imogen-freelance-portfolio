"use client";

import { Bot, ChevronDown, MessageCircle, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { assistantPrompts } from "@/lib/portfolio-data";

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      {!open ? (
        <motion.button
          className="assistantLauncher"
          type="button"
          key="launcher"
          aria-label="Open portfolio assistant"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        >
          <MessageCircle size={18} />
          <span>Ask about Imogen</span>
        </motion.button>
      ) : (
        <motion.aside
          className="assistant"
          aria-label="Visual portfolio assistant"
          key="panel"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14, scale: shouldReduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: shouldReduceMotion ? 1 : 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="assistantHeader">
            <span className="assistantAvatar">
              <Bot size={18} />
            </span>
            <div>
              <strong>Ask about Imogen&apos;s work</strong>
              <small>Visual demo only</small>
            </div>
            <button className="iconButton" type="button" aria-label="Minimize assistant" onClick={() => setOpen(false)}>
              <ChevronDown size={17} />
            </button>
          </div>
          <div className="assistantBody">
            <p>
              This preview shell is reserved for a future grounded assistant. For now, use the contact page to
              ask about projects, timelines, and scope.
            </p>
            <div className="assistantPromptList">
              {assistantPrompts.map((prompt) => (
                <button type="button" key={prompt}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          <div className="assistantInput" aria-label="Disabled assistant input">
            <span>Assistant is not connected yet</span>
            <Send size={16} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
