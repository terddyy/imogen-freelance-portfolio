import { Mail } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiry";
import { contactMethods } from "@/lib/portfolio-data";

export const metadata = {
  title: "Contact | Imogen Inocentes",
  description: "Send a project inquiry to Imogen Inocentes.",
};

export default function ContactPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero splitRouteHero">
          <div>
            <span className="sectionLabel">Contact</span>
            <h1>Tell Imogen what you need and what you want to launch.</h1>
            <p>
              Share a few details about your project and get a clear next step for scope, timing, and fit.
            </p>
            <ProjectInquiryTrigger className="primaryButton">Start a project</ProjectInquiryTrigger>
          </div>

          <div className="contactForm contactPrompt">
            <Mail size={22} aria-hidden="true" />
            <strong>A focused 5-step project brief</strong>
            <p>It takes about a minute and keeps every answer in one concise request.</p>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="shell routeSection">
          <div className="contactMethodGrid">
            {contactMethods.map((method) => {
              const Icon = method.icon;
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
