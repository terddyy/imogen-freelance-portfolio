import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/portfolio-data";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  onOpen?: () => void;
};

export function ProjectCard({ project, featured, onOpen }: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");
  const image = (
    <Image
      src={project.image}
      alt={`${project.title} project preview`}
      fill
      sizes={featured ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 100vw, 33vw"}
      className="projectImage"
    />
  );

  return (
    <article className={featured ? "projectCard projectCardFeatured" : "projectCard"}>
      {onOpen ? (
        <button type="button" className="projectCardLink" onClick={onOpen} aria-label={`View ${project.title}`}>
          {image}
        </button>
      ) : (
        <Link
          href={project.href}
          className="projectCardLink"
          aria-label={`View ${project.title}`}
          {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {image}
        </Link>
      )}
    </article>
  );
}
