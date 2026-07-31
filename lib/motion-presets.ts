export const motionTiming = {
  fast: 0.18,
  base: 0.36,
  section: 0.72,
  stagger: 0.08,
  ease: [0.22, 1, 0.36, 1],
} as const;

export const revealVariants = {
  hidden: { opacity: 0, y: 42, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: motionTiming.section,
      ease: motionTiming.ease,
    },
  },
} as const;

export const fadeVariants = {
  hidden: { opacity: 0, scale: 0.995 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionTiming.base,
      ease: motionTiming.ease,
    },
  },
} as const;

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motionTiming.stagger,
      delayChildren: 0.06,
    },
  },
} as const;

export const subtleHover = {
  y: -4,
  transition: {
    duration: motionTiming.fast,
    ease: motionTiming.ease,
  },
} as const;
