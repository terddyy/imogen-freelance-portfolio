"use client";

import Image from "next/image";
import { useState } from "react";
import { StarRating } from "@/components/StarRating";
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
        const id = testimonial.id;
        const isExpanded = expanded.has(id);

        return (
          <article className="testimonialCard" key={id}>
            <div className="testimonialHeader">
              {testimonial.image ? (
                <span className="testimonialAvatar testimonialAvatarImage">
                  <Image
                    src={testimonial.image}
                    alt=""
                    width={34}
                    height={34}
                    className="testimonialAvatarPhoto"
                  />
                </span>
              ) : (
                <span className="testimonialAvatar">{testimonial.initials}</span>
              )}
              <div>
                <h3>{testimonial.name}</h3>
                <p>{testimonial.role}</p>
              </div>
            </div>
            <StarRating className="testimonialStars" rating={testimonial.rating} />
            <p id={`testimonial-${id}`} className={isExpanded ? "expandedQuote" : "clampedQuote"}>
              {testimonial.quote}
            </p>
            {testimonial.email ? (
              <p className="testimonialEmail">{testimonial.email}</p>
            ) : null}
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
