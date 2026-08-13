import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import { AnimatedSection } from "@/components/AnimatedSection";
import { contactMethods } from "@/lib/portfolio-data";
import { getPortfolioIcon } from "@/lib/portfolio-icons";

export const metadata = {
  title: "Contact | Imogen Inocentes",
  description: "Reach Imogen Inocentes by phone, WhatsApp, email, or the project inquiry form.",
};

export default function ContactPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <span className="sectionLabel">Contact</span>
          <h1>Reach Imogen directly or start with the project brief.</h1>
          <p>
            Use the channels below for a quick conversation, or send a structured inquiry when you are ready
            to share scope, budget, and timing.
          </p>
          <ProjectInquiryTrigger className="primaryButton">
            Inquire a project
            <ArrowUpRight size={17} aria-hidden="true" />
          </ProjectInquiryTrigger>
          <p className="contactPrivacyHint">
            Inquiries share contact details only so Imogen can reply.{" "}
            <Link href="/privacy">Read the privacy notice</Link>.
          </p>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="shell routeSection">
          <div className="contactMethodGrid">
            {contactMethods.map((method) => {
              const Icon = getPortfolioIcon(method.iconKey);
              return (
                <a href={method.href} key={method.label} className="contactMethodCard">
                  <Icon size={20} />
                  <span>
                    <strong>{method.label}</strong>
                    <small>{method.value}</small>
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
}
