"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

const INQUIRY_ID = "inquire";
const INQUIRY_HREF = `/#${INQUIRY_ID}`;

type ProjectInquiryTriggerProps = {
  children: ReactNode;
  className?: string;
};

function scrollToInquiry() {
  document.getElementById(INQUIRY_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProjectInquiryTrigger({ children, className }: ProjectInquiryTriggerProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") {
      return;
    }

    event.preventDefault();

    if (window.location.hash !== `#${INQUIRY_ID}`) {
      window.history.pushState(null, "", INQUIRY_HREF);
    }

    scrollToInquiry();
  }

  return (
    <Link href={INQUIRY_HREF} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
