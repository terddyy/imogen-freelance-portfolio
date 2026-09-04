"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navItems, socials } from "@/lib/portfolio-data";
import { LinkedInIcon, GitHubIcon, FacebookIcon, EmailIcon } from "@/components/SocialIcons";
import styles from "@/components/Footer.module.css";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Email: EmailIcon,
};

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={`shell ${styles.footerGrid}`}>
        <div>
          <p className={styles.footerQuote}>Good design makes the next step obvious.</p>
          <p className={styles.footerCredit}>Imogen Inocentes</p>
        </div>
        <div className={styles.footerLinks}>
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className={styles.footerLinks}>
          {socials.map((item) => {
            const Icon = iconMap[item.label];
            return (
              <a href={item.href} key={item.label}>
                {Icon && <Icon size={14} />}
                {item.label}
                <ArrowUpRight size={13} />
              </a>
            );
          })}
        </div>
      </div>
      <div className={`shell ${styles.footerBottom}`}>
        <span>Copyright 2026 Imogen Inocentes.</span>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
