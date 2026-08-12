"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import type { Project } from "@/lib/portfolio-data";

type FeaturedProjectCarouselProps = {
  projects: Project[];
};

const AUTO_SCROLL_PX_PER_SEC = 42;

function normalizeOffset(offset: number, loopWidth: number) {
  if (loopWidth <= 0) {
    return offset;
  }

  let next = offset % loopWidth;
  if (next > 0) {
    next -= loopWidth;
  }

  return next;
}

export function FeaturedProjectCarousel({ projects }: FeaturedProjectCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, offset: 0 });
  const rafRef = useRef<number | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const getLoopWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return 0;
    }

    return track.scrollWidth / 2;
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    applyTransform();
  }, [applyTransform, projects.length]);

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return;
    }

    let lastTime = performance.now();

    const tick = (now: number) => {
      if (!isDraggingRef.current) {
        const delta = (now - lastTime) / 1000;
        const loopWidth = getLoopWidth();
        offsetRef.current = normalizeOffset(
          offsetRef.current - AUTO_SCROLL_PX_PER_SEC * delta,
          loopWidth,
        );
        applyTransform();
      }

      lastTime = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [applyTransform, getLoopWidth, isInView, shouldReduceMotion]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    isDraggingRef.current = true;
    didDragRef.current = false;
    dragStartRef.current = {
      pointerX: event.clientX,
      offset: offsetRef.current,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartRef.current.pointerX;

    if (Math.abs(deltaX) > 4) {
      didDragRef.current = true;
    }

    offsetRef.current = normalizeOffset(
      dragStartRef.current.offset + deltaX,
      getLoopWidth(),
    );
    applyTransform();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!didDragRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    didDragRef.current = false;
  };

  if (projects.length === 0) {
    return null;
  }

  const loopedProjects = [...projects, ...projects];

  return (
    <section
      ref={sectionRef}
      className="featuredProjectBand"
      id="projects"
      aria-labelledby="featured-projects-title"
    >
      <div className="featuredGridOverlay" aria-hidden="true" />
      <div className="featuredProjectHeader">
        <div>
          <p className="featuredEyebrow">Portfolio</p>
          <h2 id="featured-projects-title">Featured Projects</h2>
        </div>
      </div>

      <div className="featuredCarouselShell" aria-label="Featured projects">
        <div
          className="featuredCarouselViewport"
          aria-label="Featured projects. Drag horizontally to browse."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
        >
          <div ref={trackRef} className="featuredCarouselTrack">
            {loopedProjects.map((project, index) => {
              const displayIndex = (index % projects.length) + 1;

              return (
                <article
                  className="featuredCarouselCard"
                  key={`${project.title}-${index}`}
                  aria-hidden={index >= projects.length}
                >
                  <Link
                    href={project.href}
                    tabIndex={index >= projects.length ? -1 : 0}
                    aria-label={`View ${project.title}`}
                    draggable={false}
                    {...(project.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} project preview`}
                      fill
                      sizes="(max-width: 760px) 62vw, (max-width: 980px) 38vw, 340px"
                      className="featuredCarouselImage"
                      draggable={false}
                    />
                    <div className="featuredCarouselScrim" />
                    <div className="featuredCarouselTopline">
                      <span>{String(displayIndex).padStart(2, "0")}</span>
                      <span className="featuredCarouselSize featuredCarouselSizeDesktop">
                        Max frame · 340 × 460 px
                      </span>
                      <span className="featuredCarouselSize featuredCarouselSizeTablet">
                        Max frame · 300 × 420 px
                      </span>
                      <span className="featuredCarouselSize featuredCarouselSizeMobile">
                        Max frame · 280 × 400 px
                      </span>
                    </div>
                    <div className="featuredCarouselMeta">
                      <span>{project.category}</span>
                      <h3>{project.title}</h3>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="featuredProjectFooter">
        <Link href="/projects" className="featuredProjectAll">
          View all projects
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
