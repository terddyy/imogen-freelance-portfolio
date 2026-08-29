"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectInquiryForm } from "@/components/ProjectInquiryForm";
import styles from "@/components/ProjectInquiryForm.module.css";

export function InquirySection() {
  return (
    <section
      className={`${styles.viewport} ${styles.viewportPage}`}
      id="inquire"
      aria-label="Project inquiry"
      data-inquiry-section
      data-inquiry-theme="light"
    >
      <div className={styles.viewportContent}>
        <Link className={styles.backHome} href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to site
        </Link>
        <div className={styles.viewportIntro}>
          <span className="sectionLabel">Project inquiry</span>
          <h1>Let&apos;s scope your next build.</h1>
        </div>
        <ProjectInquiryForm compact />
      </div>
    </section>
  );
}
