import { ArrowRight, Mail } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { contactMethods, pricingTiers } from "@/lib/portfolio-data";

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
              This form-style interface is a frontend-only placeholder. Use the email link for now, then
              connect the fields to a real form handler when Imogen is ready to collect inquiries.
            </p>
            <a className="primaryButton" href="mailto:hello@imogeninocentes.dev">
              <Mail size={17} />
              Email Imogen
            </a>
          </div>

          <form className="contactForm" aria-label="Project inquiry preview">
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              Project type
              <select defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                {pricingTiers.map((tier) => (
                  <option key={tier.name}>{tier.name}</option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea placeholder="Share goals, pages, references, and timing." rows={5} />
            </label>
            <button className="secondaryButton" type="button" aria-describedby="form-note">
              Preview only
              <ArrowRight size={16} />
            </button>
            <p id="form-note">No message is submitted in this v1 build.</p>
          </form>
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
