import dynamic from "next/dynamic";
import {
  AboutSection,
  FinalCta,
  HeroSection,
  HomeTestimonials,
  PricingSection,
  ProcessSection,
  ServicesSection,
  ToolsSection,
} from "@/components/HomeSections";
import { AnimatedSection } from "@/components/AnimatedSection";
import { projects } from "@/lib/portfolio-data";

const FeaturedProjectCarousel = dynamic(
  () =>
    import("@/components/FeaturedProjectCarousel").then((module) => ({
      default: module.FeaturedProjectCarousel,
    })),
  { loading: () => <div className="featuredProjectBand featuredProjectBandPlaceholder" aria-hidden /> },
);

const ProofGallery = dynamic(
  () =>
    import("@/components/ProofGallery").then((module) => ({
      default: module.ProofGallery,
    })),
  { loading: () => null },
);

export default function Home() {
  return (
    <main className="page">
      <HeroSection />
      <AnimatedSection>
        <FeaturedProjectCarousel projects={projects} />
      </AnimatedSection>
      <AnimatedSection mode="fade">
        <ProofGallery />
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
