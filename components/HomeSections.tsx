import Image from "next/image";
import Link from "next/link";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
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

export function FeaturedProjects() {
  return <FeaturedProjectCarousel projects={projects} />;
}

export function HomeTestimonials() {
  return <HomeTestimonialsStack />;
}

export function AboutSection() {
  return (
    <section className="shell pageSection aboutSection" id="about">
      <div>
        <span className="sectionLabel">About Imogen</span>
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
        label="Services"
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
        label="Pricing"
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
        label="Tools"
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
    <section className="shell finalCta" id="contact">
      <div>
        <span className="sectionLabel">Start Here</span>
        <h2>Have a project in mind?</h2>
        <p>Tell us what you need — we&apos;ll reply with a clear next step.</p>
      </div>
      <ProjectInquiryTrigger className="primaryButton">
        Send Inquiry
        <ArrowRight size={17} />
      </ProjectInquiryTrigger>
    </section>
  );
}

export function TestimonialsRouteContent() {
  return <TestimonialList />;
}

type SectionHeadingProps = {
  label: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
};

function SectionHeading({ label, title, body, href, cta }: SectionHeadingProps) {
  return (
    <div className="sectionHeading">
      <div>
        <span className="sectionLabel">{label}</span>
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
