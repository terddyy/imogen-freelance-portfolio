import {
  AboutSection,
  FeaturedProjects,
  FinalCta,
  HeroSection,
  HomeTestimonials,
  PricingSection,
  ProcessSection,
  ServicesSection,
  SkillsMarquee,
  ToolsSection,
} from "@/components/HomeSections";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Home() {
  return (
    <main className="page">
      <HeroSection />
      <AnimatedSection>
        <FeaturedProjects />
      </AnimatedSection>
      <AnimatedSection mode="fade">
        <SkillsMarquee />
      </AnimatedSection>
      <AnimatedSection>
        <HomeTestimonials />
      </AnimatedSection>
      <AnimatedSection>
        <AboutSection />
      </AnimatedSection>
      <AnimatedSection>
        <ServicesSection />
      </AnimatedSection>
      <AnimatedSection>
        <ProcessSection />
      </AnimatedSection>
      <AnimatedSection>
        <PricingSection />
      </AnimatedSection>
      <AnimatedSection>
        <ToolsSection />
      </AnimatedSection>
      <AnimatedSection>
        <FinalCta />
      </AnimatedSection>
    </main>
  );
}
