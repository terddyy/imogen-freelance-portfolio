import { TestimonialsRouteContent } from "@/components/HomeSections";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata = {
  title: "Client Notes | Imogen Inocentes",
  description: "Placeholder-safe client notes for Imogen Inocentes portfolio.",
};

export default function TestimonialsPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <span className="sectionLabel">Client Notes</span>
          <h1>Social proof layout without invented testimonials.</h1>
          <p>
            These cards intentionally avoid pretending that placeholder feedback is real. Replace them
            with approved client quotes, or remove this page before launch if testimonials are not ready.
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
