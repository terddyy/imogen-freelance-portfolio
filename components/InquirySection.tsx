"use client";

import { ProjectInquiryForm } from "@/components/ProjectInquiryForm";

type InquirySectionProps = {
  id?: string;
  page?: boolean;
};

export function InquirySection({ id = "inquire", page = false }: InquirySectionProps) {
  const Heading = page ? "h1" : "h2";

  return (
    <section
      className={`inquiryViewport shell${page ? " inquiryViewport--page" : ""}`}
      id={id}
      aria-label="Project inquiry"
      data-inquiry-section
    >
      <div className="inquiryViewportIntro">
        <span className="sectionLabel">Project inquiry</span>
        <Heading>Let&apos;s scope your next build.</Heading>
      </div>
      <ProjectInquiryForm compact />
    </section>
  );
}
