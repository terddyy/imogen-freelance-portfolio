import Image from "next/image";
import Link from "next/link";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import {
  aboutHighlights,
  pricingTiers,
  projects,
  services,
  toolCards,
} from "@/lib/portfolio-data";
import { getPortfolioIcon } from "@/lib/portfolio-icons";
import { FeaturedProjectCarousel } from "@/components/FeaturedProjectCarousel";
import { HomeTestimonialsStack } from "@/components/HomeTestimonialsStack";
export { HeroSection } from "@/components/HeroSection";
import { TestimonialList } from "@/components/TestimonialList";
import styles from "@/components/StartHere.module.css";

const startHereTrust = [
  { icon: ShieldCheck, label: "Trusted by clients" },
  { icon: Zap, label: "Fast response" },
  { icon: Users, label: "Tailored solutions" },
] as const;

const experienceRoles = [
  { role: "Lead Full Stack Engineer", org: "Nexvision Innovations INC" },
  { role: "Founder & Lead Software Engineer", org: "Zentari Software" },
  { role: "Director of Engineering", org: "Optrizo Digital Solutions" },
  { role: "Engineer Lead", org: "WorkFlowPH" },
  { role: "Club Lead", org: "Amazon Web Services Learning Club" },
  { role: "Industry Track Scholar", org: "Arizona State University" },
  { role: "AI Engineer Intern", org: "Flyrank AI" },
  { role: "Software Engineer Intern", org: "Nexvision Innovations INC" },
] as const;

export function FeaturedProjects() {
  return <FeaturedProjectCarousel projects={projects} />;
}

export function HomeTestimonials() {
  return <HomeTestimonialsStack />;
}

export function ExperienceSection() {
  return (
    <section className="shell experienceSection" id="experience" aria-labelledby="experience-heading">
      <h2 className="experienceTitle" id="experience-heading">
        Experience
      </h2>
      <ol className="experienceList">
        {experienceRoles.map((item, index) => (
          <li key={`${item.org}-${item.role}`}>
            <span className="experienceIndex" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.role}</h3>
              <p>{item.org}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="shell pageSection aboutSection" id="about">
      <div>
        <h2>Freelancer, design partner, calm launch process.</h2>
        <p>
          Works with founders, service providers, and small teams who need a clear, usable site
          that is easy to keep improving.
        </p>
        <div className="highlightList">
          {aboutHighlights.map((item) => {
            const Icon = getPortfolioIcon(item.iconKey);
            return (
              <article className="highlightItem" key={item.title}>
                <Icon size={18} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="aboutVisual">
        <Image
          src="/placeholders/imogen-workspace.svg"
          alt="Workspace placeholder for Imogen Inocentes"
          width={720}
          height={580}
        />
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="shell pageSection" id="services">
      <SectionHeading
        title="Custom systems, websites, apps, and AI."
        body="Software built around how your work actually runs."
      />
      <div className="serviceGrid">
        {services.map((service) => {
          const Icon = getPortfolioIcon(service.iconKey);
          return (
            <article
              className={service.highlighted ? "serviceCard serviceCardFeatured" : "serviceCard"}
              key={service.title}
            >
              {service.highlighted ? <span className="planBadge">Core offer</span> : null}
              <span className="serviceIcon">
                <Icon size={20} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.offerings.map((offering) => (
                  <li key={offering}>
                    <Check size={15} />
                    {offering}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export { ProcessSection } from "@/components/ProcessSection";

export function PricingSection() {
  return (
    <section className="shell pageSection" id="pricing">
      <SectionHeading
        title="Starter ranges to plan around."
        body="Final pricing depends on scope, content, and timeline."
      />
      <div className="pricingGrid">
        {pricingTiers.map((tier) => (
          <article className={tier.highlighted ? "pricingCard pricingCardFeatured" : "pricingCard"} key={tier.name}>
            {tier.highlighted ? <span className="planBadge">Most practical</span> : null}
            <div className="planTop">
              <h3>{tier.name}</h3>
              <p>{tier.subtitle}</p>
            </div>
            <strong className="planPrice">{tier.price}</strong>
            <p>{tier.description}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link className={tier.highlighted ? "primaryButton" : "secondaryButton"} href="/contact">
              {tier.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ToolsSection() {
  return (
    <section className="shell pageSection" id="tools">
      <SectionHeading
        title="Tech stack and tools."
        body="Languages, frameworks, and tools used across projects."
      />
      <div className="toolGrid">
        {toolCards.map((card) => {
          const Icon = getPortfolioIcon(card.iconKey);
          return (
            <article className="toolCard" key={card.title}>
              <Icon size={20} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="shell" id="contact" aria-label="Contact Imogen">
      <div className={styles.section}>
        <div>
          <h2 className={styles.heading}>Let&apos;s build something great.</h2>
          <p className={styles.lead}>
            Turn your ideas into real impact. Share your project and get a tailored
            solution that drives results.
          </p>
        </div>

        <div className={styles.body}>
          <ul className={styles.trustList} aria-label="Why work with us">
            {startHereTrust.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className={styles.trustItem}>
                  <Icon size={14} aria-hidden="true" />
                  {item.label}
                </li>
              );
            })}
          </ul>
          <div className={styles.actions}>
            <ProjectInquiryTrigger className="primaryButton">
              Contact me
              <ArrowRight size={16} aria-hidden="true" />
            </ProjectInquiryTrigger>
            <Link className="secondaryButton" href="/contact">
              Contact details
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <p className={styles.hint}>Replies within one business day.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsRouteContent() {
  return <TestimonialList />;
}

type SectionHeadingProps = {
  title: string;
  body: string;
  href?: string;
  cta?: string;
};

function SectionHeading({ title, body, href, cta }: SectionHeadingProps) {
  return (
    <div className="sectionHeading">
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      {href && cta ? (
        <Link className="sectionLink" href={href}>
          {cta}
          <ArrowUpRight size={15} />
        </Link>
      ) : null}
    </div>
  );
}
