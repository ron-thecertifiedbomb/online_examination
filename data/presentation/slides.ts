import {
  Activity,
  Gauge,
  MousePointer2,
  Info,
  ShieldCheck,
  Timer,
  Layout,
  Code2,
  Palette,
  Terminal,
  Globe,
  Rocket,
} from "lucide-react";

export const SLIDES = [
  {
    id: "INTRO",
    title: "Web Vitals 101",
    desc: "Google's essential metrics for site health. High scores equal better SEO and higher user retention.",
    icon: Info,
    color: "#ffffff",
    stats: "3 Core Metrics",
    impact: "Ranking Signal",
    tip: "User experience is now a quantifiable ranking factor.",
  },
  {
    id: "STACK",
    title: "The Holy Trinity",
    desc: "HTML for structure, CSS for style, and JavaScript for logic. The foundation of every modern website.",
    icon: Globe,
    color: "#3b82f6", // Blue
    stats: "HTML • CSS • JS",
    impact: "The Foundation",
    tip: "Optimization starts with clean, semantic code structure.",
  },
  {
    id: "LCP",
    title: "Largest Contentful Paint",
    desc: "Measures loading performance. It marks the point when the main content has likely loaded.",
    icon: Gauge,
    color: "#10b981", // Emerald
    stats: "< 2.5s",
    impact: "Loading Speed",
    tip: "Optimize images and prioritize your critical CSS path.",
  },
  {
    id: "INP",
    title: "Interaction to Next Paint",
    desc: "The new responsiveness standard. Measures the delay of every user interaction on the page.",
    icon: MousePointer2,
    color: "#06b6d4", // Cyan
    stats: "< 200ms",
    impact: "Responsiveness",
    tip: "Yield to the main thread to keep animations smooth.",
  },
  {
    id: "CLS",
    title: "Cumulative Layout Shift",
    desc: "Measures visual stability. Prevents elements from jumping around while the page is loading.",
    icon: Layout,
    color: "#CEFF00", // Lime
    stats: "< 0.1",
    impact: "Visual Stability",
    tip: "Reserve space for images and ads with aspect-ratio boxes.",
  },
  {
    id: "OPTIMIZE",
    title: "Performance Boost",
    desc: "Small changes lead to big wins. Minifying assets and using CDNs can double your conversion rates.",
    icon: Rocket,
    color: "#f59e0b", // Amber
    stats: "90+ Score",
    impact: "Conversions",
    tip: "Check PageSpeed Insights for your real-world field data.",
  },
];
