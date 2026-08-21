"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const INQUIRY_HREF = "/inquire";

type ProjectInquiryTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function ProjectInquiryTrigger({ children, className }: ProjectInquiryTriggerProps) {
  return (
    <Link href={INQUIRY_HREF} className={className}>
      {children}
    </Link>
  );
}