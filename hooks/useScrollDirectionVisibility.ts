"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SCROLL_DELTA = 6;
const TOP_THRESHOLD = 80;
const IDLE_RESHOW_MS = 1200;

export function useScrollDirectionVisibility(): boolean {
  const { scrollY } = useScroll();
  const lastYRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastYRef.current;
    lastYRef.current = latest;

    if (prev === null) {
      return;
    }

    const delta = latest - prev;

    if (latest < TOP_THRESHOLD || delta < -SCROLL_DELTA) {
      setVisible(true);
    } else if (delta > SCROLL_DELTA) {
      setVisible(false);
    }

    if (idleTimerRef.current !== null) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setVisible(true);
    }, IDLE_RESHOW_MS);
  });

  useEffect(() => {
    return () => {
      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return visible;
}