"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { useCallback } from "react";
import { FolderKanban, House, Quote, Send } from "lucide-react";
import { motionTiming } from "@/lib/motion-presets";
import { useScrollDirectionVisibility } from "@/hooks/useScrollDirectionVisibility";

const items = [
  { label: "Home", href: "/", icon: House },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Testimonials", href: "/testimonials", icon: Quote },
  { label: "Contact", href: "/contact", icon: Send },
] as const;

const HIDDEN_Y = 32;

export function MobileNav() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const visible = useScrollDirectionVisibility();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (pathname === "/inquire") return null;

  return (
    <nav className="mobileDock" aria-label="Mobile navigation">
      <motion.div
        className="mobileDockBar"
        aria-hidden={!visible}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : HIDDEN_Y,
          pointerEvents: visible ? "auto" : "none",
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                opacity: { duration: motionTiming.fast, ease: motionTiming.ease },
                y: { type: "spring", stiffness: 380, damping: 32, mass: 0.9 },
                pointerEvents: { duration: 0 },
              }
        }
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              href={item.href}
              key={item.href}
              className={isActive ? "mobileDockTab isActive" : "mobileDockTab"}
              aria-current={isActive ? "page" : undefined}
              onClick={item.href === "/" ? scrollToTop : undefined}
            >
              <span className="mobileDockIcon" aria-hidden="true">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  fill={isActive ? "currentColor" : "none"}
                />
              </span>
              <span className="mobileDockLabel">{item.label}</span>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}