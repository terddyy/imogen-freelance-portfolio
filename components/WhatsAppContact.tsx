"use client";

import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { contactMethods } from "@/lib/portfolio-data";
import { motionTiming } from "@/lib/motion-presets";
import { useScrollDirectionVisibility } from "@/hooks/useScrollDirectionVisibility";

const whatsapp = contactMethods.find((method) => method.label === "WhatsApp");
const phone = contactMethods.find((method) => method.label === "Call");

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.54 0 .22 5.32.22 11.86c0 2.09.55 4.14 1.59 5.94L.12 24l6.34-1.66a11.83 11.83 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.43-8.43ZM12.09 21.7h-.01a9.82 9.82 0 0 1-5-1.37l-.36-.21-3.76.99 1-3.66-.23-.38a9.83 9.83 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.9a9.8 9.8 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.85 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

export function WhatsAppContact() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const visible = useScrollDirectionVisibility();

  if (pathname === "/inquire") return null;

  return (
    <motion.aside
      className="whatsappContact"
      aria-label="Direct contact"
      aria-hidden={!visible}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 20,
        scale: visible ? 1 : 0.94,
        pointerEvents: visible ? "auto" : "none",
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
      <a className="whatsappContactMain" href={whatsapp?.href ?? "https://wa.me/639602506993"} target="_blank" rel="noreferrer" aria-label="WhatsApp Imogen at +63 960 250 6993">
        <span className="whatsappContactIcon"><WhatsAppIcon size={21} /></span>
        <span className="whatsappContactCopy">
          <strong>WhatsApp me</strong>
          <small>+63 960 250 6993</small>
        </span>
      </a>
      <a className="whatsappContactCall" href={phone?.href ?? "tel:+639602506993"} aria-label="Call Imogen at +63 960 250 6993">
        Call
      </a>
    </motion.aside>
  );
}
