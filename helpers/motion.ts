import { Variants } from "framer-motion";

/**
 * CONTAINER VARIANTS
 * Manages the timing for all nested child animations
 */
export const STAGGER_CONTAINER: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

/**
 * TEXT & ELEMENT VARIANTS
 * High-performance reveal animations
 */
export const HERO_TITLE: Variants = {
  initial: { opacity: 0, y: 25, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // Custom "surgical" cubic-bezier
    },
  },
};

export const FADE_IN_UP: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const LINE_REVEAL: Variants = {
  initial: { width: 0, opacity: 0 },
  animate: {
    width: "100%",
    opacity: 1,
    transition: {
      duration: 1.4,
      ease: "circOut",
      delay: 0.5,
    },
  },
};

/**
 * CARD VARIANTS
 * Specialized for the "Presentation" and "Services" sections
 */
export const CARD_VARIANTS: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.96,
    transition: { duration: 0.1 },
  },
};

/**
 * COMPONENT ACCESSORIES
 * For subtle glows and status indicators
 */
export const GLOW_PULSE: Variants = {
  initial: { opacity: 0.4, scale: 1 },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
