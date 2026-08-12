"use client";

import type { ReactNode } from "react";
import { prefetchInquiryModule, useInquiryContext } from "@/components/project-inquiry-context";

type ProjectInquiryTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function ProjectInquiryTrigger({ children, className }: ProjectInquiryTriggerProps) {
  const { openInquiry } = useInquiryContext();

  return (
    <button
      type="button"
      className={className}
      onClick={openInquiry}
      onMouseEnter={prefetchInquiryModule}
      onFocus={prefetchInquiryModule}
    >
      {children}
    </button>
  );
}
