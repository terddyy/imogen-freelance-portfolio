import Image from "next/image";
import Link from "next/link";
import { ProjectInquiryTrigger } from "@/components/ProjectInquiryTrigger";
import heroBackground from "@/public/Hero-background.webp";
import { ArrowRight, ArrowUpRight, ChevronDown, CircleDot, Mail } from "lucide-react";
import { HeroAnimationController } from "@/components/HeroAnimationController";
import styles from "@/components/HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.section} id="hero" aria-label="Imogen Inocentes hero">
      <HeroAnimationController />
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.backgroundFrame}>
          <Image
            className={styles.background}
            src={heroBackground}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1920px"
          />
        </div>
        <div className={styles.shade} />
        <div className={styles.brandCloud}>
          <span className={`${styles.brand} ${styles.brandAws}`}>
            <Image src="/logos/aws.svg" alt="" width={160} height={88} loading="lazy" />
          </span>
          <span className={`${styles.brand} ${styles.brandGoogle}`}>
            <Image src="/logos/google.svg" alt="" width={136} height={46} loading="lazy" />
          </span>
          <span className={`${styles.brand} ${styles.brandMicrosoft}`}>
            <Image src="/logos/microsoft.svg" alt="" width={36} height={36} loading="lazy" />
          </span>
          <span className={`${styles.brand} ${styles.brandOracle}`}>
            <Image src="/logos/oracle.svg" alt="" width={112} height={18} loading="lazy" />
          </span>
          <span className={`${styles.brand} ${styles.brandIbm}`}>
            <Image src="/logos/ibm.svg" alt="" width={72} height={26} loading="lazy" />
          </span>
          <span className={`${styles.brand} ${styles.brandAzure}`}>
            <Image src="/logos/azure.svg" alt="" width={36} height={36} loading="lazy" />
          </span>
          <span className={`${styles.brand} ${styles.brandAsu}`}>
            <Image src="/logos/asu.svg" alt="" width={118} height={26} loading="lazy" />
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.kicker}>
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
          <div className={styles.meta}>
            <strong className={styles.roleLine}>Lead Full Stack Developer</strong>
            <a href="https://nexvision.info/" target="_blank" rel="noreferrer">
              Nexvision Innovations
              <ArrowUpRight size={15} />
            </a>
            <a href="https://www.facebook.com/zentarisoftwaresolution" target="_blank" rel="noreferrer">
              Co-founder &amp; CEO, Zentari
              <ArrowUpRight size={15} />
            </a>
          </div>
          <p className={styles.intro}>
            5 years of experience building scalable software across web products, internal systems, and
            workflow automation.
          </p>
          <div className={styles.actions}>
          <ProjectInquiryTrigger className={`primaryButton ${styles.primary}`}>
            Inquire a project
            <ArrowUpRight size={17} aria-hidden="true" />
          </ProjectInquiryTrigger>
            <Link className={`secondaryButton ${styles.secondary}`} href="/projects">
              Explore the work
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={`socialRow ${styles.socials}`} aria-label="Social links">
            <a href="https://www.linkedin.com/in/terd/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <span className="socialGlyph">in</span>
            </a>
            <a href="https://github.com/terddyy" target="_blank" rel="noreferrer" aria-label="GitHub">
              <span className="socialGlyph">gh</span>
            </a>
            <a href="mailto:terd@zentariph.com" aria-label="Email Imogen">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <ChevronDown size={22} />
        <ChevronDown size={22} />
        <ChevronDown size={22} />
      </div>
    </section>
  );
}
