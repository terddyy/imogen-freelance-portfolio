"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useState } from "react";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import { motionTiming } from "@/lib/motion-presets";

const headerNav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/projects" },
  { label: "Testimonials", href: "/testimonials" },
];

const SCROLL_ON = 48;
const SCROLL_OFF = 16;

export function Header() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled((current) => {
      if (current) {
        return latest > SCROLL_OFF;
      }

      return latest > SCROLL_ON;
    });
  });

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.header
      className="siteHeader"
      data-scrolled={isScrolled ? "true" : "false"}
      aria-label="Primary navigation"
      initial={shouldReduceMotion ? false : { opacity: 0, x: "-50%", y: -18 }}
      animate={{
        opacity: 1,
        x: "-50%",
        y: shouldReduceMotion ? 0 : isScrolled ? -1 : 0,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              opacity: { duration: motionTiming.section, ease: motionTiming.ease },
              x: { duration: motionTiming.section, ease: motionTiming.ease },
              y: { type: "spring", stiffness: 420, damping: 34, mass: 0.85 },
            }
      }
    >
      <Link className="brandMark" href="/" aria-label="Imogen Inocentes home" onClick={scrollToTop}>
        <strong>IMOGEN</strong>
        <small>INOCENTES.</small>
      </Link>

      <nav className="navLinks" aria-label="Main menu">
        {headerNav.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={item.href === "/" ? scrollToTop : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="headerActions">
        <ProjectInquiryTrigger className="primaryButton headerCta">Start a project</ProjectInquiryTrigger>
      </div>
    </motion.header>
  );
}
