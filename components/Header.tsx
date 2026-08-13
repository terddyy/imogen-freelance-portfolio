"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";

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
        <strong>IMOGEN</strong>
        <small>INOCENTES.</small>
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
        <ProjectInquiryTrigger className="primaryButton headerCta">Start a project</ProjectInquiryTrigger>
      </div>
    </header>
  );
}
