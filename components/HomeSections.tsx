import Image from "next/image";
import Link from "next/link";
import heroBackground from "@/public/Hero-background.webp";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Check,
  CircleDot,
  Mail,
} from "lucide-react";
import {
  aboutHighlights,
  pricingTiers,
  processSteps,
  projects,
  services,
  testimonials,
  toolCards,
} from "@/lib/portfolio-data";
import { getPortfolioIcon } from "@/lib/portfolio-icons";
import { FeaturedProjectCarousel } from "@/components/FeaturedProjectCarousel";
import { HeroAnimationController } from "@/components/HeroAnimationController";
import { TestimonialList } from "@/components/TestimonialList";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";

export function HeroSection() {
  return (
    <section className="heroSection" id="hero" aria-label="Imogen Inocentes hero">
      <HeroAnimationController />
      <div className="heroBackgroundFrame" aria-hidden="true">
        <Image
          className="heroBackground"
          src={heroBackground}
          alt="Imogen Inocentes in a dark studio portrait"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
        />
      </div>
      <div className="heroShade" />

      <div className="heroBrandCloud" aria-hidden="true">
        <span className="heroBrand heroBrandAws">
          <Image src="/logos/aws.svg" alt="" width={160} height={88} loading="lazy" />
        </span>
        <span className="heroBrand heroBrandGoogle">
          <Image src="/logos/google.svg" alt="" width={136} height={46} loading="lazy" />
        </span>
        <span className="heroBrand heroBrandMicrosoft">
          <Image src="/logos/microsoft.svg" alt="" width={36} height={36} loading="lazy" />
        </span>
        <span className="heroBrand heroBrandOracle">
          <Image src="/logos/oracle.svg" alt="" width={112} height={18} loading="lazy" />
        </span>
        <span className="heroBrand heroBrandIbm">
          <Image src="/logos/ibm.svg" alt="" width={72} height={26} loading="lazy" />
        </span>
        <span className="heroBrand heroBrandAzure">
          <Image src="/logos/azure.svg" alt="" width={36} height={36} loading="lazy" />
        </span>
        <span className="heroBrand heroBrandAsu">
          <Image src="/logos/asu.svg" alt="" width={118} height={26} loading="lazy" />
        </span>
      </div>

      <div className="shell heroContent">
        <div className="heroCopy">
          <p className="heroKicker">
            <span>01</span>
            Lead full-stack development · Scalable software
          </p>
          <span className="availability">
            <CircleDot size={14} />
            Available for select builds
          </span>
          <h1>
            Complex problems.
            <em>Clear software.</em>
          </h1>
          <div className="heroMeta heroMetaInline">
            <strong className="heroRoleLine">Lead Full Stack Engineer</strong>
            <a href="https://nexvision.info/" target="_blank" rel="noreferrer">
              Nexvision Innovations
              <ArrowUpRight size={15} />
            </a>
            <a href="https://www.facebook.com/zentarisoftwaresolution" target="_blank" rel="noreferrer">
              Co-founder &amp; CEO, Zentari
              <ArrowUpRight size={15} />
            </a>
          </div>
          <p className="heroIntro">
            5 years of experience building scalable software across web products, internal systems, and
            workflow automation.
          </p>
          <div className="buttonRow">
            <ProjectInquiryTrigger className="primaryButton heroPrimary">
              Inquire a project
              <ArrowUpRight size={17} aria-hidden="true" />
            </ProjectInquiryTrigger>
            <Link className="secondaryButton heroSecondary" href="/projects">
              Explore the work
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="socialRow heroSocials" aria-label="Social links">
            <a href="https://www.linkedin.com/in/terd/" aria-label="LinkedIn">
              <span className="socialGlyph">in</span>
            </a>
            <a href="https://github.com/terddyy" aria-label="GitHub">
              <span className="socialGlyph">gh</span>
            </a>
            <a href="mailto:terd@zentariph.com" aria-label="Email Imogen">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="scrollCue" aria-hidden="true">
        <ChevronDown size={22} />
        <ChevronDown size={22} />
        <ChevronDown size={22} />
      </div>
    </section>
  );
}

export function FeaturedProjects() {
  return <FeaturedProjectCarousel projects={projects} />;
}

export function HomeTestimonials() {
  return (
    <section className="shell pageSection" id="notes">
      <SectionHeading
        label="Client Notes"
        title="Feedback space that does not invent client claims."
        body="The section keeps the reference site's social-proof structure, but the copy stays explicitly placeholder-safe until real testimonials are approved."
        href="/testimonials"
        cta="See all"
      />
      <div className="testimonialPreview">
        {testimonials.map((testimonial) => (
          <article className="testimonialCard" key={testimonial.initials}>
            <div className="testimonialHeader">
              <span className="testimonialAvatar">{testimonial.initials}</span>
              <div>
                <h3>{testimonial.name}</h3>
                <p>{testimonial.role}</p>
              </div>
            </div>
            <p>{testimonial.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="shell pageSection aboutSection" id="about">
      <div>
        <span className="sectionLabel">About Imogen</span>
        <h2>Independent freelancer, practical design partner, calm launch process.</h2>
        <p>
          Imogen Inocentes works with founders, service providers, and small teams who need a site
          that is clear, usable, and easy to keep improving. The focus is simple: make the offer
          understandable, make the next step obvious, and make the interface feel polished on every screen.
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
        title="Freelance help for focused websites and simple digital workflows."
        body="The services mirror the reference site's breadth while keeping the positioning solo, practical, and Imogen-specific."
      />
      <div className="serviceGrid">
        {services.map((service) => {
          const Icon = getPortfolioIcon(service.iconKey);
          return (
            <article className="serviceCard" key={service.title}>
              <span className="serviceIcon">
                <Icon size={20} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="shell pageSection" id="process">
      <SectionHeading
        label="Process"
        title="A clear path from first message to launch handoff."
        body="Each phase gives both sides a concrete checkpoint, so the work stays scoped and the site has a reliable path to completion."
      />
      <div className="processGrid">
        {processSteps.map((step) => (
          <article className="processCard" key={step.number}>
            <span>{step.number}</span>
            <small>{step.label}</small>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="shell pageSection" id="pricing">
      <SectionHeading
        label="Pricing"
        title="Placeholder tiers for planning conversations."
        body="The ranges are intentionally starter estimates, not final quotes. Real pricing should be confirmed against scope, content, and launch timeline."
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
        label="Tools I Work With"
        title="A GitHub-style area for public work when it is ready."
        body="Instead of showing empty or private repositories, this section keeps the reference site's technical credibility area as honest placeholders."
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
        <p>Tell Imogen what you need and she&apos;ll reply with a clear next step for scope, timeline, and fit.</p>
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
