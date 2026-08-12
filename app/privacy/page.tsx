import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";

export const metadata: Metadata = {
  title: "Privacy | Imogen Inocentes",
  description: "How project inquiry contact details are used, stored, and deleted.",
};

export default function PrivacyPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <span className="sectionLabel">Privacy</span>
          <h1>How your inquiry details are used.</h1>
          <p>
            This page explains what happens when you send a project inquiry through this website.
            It is written in plain language for people deciding whether to share a phone number or email.
          </p>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="shell routeSection privacyContent">
          <h2>Purpose</h2>
          <p>
            Contact details and project answers are collected only so Imogen can reply about scope,
            timing, and fit. They are not sold, and they are not used for marketing lists.
          </p>

          <h2>What you may share</h2>
          <ul>
            <li>Phone number and/or email address (at least one is required)</li>
            <li>Optional website URL</li>
            <li>Project type, budget range, team size, and optional project notes</li>
          </ul>

          <h2>Who receives your information</h2>
          <ul>
            <li>
              <strong>Resend</strong> — sends the full inquiry by email to the site operator
              (`terd@zentariph.com`). If you provide an email, it may be set as the reply address.
            </li>
            <li>
              <strong>IPROG SMS</strong> — sends a short alert to the operator&apos;s phone. The SMS does
              not include your free-text project notes.
            </li>
            <li>
              <strong>Upstash Redis</strong> — stores rate-limit counters keyed by a hashed IP
              fingerprint, not your form answers.
            </li>
            <li>
              <strong>Cloudflare Turnstile</strong> — verifies that a submission is likely from a real
              person (bot protection). It does not receive your project notes.
            </li>
            <li>
              <strong>Hosting provider</strong> (for example Vercel) — may retain standard request logs
              according to their policy.
            </li>
          </ul>

          <h2>Retention</h2>
          <p>
            This site does not keep an inquiry database. Details live in the operator&apos;s email inbox,
            Resend delivery history, and IPROG SMS history until deleted there on request.
          </p>

          <h2>Your choices</h2>
          <p>
            You can contact Imogen by phone or WhatsApp instead of the form. On the form, you must
            confirm you understand this notice before submitting.
          </p>

          <h2>Deletion requests</h2>
          <p>
            To ask for your inquiry details to be deleted from email/SMS records, email{" "}
            <a href="mailto:terd@zentariph.com">terd@zentariph.com</a> from the address you used, or
            include the phone number you submitted.
          </p>

          <p className="privacyMeta">Last updated: August 12, 2026</p>

          <div className="privacyActions">
            <ProjectInquiryTrigger className="primaryButton">Start a project</ProjectInquiryTrigger>
            <Link href="/contact" className="secondaryButton">
              Back to contact
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
}
