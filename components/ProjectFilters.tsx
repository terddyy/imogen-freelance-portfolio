"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/lib/portfolio-data";
import { ProjectCard } from "@/components/ProjectCard";

const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))] as const;

export function ProjectFilters() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="shell routeSection">
      <div className="filterBar" aria-label="Project filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={category === activeCategory ? "filterButton active" : "filterButton"}
            aria-pressed={category === activeCategory}
            onClick={() => setActiveCategory(category)}
          >
            {category}
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
            {filteredProjects.map((project) => (
              <ProjectCard project={project} key={project.title} />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="emptyState">
          <h2>No matching projects yet</h2>
          <p>Placeholder projects will appear here once the selected category has approved work.</p>
        </div>
      )}
    </section>
  );
}
