import { ProjectFilters } from "@/components/ProjectFilters";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata = {
  title: "Projects | Imogen Inocentes",
  description: "Project archive for Imogen Inocentes.",
};

export default function ProjectsPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <ProjectFilters />
      </AnimatedSection>
    </main>
  );
}
