"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/portfolio-data";
import { ProjectPreviewDialog } from "@/components/ProjectPreviewDialog";

type FeaturedProjectCarouselProps = {
  projects: Project[];
};

const AUTO_SCROLL_PX_PER_SEC = 42;

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

  const lastIndex = projects.length - 1;

  return [
    {
      project: projects[lastIndex],
      projectIndex: lastIndex,
      slideKey: `clone-start-${projects[lastIndex].title}`,
      isClone: true,
    },
    ...projects.map((project, index) => ({
      project,
      projectIndex: index,
      slideKey: project.title,
      isClone: false,
    })),
    {
      project: projects[0],
      projectIndex: 0,
      slideKey: `clone-end-${projects[0].title}`,
      isClone: true,
    },
  ];
}

function measureLoopSegment(track: HTMLDivElement, projectCount: number): LoopSegment {
  if (projectCount <= 1) {
    return { start: 0, loopWidth: track.scrollWidth };
  }

  const cards = Array.from(track.children) as HTMLElement[];
  const firstReal = cards[1];
  const lastReal = cards[cards.length - 2];

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
  const didDragRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, offset: 0 });
  const segmentRef = useRef<LoopSegment>({ start: 0, loopWidth: 0 });
  const rafRef = useRef<number | null>(null);
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
    if (shouldReduceMotion || !isInView) {
      return;
    }

    let lastTime = performance.now();

    const tick = (now: number) => {
      if (!isDraggingRef.current) {
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
      syncSegment(),
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
            {carouselSlides.map((slide, index) => (
                <article
                  className="featuredCarouselCard"
                  key={slide.slideKey}
                  aria-hidden={slide.isClone}
                >
                  <button
                    type="button"
                    className="featuredCarouselCardButton"
                    tabIndex={slide.isClone ? -1 : 0}
                    onClick={() => openProject(slide.projectIndex)}
                    aria-label={`Preview ${slide.project.title}`}
                    draggable={false}
                  >
                    <Image
                      src={slide.project.image}
                      alt=""
                      fill
                      sizes="(max-width: 760px) 62vw, (max-width: 980px) 38vw, 360px"
                      className="featuredCarouselImage"
                      draggable={false}
                      loading={index <= 2 ? undefined : "lazy"}
                    />
                  </button>
                </article>
              ))}
          </div>
        </div>
      </div>

      <div className="featuredProjectFooter">
        <Link href="/projects" className="featuredProjectAll">
          View all projects
          <ArrowRight size={18} />
        </Link>
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
