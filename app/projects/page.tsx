import { ProjectFilters } from "@/components/ProjectFilters";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata = {
  title: "Projects | Imogen Inocentes",
  description: "Placeholder project archive for Imogen Inocentes freelance portfolio.",
};

export default function ProjectsPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <span className="sectionLabel">Projects</span>
          <h1>Selected work placeholders ready for real case studies.</h1>
          <p>
            Filter the current placeholder cards by project type. Each one is structured so screenshots,
            outcomes, links, and client-approved copy can be swapped in without redesigning the page.
          </p>
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <ProjectFilters />
      </AnimatedSection>
    </main>
  );
}
