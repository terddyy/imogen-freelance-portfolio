"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { Project } from "@/lib/portfolio-data";

type ProjectPreviewDialogProps = {
  projects: Project[];
  activeIndex: number | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function ProjectPreviewDialog({
  projects,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
}: ProjectPreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = activeIndex !== null ? projects[activeIndex] : null;
  const isExternal = active?.href.startsWith("http") ?? false;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeIndex !== null && !dialog.open) dialog.showModal();
    if (activeIndex === null && dialog.open) dialog.close();
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onNext, onPrevious]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="proofDialog projectPreviewDialog"
      aria-labelledby={active ? "project-preview-title" : undefined}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) handleClose();
      }}
    >
      {active && activeIndex !== null ? (
        <div className="proofDialogPanel projectPreviewPanel">
          <header className="proofDialogHeader">
            <div>
              <p className="proofDialogEyebrow">{active.category}</p>
              <h3 id="project-preview-title">{active.title}</h3>
            </div>
            <button
              type="button"
              className="proofDialogClose"
              onClick={handleClose}
              aria-label="Close project preview"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div className="proofDialogImageWrap">
            <Image
              className="proofDialogImage"
              src={active.image}
              alt={`${active.title} project preview`}
              fill
              sizes="100vw"
              priority
            />
          </div>

          <p className="proofDialogCaption">{active.summary}</p>

          <div className="projectPreviewTags" aria-label="Project tags">
            {active.tags.map((tag) => (
              <span className="chip" key={tag}>{tag}</span>
            ))}
          </div>

          <div className="projectPreviewActions">
            <Link
              className="primaryButton projectPreviewVisit"
              href={active.href}
              {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              Visit site
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

          {projects.length > 1 ? (
            <nav className="proofDialogNav" aria-label="Browse projects">
              <button
                type="button"
                className="proofDialogNavButton"
                onClick={onPrevious}
                aria-label="Previous project"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span className="proofDialogCounter">
                {activeIndex + 1} / {projects.length}
              </span>
              <button
                type="button"
                className="proofDialogNavButton"
                onClick={onNext}
                aria-label="Next project"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </nav>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
