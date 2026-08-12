"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, House, Send, UserRound } from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: House },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "About", href: "/about", icon: UserRound },
  { label: "Contact", href: "/contact", icon: Send },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobileDock" aria-label="Mobile navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link href={item.href} key={item.href} aria-current={isActive ? "page" : undefined}>
            <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
