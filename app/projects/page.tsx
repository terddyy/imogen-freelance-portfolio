import { CircleDot } from "lucide-react";
import { ProjectFilters } from "@/components/ProjectFilters";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata = {
  title: "Projects | Imogen Inocentes",
  description:
    "A growing archive of websites, apps, and custom systems by Imogen Inocentes — more case studies are added over time.",
};

export default function ProjectsPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero">
          <h1>Selected builds across web, apps, and custom systems.</h1>
          <span className="availability">
            <CircleDot size={14} />
            Archive still growing
          </span>
          <p>
            This is a living sample of commissioned work — not the full catalog. I&apos;m still
            compiling case studies, screenshots, and write-ups, and new projects will appear here as
            they&apos;re ready.
          </p>
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <ProjectFilters />
      </AnimatedSection>
    </main>
  );
}
