import { TestimonialsRouteContent } from "@/components/HomeSections";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata = {
  title: "Client Notes | Imogen Inocentes",
  description: "Client feedback and reviews for Imogen Inocentes portfolio work.",
};

export default function TestimonialsPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <span className="sectionLabel">Client Notes</span>
          <h1>What clients say about working together.</h1>
          <p>
            Real feedback from commissioned projects — communication, delivery speed, and the quality
            of the final output.
          </p>
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <section className="shell routeSection">
          <TestimonialsRouteContent />
        </section>
      </AnimatedSection>
    </main>
  );
}
