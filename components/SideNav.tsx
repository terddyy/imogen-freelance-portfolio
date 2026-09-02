"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDot } from "lucide-react";
import { useCallback } from "react";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";
import { primaryNav } from "@/lib/portfolio-data";
import styles from "@/components/SideNav.module.css";

export function SideNav() {
  const pathname = usePathname();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (pathname === "/inquire") return null;

  return (
    <aside className={styles.rail} aria-label="Site navigation">
      <Link className={styles.brandMark} href="/" aria-label="Imogen Inocentes home" onClick={scrollToTop}>
        <strong>IMOGEN</strong>
        <small>INOCENTES.</small>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        <ul className={styles.navList}>
          {primaryNav.map((item, index) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={item.href === "/" ? scrollToTop : undefined}
                >
                  <span className={styles.navIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.railFooter}>
        <span className={styles.availability}>
          <CircleDot size={11} aria-hidden="true" />
          Open for select projects
        </span>
        <ProjectInquiryTrigger className={`primaryButton ${styles.railCta}`}>Start a project</ProjectInquiryTrigger>
        <ThemeToggle />
      </div>
    </aside>
  );
}
