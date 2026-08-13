import Link from "next/link";
import type { ReactNode } from "react";

type ProjectInquiryTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function ProjectInquiryTrigger({ children, className }: ProjectInquiryTriggerProps) {
  return (
    <Link href="/#inquire" className={className}>
      {children}
    </Link>
  );
}
