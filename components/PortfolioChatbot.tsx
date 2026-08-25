"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { PortfolioChatPanel } from "@/components/ui/portfolio-chat-panel";
import { usePortfolioChat } from "@/hooks/usePortfolioChat";
import { hasCookieConsent, onCookieConsentChange } from "@/lib/cookie-consent";
import { motionTiming } from "@/lib/motion-presets";
import { useScrollDirectionVisibility } from "@/hooks/useScrollDirectionVisibility";
import styles from "./PortfolioChatbot.module.css";

export function PortfolioChatbot() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const dockVisible = useScrollDirectionVisibility();
  const [isOpen, setIsOpen] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const { messages, draft, isLoading, error, setDraft, sendMessage, setError } = usePortfolioChat(canSend);

  useEffect(() => {
    const syncConsent = () => setCanSend(hasCookieConsent());
    syncConsent();
    return onCookieConsentChange(syncConsent);
  }, []);

  if (pathname === "/inquire") return null;

  return (
    <div className={styles.portfolioChatbot} data-open={isOpen}>
      <motion.div
        id="portfolio-chat-panel"
        className={styles.portfolioChatbotPanel}
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : 16,
          scale: isOpen ? 1 : 0.96,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                opacity: { duration: motionTiming.fast, ease: motionTiming.ease },
                y: { type: "spring", stiffness: 380, damping: 32, mass: 0.9 },
                scale: { duration: motionTiming.fast, ease: motionTiming.ease },
                pointerEvents: { duration: 0 },
              }
        }
        aria-hidden={!isOpen}
      >
        <PortfolioChatPanel
          messages={messages}
          draft={draft}
          isLoading={isLoading}
          error={error}
          canSend={canSend}
          onDraftChange={(value) => {
            setDraft(value);
            if (error) setError(null);
          }}
          onSend={sendMessage}
        />
      </motion.div>

      <motion.button
        type="button"
        className={styles.portfolioChatbotLauncher}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-panel"
        aria-label={isOpen ? "Close portfolio chat" : "Open portfolio chat"}
        onClick={() => setIsOpen((open) => !open)}
        initial={false}
        animate={{
          opacity: dockVisible || isOpen ? 1 : 0,
          y: dockVisible || isOpen ? 0 : 20,
          scale: dockVisible || isOpen ? 1 : 0.94,
          pointerEvents: dockVisible || isOpen ? "auto" : "none",
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                opacity: { duration: motionTiming.fast, ease: motionTiming.ease },
                y: { type: "spring", stiffness: 380, damping: 32, mass: 0.9 },
                scale: { duration: motionTiming.fast, ease: motionTiming.ease },
                pointerEvents: { duration: 0 },
              }
        }
      >
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
        <span>{isOpen ? "Close" : "Chat"}</span>
      </motion.button>
    </div>
  );
}
