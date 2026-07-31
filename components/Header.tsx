"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

const headerNav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Notes", href: "/testimonials" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="siteHeader" aria-label="Primary navigation">
      <Link className="brandMark" href="/" aria-label="Imogen Inocentes home">
        <strong>
          IMOGEN<span aria-hidden="true">.</span>
        </strong>
        <small>INOCENTES</small>
      </Link>

      <nav className="navLinks" aria-label="Main menu">
        {headerNav.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="headerActions">
        <Link className="primaryButton headerCta" href="/contact">
          Start a project
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
