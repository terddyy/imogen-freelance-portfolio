"use client";

import { useState } from "react";
import { testimonials } from "@/lib/portfolio-data";

export function TestimonialList() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="testimonialGrid">
      {testimonials.map((testimonial) => {
        const id = testimonial.initials;
        const isExpanded = expanded.has(id);

        return (
          <article className="testimonialCard" key={id}>
            <div className="testimonialHeader">
              <span className="testimonialAvatar">{testimonial.initials}</span>
              <div>
                <h3>{testimonial.name}</h3>
                <p>{testimonial.role}</p>
              </div>
            </div>
            <p id={`testimonial-${id}`} className={isExpanded ? "expandedQuote" : "clampedQuote"}>
              {testimonial.quote}
            </p>
            <button
              className="textButton"
              type="button"
              aria-expanded={isExpanded}
              aria-controls={`testimonial-${id}`}
              onClick={() => toggle(id)}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          </article>
        );
      })}
    </div>
  );
}
