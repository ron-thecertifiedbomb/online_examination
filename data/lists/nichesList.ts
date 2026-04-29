import { MousePointer, TrendingUp, Search, Rocket } from "lucide-react";

export interface Niche {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  label: string;
  accent: string;
  tag: string;
  icon: any;
}

export const niches: Niche[] = [
  {
    id: "service_01",
    title: "Conversion Surge",
    subtitle: "LANDING_PAGE_OPTIMIZATION",
    desc: "Data-driven landing page audits & A/B testing that transform visitors into buyers. Increase conversion rates by 40%+.",
    label: "Audit My Landing Page",
    accent: "from-emerald-500 to-teal-500",
    tag: "CONVERSION_ENGINE",
    icon: MousePointer,
  },
  {
    id: "service_02",
    title: "Traffic Accelerator",
    subtitle: "SEO_TRAFFIC_GROWTH",
    desc: "Strategic keyword targeting, backlink building, and technical SEO that drives qualified organic traffic month over month.",
    label: "Analyze My Traffic",
    accent: "from-emerald-400 to-blue-600",
    tag: "TRAFFIC_BOOST",
    icon: TrendingUp,
  },
  {
    id: "service_03",
    title: "Search Dominance",
    subtitle: "TECHNICAL_SEO",
    desc: "Core Web Vitals optimization, schema markup, and crawl efficiency fixes to rank higher on Google's first page.",
    label: "Run SEO Audit",
    accent: "from-emerald-600 to-indigo-800",
    tag: "RANK_FORCE",
    icon: Search,
  },
  {
    id: "service_04",
    title: "Growth Stack",
    subtitle: "FULL_SERVICE_PACKAGE",
    desc: "Complete landing page + SEO + content strategy. Everything you need to dominate your niche and scale revenue.",
    label: "Build My Growth Plan",
    accent: "from-zinc-700 to-emerald-800",
    tag: "GROWTH_OS",
    icon: Rocket,
  },
];
