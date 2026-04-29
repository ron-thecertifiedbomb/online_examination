import {
  Code2,
  Palette,
  Terminal,
  Blocks,
  Cpu,
  Globe2,
  Layers,
  Zap,
  Box,
} from "lucide-react";

export const STACK_SLIDES = [
  {
    id: "STACK_OVERVIEW",
    title: "The Web Engine",
    desc: "Every website is a combination of Structure, Design, and Logic. Together, they create the Modern Web.",
    icon: Globe2,
    color: "#ffffff",
    stats: "3 Pillars",
    impact: "Universal Standard",
    tip: "Mastering these three is the foundation of all Frontend development.",
  },
  {
    id: "HTML_DEEP",
    title: "HTML: The Bones",
    desc: "HyperText Markup Language. It provides the semantic structure and meaning to your content.",
    icon: Code2,
    color: "#e34c26", // HTML Orange
    stats: "Structure",
    impact: "SEO & Accessibility",
    tip: "Use semantic tags like <main> and <article> for better SEO scores.",
  },
  {
    id: "CSS_DEEP",
    title: "CSS: The Skin",
    desc: "Cascading Style Sheets. Responsible for the visual story—layout, colors, fonts, and responsiveness.",
    icon: Palette,
    color: "#264de4", // CSS Blue
    stats: "Presentation",
    impact: "User Engagement",
    tip: "Modern CSS like Grid and Flexbox makes complex layouts easy.",
  },
  {
    id: "JS_DEEP",
    title: "JS: The Brain",
    desc: "JavaScript. The engine of interactivity. It handles data, animations, and user behavior.",
    icon: Terminal,
    color: "#f7df1e", // JS Yellow
    stats: "Logic",
    impact: "Functionality",
    tip: "Keep JS bundles small to maintain high Interaction to Next Paint (INP) scores.",
  },
  {
    id: "DOM_EXPLAINED",
    title: "The DOM Tree",
    desc: "The Document Object Model connects your code to the browser, allowing JS to update the UI in real-time.",
    icon: Layers,
    color: "#06b6d4", // Cyan
    stats: "Live Connection",
    impact: "Dynamic UI",
    tip: "Minimal DOM manipulation leads to smoother 60fps animations.",
  },
  {
    id: "WORKFLOW",
    title: "Better Together",
    desc: "When HTML is lean, CSS is optimized, and JS is efficient, you get a 100/100 Lighthouse score.",
    icon: Zap,
    color: "#10b981", // Emerald
    stats: "Fast & Fluid",
    impact: "Performance",
    tip: "The best websites balance these three to pass all Core Web Vitals.",
  },
];
