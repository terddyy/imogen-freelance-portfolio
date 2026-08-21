"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { navItems, socials } from "@/lib/portfolio-data";
import { LinkedInIcon, GitHubIcon, FacebookIcon, EmailIcon } from "@/components/SocialIcons";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Email: EmailIcon,
};

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/inquire") return null;

  return (
    <footer className="siteFooter">
      <div className="shell footerGrid">
        <div>
          <p className="footerQuote">Good design makes the next step obvious.</p>
          <p className="footerCredit">Imogen Inocentes</p>
        </div>
        <div className="footerLinks">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="footerLinks">
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
      <div className="shell footerBottom">
        <span>Copyright 2026 Imogen Inocentes.</span>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
