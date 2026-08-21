"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectInquiryForm } from "@/components/ProjectInquiryForm";

export function InquirySection() {
  return (
    <section
      className="inquiryViewport shell inquiryViewport--page"
      id="inquire"
      aria-label="Project inquiry"
      data-inquiry-section
      data-inquiry-theme="light"
    >
      <Link className="inquiryBackHome" href="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to site
      </Link>
      <div className="inquiryViewportIntro">
        <span className="sectionLabel">Project inquiry</span>
        <h1>Let&apos;s scope your next build.</h1>
      </div>
      <ProjectInquiryForm compact />
    </section>
  );
}