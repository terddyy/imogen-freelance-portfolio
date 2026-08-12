import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio-data";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

export function ProjectCard({ project, featured }: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");

  return (
    <article className={featured ? "projectCard projectCardFeatured" : "projectCard"}>
      <Image
        src={project.image}
        alt={`${project.title} project preview`}
        fill
        sizes={featured ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 100vw, 33vw"}
        className="projectImage"
      />
      <div className="projectMeta">
        <div className="statusRow">
          <span className="chip chipAccent">{project.category}</span>
          {project.tags.slice(0, 2).map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
        </div>
        <div className="projectFooter">
          <div className="avatarStack" aria-label="Project collaborators">
            {project.initials.map((initials) => (
              <span key={initials}>{initials}</span>
            ))}
          </div>
          <Link
            href={project.href}
            aria-label={`View ${project.title}`}
            {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            View <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
