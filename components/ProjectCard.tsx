import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/portfolio-data";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

export function ProjectCard({ project, featured }: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");

  return (
    <article className={featured ? "projectCard projectCardFeatured" : "projectCard"}>
      <Link
        href={project.href}
        className="projectCardLink"
        aria-label={`View ${project.title}`}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes={featured ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 100vw, 33vw"}
          className="projectImage"
        />
      </Link>
    </article>
  );
}
