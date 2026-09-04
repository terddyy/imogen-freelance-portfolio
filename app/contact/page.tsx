import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import { AnimatedSection } from "@/components/AnimatedSection";
import { contactMethods } from "@/lib/portfolio-data";
import { getPortfolioIcon } from "@/lib/portfolio-icons";

export const metadata = {
  title: "Contact | Imogen Inocentes",
  description: "Reach Imogen Inocentes by email, phone, or WhatsApp.",
};

export default function ContactPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <h1>Reach Imogen directly.</h1>
          <p>
            Send an email with your scope, budget, and timing, or use any of the channels below for a
            quick conversation.
          </p>
          <ProjectInquiryTrigger className="primaryButton">
            Contact me
            <ArrowUpRight size={17} aria-hidden="true" />
          </ProjectInquiryTrigger>
          <p className="contactPrivacyHint">
            Your details are used only so Imogen can reply.{" "}
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
