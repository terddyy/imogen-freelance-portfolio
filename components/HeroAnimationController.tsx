"use client";

import { useEffect } from "react";

export function HeroAnimationController() {
  useEffect(() => {
    const section = document.getElementById("hero");
    if (!section) {
      return;
    }

    let visible = true;

    const setPaused = (paused: boolean) => {
      if (paused) {
        section.dataset.animationsPaused = "true";
      } else {
        delete section.dataset.animationsPaused;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        setPaused(document.hidden || !visible);
      },
      { threshold: 0 },
    );

    observer.observe(section);

    const onVisibilityChange = () => {
      setPaused(document.hidden || !visible);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      section.removeAttribute("data-animations-paused");
    };
  }, []);

  return null;
}
