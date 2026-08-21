"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { FolderKanban, House, Quote, Send } from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: House },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Testimonials", href: "/testimonials", icon: Quote },
  { label: "Contact", href: "/contact", icon: Send },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <nav className="mobileDock" aria-label="Mobile navigation">
      <div className="mobileDockBar">
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
      </div>
    </nav>
  );
}
