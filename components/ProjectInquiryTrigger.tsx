import type { ReactNode } from "react";

const CONTACT_EMAIL = "terddy03@gmail.com";
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;

type ProjectInquiryTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function ProjectInquiryTrigger({ children, className }: ProjectInquiryTriggerProps) {
  return (
    <a href={CONTACT_HREF} className={className}>
      {children}
    </a>
  );
}
