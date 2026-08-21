"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/lib/portfolio-data";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectPreviewDialog } from "@/components/ProjectPreviewDialog";

const categories = ["All", "Websites", "App", "Custom", "Others"] as const;

const categoryLabels: Record<(typeof categories)[number], string> = {
  All: "All",
  Websites: "Websites",
  App: "App",
  Custom: "Custom",
  Others: "Others",
};

export function ProjectFilters() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const closePreview = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current - 1 + filteredProjects.length) % filteredProjects.length;
    });
  }, [filteredProjects.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + 1) % filteredProjects.length;
    });
  }, [filteredProjects.length]);

  return (
    <section className="shell routeSection projectArchiveSection">
      <div className="filterBar" aria-label="Project filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={category === activeCategory ? "filterButton active" : "filterButton"}
            aria-pressed={category === activeCategory}
            onClick={() => {
              setActiveCategory(category);
              setActiveIndex(null);
            }}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {filteredProjects.length > 0 ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="projectArchiveGrid"
            key={activeCategory}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                project={project}
                key={project.title}
                onOpen={() => setActiveIndex(index)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="emptyState">
          <h2>No matching projects yet</h2>
          <p>Placeholder projects will appear here once the selected category has approved work.</p>
        </div>
      )}

      <ProjectPreviewDialog
        projects={filteredProjects}
        activeIndex={activeIndex}
        onClose={closePreview}
        onPrevious={showPrevious}
        onNext={showNext}
      />
    </section>
  );
}
