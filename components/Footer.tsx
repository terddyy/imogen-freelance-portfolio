import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navItems, socials } from "@/lib/portfolio-data";

export function Footer() {
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
          {socials.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </div>
      <div className="shell footerBottom">
        <span>Copyright 2026 Imogen Inocentes.</span>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
