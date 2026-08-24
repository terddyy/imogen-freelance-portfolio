import Image from "next/image";
import Link from "next/link";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Rocket,
  ShieldCheck,
  Sparkles,
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

const laptopRows = [0, 1, 2] as const;

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
    <section className="shell" id="contact" aria-label="Start your project">
      <div className={styles.section}>
        <div className={styles.grid}>
          <div>
            <span className={styles.eyebrow}>
              <Sparkles size={14} aria-hidden="true" />
              Let&apos;s Build Something Great
            </span>
            <h2 className={styles.heading}>
              Turn your ideas into <span className={styles.gradient}>real impact</span>.
            </h2>
            <p className={styles.lead}>
              Share your project with us and get a tailored solution that{" "}
              <span className={styles.gradient}>drives results</span>.
            </p>
            <ul className={styles.trustList} aria-label="Why work with us">
              {startHereTrust.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className={styles.trustItem}>
                    <Icon size={18} aria-hidden="true" />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.right}>
            <span className={styles.floatNote} aria-hidden="true">
              Let&apos;s make it happen.
              <ArrowDownLeft size={14} />
            </span>

            <div className={styles.scene} aria-hidden="true">
              <div className={styles.laptop}>
                <div className={styles.laptopScreen}>
                  <div className={styles.laptopHeader}>
                    <span className={styles.laptopDot} />
                    <span className={styles.laptopDot} />
                    <span className={styles.laptopDot} />
                  </div>
                  <p className={styles.laptopTitle}>
                    Your project,<br />
                    <em>our expertise.</em>
                  </p>
                  <ul className={styles.laptopList}>
                    {laptopRows.map((row) => (
                      <li key={row} className={styles.laptopRow}>
                        <Check size={14} />
                        <span className={styles.laptopBar} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.laptopBase} />
              </div>
              <div className={styles.rocketOrbit}>
                <div className={styles.rocketCube}>
                  <Rocket aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className={styles.ctaRow}>
              <ProjectInquiryTrigger className={`primaryButton ${styles.primary}`}>
                Start Your Project
                <ArrowRight size={18} aria-hidden="true" />
              </ProjectInquiryTrigger>
              <p className={styles.ctaHint}>
                <ArrowDownLeft size={14} aria-hidden="true" />
                Send us your inquiry — we&apos;ll handle the rest.
              </p>
            </div>
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
