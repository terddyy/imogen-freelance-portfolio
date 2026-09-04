"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import { AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import type { ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import { LinkedInIcon, GitHubIcon, FacebookIcon, EmailIcon } from "@/components/SocialIcons";
import { motionTiming } from "@/lib/motion-presets";
import { primaryNav, socials } from "@/lib/portfolio-data";
import styles from "./Header.module.css";

const SCROLL_ON = 48;
const SCROLL_OFF = 16;

const socialIconMap: Record<string, ComponentType<{ size?: number }>> = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Email: EmailIcon,
};

const menuListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motionTiming.stagger,
      delayChildren: 0.06,
    },
  },
};

const menuLinkVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTiming.base, ease: motionTiming.ease },
  },
};

const menuFooterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTiming.base,
      ease: motionTiming.ease,
      delay: primaryNav.length * motionTiming.stagger + 0.1,
    },
  },
};

export function Header() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const emailSocial = socials.find((item) => item.label === "Email");

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

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      <motion.header
        className={styles.siteHeader}
        data-scrolled={isScrolled ? "true" : "false"}
        aria-label="Mobile navigation"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{
          opacity: 1,
          y: shouldReduceMotion ? 0 : isScrolled ? -1 : 0,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                opacity: { duration: motionTiming.section, ease: motionTiming.ease },
                y: { type: "spring", stiffness: 420, damping: 34, mass: 0.85 },
              }
        }
      >
        <Link className={styles.brandMark} href="/" aria-label="Imogen Inocentes home" onClick={scrollToTop}>
          <strong>IMOGEN</strong>
          <small>INOCENTES.</small>
        </Link>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="primary-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className={styles.menuToggleBars} data-open={isMenuOpen ? "true" : "false"}>
              <span />
              <span />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            className={styles.menuOverlay}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: motionTiming.fast, ease: motionTiming.ease }}
          >
            <nav id="primary-menu" className={styles.menuPanel} aria-label="Main menu">
              <motion.ul
                className={styles.menuList}
                initial={shouldReduceMotion ? false : "hidden"}
                animate="visible"
                variants={shouldReduceMotion ? undefined : menuListVariants}
              >
                {primaryNav.map((item, index) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <motion.li key={item.href} variants={shouldReduceMotion ? undefined : menuLinkVariants}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={item.href === "/" ? scrollToTop : undefined}
                      >
                        <span className={styles.menuIndex}>{String(index + 1).padStart(2, "0")}</span>
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.div
                className={styles.menuFooter}
                initial={shouldReduceMotion ? false : "hidden"}
                animate="visible"
                variants={shouldReduceMotion ? undefined : menuFooterVariants}
              >
                <div className={styles.menuFooterTop}>
                  <span className={styles.menuHint}>Open for select projects</span>
                  {emailSocial ? (
                    <a className={styles.menuEmail} href={emailSocial.href}>
                      {emailSocial.href.replace("mailto:", "")}
                    </a>
                  ) : null}
                  <div className={styles.menuSocials} aria-label="Social links">
                    {socials.map((item) => {
                      const Icon = socialIconMap[item.label];
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                          aria-label={item.label}
                        >
                          {Icon ? <Icon size={17} /> : null}
                        </a>
                      );
                    })}
                  </div>
                </div>
                <ProjectInquiryTrigger className={`primaryButton ${styles.menuCta}`}>
                  Contact me
                </ProjectInquiryTrigger>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
