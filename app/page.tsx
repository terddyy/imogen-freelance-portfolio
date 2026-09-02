import dynamic from "next/dynamic";
import {
  ExperienceSection,
  FinalCta,
  HeroSection,
  ProcessSection,
  ServicesSection,
} from "@/components/HomeSections";
import { AnimatedSection } from "@/components/AnimatedSection";
import featuredStyles from "@/components/FeaturedProjectCarousel.module.css";
import stackStyles from "@/components/HomeTestimonialsStack.module.css";
import { projects } from "@/lib/portfolio-data";

const FeaturedProjectCarousel = dynamic(
  () =>
    import("@/components/FeaturedProjectCarousel").then((module) => ({
      default: module.FeaturedProjectCarousel,
    })),
  { loading: () => <div className={featuredStyles.bandPlaceholder} aria-hidden /> },
);

const HomeTestimonials = dynamic(
  () =>
    import("@/components/HomeTestimonialsStack").then((module) => ({
      default: module.HomeTestimonialsStack,
    })),
  { loading: () => <div className={stackStyles.bandPlaceholder} aria-hidden /> },
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
      <AnimatedSection mode="fade">
        <ExperienceSection />
      </AnimatedSection>
      <AnimatedSection className="sectionStretch">
        <FeaturedProjectCarousel projects={projects} />
      </AnimatedSection>
      <AnimatedSection mode="fade">
        <ProofGallery />
      </AnimatedSection>
      <AnimatedSection>
        <HomeTestimonials />
      </AnimatedSection>
      <AnimatedSection>
        <ServicesSection />
      </AnimatedSection>
      <AnimatedSection>
        <ProcessSection />
      </AnimatedSection>
      <AnimatedSection>
        <FinalCta />
      </AnimatedSection>
    </main>
  );
}
