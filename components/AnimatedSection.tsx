"use client";

import type { ReactNode } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { fadeVariants, revealVariants } from "@/lib/motion-presets";

type AnimatedSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  mode?: "reveal" | "fade";
};

export function AnimatedSection({ id, children, className, mode = "reveal" }: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion || mode === "fade" ? fadeVariants : revealVariants;

  return (
    <motion.div
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14, margin: "0px 0px -8%" }}
      style={{ transformOrigin: "50% 20%" }}
    >
      {children}
    </motion.div>
  );
}
