"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, User } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { StarRating } from "@/components/StarRating";
import { testimonials } from "@/lib/portfolio-data";
import styles from "@/components/HomeTestimonialsStack.module.css";

const STACK_SCALES = [1, 0.995, 0.99] as const;

function getCardOffset(index: number, activeIndex: number, total: number) {
  return (index - activeIndex + total) % total;
}

export function HomeTestimonialsStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    didSwipe.current = false;
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) {
      return;
    }

    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    didSwipe.current = true;

    setActiveIndex((current) => {
      if (deltaX < 0) {
        return (current + 1) % testimonials.length;
      }

      return (current - 1 + testimonials.length) % testimonials.length;
    });
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }

    setActiveIndex(index);
  }, []);

  return (
    <section className={styles.band} id="notes" aria-labelledby="testimonials-heading">
      <svg className={styles.clipDefs} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="testimonial-wave-portrait" clipPathUnits="objectBoundingBox">
            <path d="M0 0 C0.38 0.04 0.24 0.46 0.4 1 H1 V0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 id="testimonials-heading">What clients say.</h2>
            <div className={styles.headerMeta}>
              <p>Direct feedback from our partners.</p>
              <Link className={styles.sectionLink} href="/testimonials">
                See all
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div
          className={styles.stackShell}
          aria-roledescription="carousel"
          aria-label="Client notes"
          aria-live="polite"
        >
          <div
            className={styles.stack}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            {testimonials.map((testimonial, index) => {
              const stackPosition = getCardOffset(index, activeIndex, testimonials.length);
              const isActive = stackPosition === 0;
              const zIndex = testimonials.length - stackPosition;

              return (
                <button
                  key={testimonial.id}
                  type="button"
                  className={styles.card}
                  data-theme={testimonial.theme}
                  data-stack={stackPosition}
                  aria-label={`${testimonial.name}, ${testimonial.role}. ${testimonial.rating} out of 5 stars. ${testimonial.quote}`}
                  aria-pressed={isActive}
                  onClick={() => handleCardClick(index)}
                  style={{
                    zIndex,
                    transform: prefersReducedMotion
                      ? undefined
                      : `scale(${STACK_SCALES[stackPosition]})`,
                  }}
                >
                  <div className={styles.cardSurface}>
                    <div className={styles.cardContent}>
                      <div className={styles.cardLead}>
                        <span className={styles.quoteMark} aria-hidden="true">
                          &ldquo;&rdquo;
                        </span>
                        <StarRating className={styles.stars} rating={testimonial.rating} size={13} />
                      </div>
                      <p className={styles.quote}>{testimonial.quote}</p>
                      <footer className={styles.author}>
                        <span className={styles.initialsBadge}>{testimonial.initials}</span>
                        <span className={styles.authorText}>
                          <strong>{testimonial.name}</strong>
                          <span>{testimonial.role}</span>
                        </span>
                      </footer>
                    </div>

                    <div
                      className={styles.portrait}
                      data-mask={testimonial.image ? "wave" : "round"}
                      aria-hidden="true"
                    >
                      <div className={styles.portraitInner}>
                        {testimonial.image ? (
                          <Image
                            src={testimonial.image}
                            alt=""
                            fill
                            className={styles.portraitImage}
                            sizes="(max-width: 768px) 42vw, 200px"
                          />
                        ) : (
                          <User className={styles.portraitIcon} size={36} strokeWidth={1.25} />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.pagination} role="tablist" aria-label="Select client note">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={testimonial.id}
                  type="button"
                  role="tab"
                  className={`${styles.dot} ${isActive ? styles.dotActive : ""}`}
                  aria-label={`Show note ${index + 1} from ${testimonial.name}`}
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(index)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
