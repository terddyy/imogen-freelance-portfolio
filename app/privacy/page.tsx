import type { Metadata } from "next";
import Link from "next/link";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Privacy | Imogen Inocentes",
  description: "How your contact details are used, stored, and deleted when you reach out.",
};

export default function PrivacyPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <h1>How your details are used.</h1>
          <p>
            This page explains what happens when you contact Imogen through this website.
            It is written in plain language for people deciding whether to share a phone number or email.
          </p>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="shell routeSection privacyContent">
          <h2>Purpose</h2>
          <p>
            This website does not collect your information on its own. When you use a contact link,
            your email or messaging app sends your message directly to Imogen, and the details are used
            only to reply about scope, timing, and fit. They are not sold, and they are not used for
            marketing lists.
          </p>

          <h2>How you reach out</h2>
          <ul>
            <li>Email — the &ldquo;Contact me&rdquo; buttons open your own email app addressed to Imogen.</li>
            <li>Phone or WhatsApp — using the numbers shown on the contact page.</li>
          </ul>
          <p>
            Whatever you choose to include in that message (name, email, phone, or project notes) is
            entirely up to you.
          </p>

          <h2>Who receives your information</h2>
          <ul>
            <li>
              <strong>Imogen</strong> — receives your message in a personal inbox or messaging app. No
              third-party form, database, or delivery service sits between you and that inbox.
            </li>
            <li>
              <strong>Hosting provider</strong> (for example Vercel) — may retain standard request logs
              for the pages you view, according to their policy.
            </li>
          </ul>

          <h2>Retention</h2>
          <p>
            This site does not keep a contact database. Your message lives in Imogen&apos;s inbox or
            messaging history until deleted there on request.
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            This site does not use analytics, advertising, or social-media tracking cookies. The only
            storage used is for strictly necessary site functions:
          </p>
          <ul>
            <li>
              <strong>Theme preference</strong> — stored in your browser&apos;s local storage under{" "}
              <code>imogen-theme</code> so your dark/light choice is remembered. It is saved only after
              you accept necessary cookies.
            </li>
            <li>
              <strong>Cookie consent</strong> — stored in local storage under{" "}
              <code>imogen-cookie-consent</code> so your accept or reject choice is remembered and the
              notice is not shown again.
            </li>
          </ul>

          <h2>Your choices</h2>
          <p>
            On first visit you can accept necessary cookies or reject all. Rejecting still lets you
            browse; theme preference is simply not saved. You decide what to share whenever you choose
            to contact Imogen.
          </p>

          <h2>Deletion requests</h2>
          <p>
            To ask for a message you sent to be deleted, email{" "}
            <a href="mailto:terd@zentariph.com">terd@zentariph.com</a> from the address you used, or
            include the phone number you contacted from.
          </p>

          <p className="privacyMeta">Last updated: August 18, 2026</p>

          <div className="privacyActions">
            <ProjectInquiryTrigger className="primaryButton">
              Contact me
            </ProjectInquiryTrigger>
            <Link href="/contact" className="secondaryButton">
              Back to contact
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
}
