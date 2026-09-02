"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/portfolio-data";
import { ProjectPreviewDialog } from "@/components/ProjectPreviewDialog";
import styles from "@/components/FeaturedProjectCarousel.module.css";

type FeaturedProjectCarouselProps = {
  projects: Project[];
};

const AUTO_SCROLL_PX_PER_SEC = 42;
const CLONE_BUFFER = 3;

type CarouselSlide = {
  project: Project;
  projectIndex: number;
  slideKey: string;
  isClone: boolean;
};

type LoopSegment = {
  start: number;
  loopWidth: number;
};

function getCloneBuffer(projectCount: number) {
  if (projectCount <= 1) {
    return 0;
  }

  return Math.min(CLONE_BUFFER, projectCount);
}

function buildCarouselSlides(projects: Project[]): CarouselSlide[] {
  if (projects.length === 0) {
    return [];
  }

  if (projects.length === 1) {
    return [
      {
        project: projects[0],
        projectIndex: 0,
        slideKey: projects[0].title,
        isClone: false,
      },
    ];
  }

  const buffer = getCloneBuffer(projects.length);
  const leadingProjects = projects.slice(-buffer);
  const trailingProjects = projects.slice(0, buffer);

  return [
    ...leadingProjects.map((project, index) => ({
      project,
      projectIndex: (projects.length - buffer + index) % projects.length,
      slideKey: `clone-start-${index}-${project.title}`,
      isClone: true,
    })),
    ...projects.map((project, index) => ({
      project,
      projectIndex: index,
      slideKey: project.title,
      isClone: false,
    })),
    ...trailingProjects.map((project, index) => ({
      project,
      projectIndex: index,
      slideKey: `clone-end-${index}-${project.title}`,
      isClone: true,
    })),
  ];
}

function measureLoopSegment(track: HTMLDivElement, projectCount: number): LoopSegment {
  if (projectCount <= 1) {
    return { start: 0, loopWidth: track.scrollWidth };
  }

  const buffer = getCloneBuffer(projectCount);
  const cards = Array.from(track.children) as HTMLElement[];
  const firstReal = cards[buffer];
  const lastReal = cards[cards.length - buffer - 1];

  if (!firstReal || !lastReal) {
    return { start: 0, loopWidth: track.scrollWidth };
  }

  return {
    start: firstReal.offsetLeft,
    loopWidth: lastReal.offsetLeft + lastReal.offsetWidth - firstReal.offsetLeft,
  };
}

function normalizeOffset(offset: number, segment: LoopSegment) {
  const { start, loopWidth } = segment;

  if (loopWidth <= 0) {
    return offset;
  }

  const min = -(start + loopWidth);
  const max = -start;

  if (offset < min) {
    return offset + loopWidth;
  }

  if (offset > max) {
    return offset - loopWidth;
  }

  return offset;
}

export function FeaturedProjectCarousel({ projects }: FeaturedProjectCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const pointerActiveRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, offset: 0 });
  const segmentRef = useRef<LoopSegment>({ start: 0, loopWidth: 0 });
  const rafRef = useRef<number | null>(null);
  const resumeAtRef = useRef<number>(0);
  const RESUME_DELAY_MS = 2000;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current - 1 + projects.length) % projects.length;
    });
  }, [projects.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current + 1) % projects.length;
    });
  }, [projects.length]);

  const syncSegment = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return segmentRef.current;
    }

    const segment = measureLoopSegment(track, projects.length);
    segmentRef.current = segment;
    return segment;
  }, [projects.length]);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const segment = syncSegment();
    if (projects.length > 1) {
      offsetRef.current = -segment.start;
    } else {
      offsetRef.current = 0;
    }
    applyTransform();
  }, [applyTransform, projects.length, syncSegment]);

  useEffect(() => {
    const onResize = () => {
      const segment = syncSegment();
      offsetRef.current = normalizeOffset(offsetRef.current, segment);
      applyTransform();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyTransform, syncSegment]);

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return;
    }

    let lastTime = performance.now();

    const tick = (now: number) => {
      if (!isDraggingRef.current && now >= resumeAtRef.current) {
        const delta = (now - lastTime) / 1000;
        const segment = syncSegment();
        offsetRef.current = normalizeOffset(
          offsetRef.current - AUTO_SCROLL_PX_PER_SEC * delta,
          segment,
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
  }, [applyTransform, isInView, shouldReduceMotion, syncSegment]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    // ponytail: don't setPointerCapture until drag threshold — early capture steals click from card buttons.
    pointerActiveRef.current = true;
    isDraggingRef.current = false;
    didDragRef.current = false;
    dragStartRef.current = {
      pointerX: event.clientX,
      offset: offsetRef.current,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerActiveRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartRef.current.pointerX;

    if (!isDraggingRef.current) {
      if (Math.abs(deltaX) <= 4) {
        return;
      }

      isDraggingRef.current = true;
      didDragRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    offsetRef.current = normalizeOffset(
      dragStartRef.current.offset + deltaX,
      syncSegment(),
    );
    applyTransform();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerActiveRef.current) {
      return;
    }

    pointerActiveRef.current = false;
    isDraggingRef.current = false;

    if (didDragRef.current) {
      resumeAtRef.current = performance.now() + RESUME_DELAY_MS;
      didDragRef.current = false;
    }

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

  const openProject = (index: number) => {
    setActiveIndex(index % projects.length);
  };

  if (projects.length === 0) {
    return null;
  }

  const carouselSlides = buildCarouselSlides(projects);

  return (
    <section
      ref={sectionRef}
      className={styles.band}
      id="projects"
      aria-labelledby="featured-projects-title"
    >
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id="featured-projects-title">Featured Projects</h2>
        </div>
      </div>

      <div className={styles.carouselShell} aria-label="Featured projects">
        <div
          className={styles.carouselViewport}
          aria-label="Featured projects. Drag horizontally to browse."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
        >
          <div ref={trackRef} className={styles.carouselTrack}>
            {carouselSlides.map((slide, index) => (
              <article
                className={styles.carouselCard}
                key={slide.slideKey}
                aria-hidden={slide.isClone}
              >
                <button
                  type="button"
                  className={styles.carouselCardButton}
                  tabIndex={slide.isClone ? -1 : 0}
                  onClick={() => openProject(slide.projectIndex)}
                  aria-label={`Preview ${slide.project.title}`}
                  draggable={false}
                >
                  <Image
                    src={slide.project.image}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 62vw, (max-width: 980px) 38vw, 320px"
                    className={styles.carouselImage}
                    draggable={false}
                    loading={index <= 2 ? undefined : "lazy"}
                  />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.footer}>
          <Link href="/projects" className={styles.allLink}>
            View all projects
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <ProjectPreviewDialog
        projects={projects}
        activeIndex={activeIndex}
        onClose={close}
        onPrevious={showPrevious}
        onNext={showNext}
      />
    </section>
  );
}
