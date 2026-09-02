import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import { ArrowRight, ArrowUpRight, CircleDot } from "lucide-react";
import { LinkedInIcon, GitHubIcon, FacebookIcon, EmailIcon } from "@/components/SocialIcons";
import { socials } from "@/lib/portfolio-data";
import styles from "@/components/HeroSection.module.css";

const socialIconMap: Record<string, ComponentType<{ size?: number }>> = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Email: EmailIcon,
};

export function HeroSection() {
  return (
    <section className={styles.section} id="hero" aria-label="Portfolio hero">
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Lead Full Stack Engineer</p>
          <h1>Imogen Inocentes</h1>
          <p className={styles.intro}>
            Five years shipping web products, internal tools, and workflow automation for teams that need
            reliable software without agency overhead. Lead developer at Nexvision Innovations; co-founder of{" "}
            <a
              href="https://www.facebook.com/zentarisoftwaresolution"
              target="_blank"
              rel="noreferrer"
              className={styles.inlineLink}
            >
              Zentari
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            .
          </p>
          <div className={styles.actions}>
            <ProjectInquiryTrigger className={`primaryButton ${styles.primary}`}>
              Start a project
              <ArrowUpRight size={17} aria-hidden="true" />
            </ProjectInquiryTrigger>
            <Link className={`secondaryButton ${styles.secondary}`} href="/projects">
              View selected work
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <span className={styles.availability}>
              <CircleDot size={11} aria-hidden="true" />
              Open for select projects
            </span>
          </div>
          <div className={`socialRow ${styles.socials}`} aria-label="Social links">
            {socials.map((item) => {
              const Icon = socialIconMap[item.label];
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={item.label}
                >
                  {Icon ? <Icon size={18} /> : null}
                </a>
              );
            })}
          </div>
        </div>

        <div className={styles.portraitSlot}>
          <Image
            src="/profile/hero-profile.png"
            alt="Portrait of Imogen Inocentes"
            fill
            priority
            sizes="(max-width: 980px) 100vw, 360px"
            className={styles.portraitImage}
          />
        </div>
      </div>
    </section>
  );
}
