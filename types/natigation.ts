// types/navigation.ts (Optional: if you want to type your links)
export interface NavLink {
  href: string;
  label: string;
}

// components/NavBar/links.ts
export const mainLinks: NavLink[] = [
  {
    href: "/",
    label: "Engineering",
  },
  {
    href: "/blogs",
    label: "Blog",
  },
  {
    href: "/toolkit",
    label: "Toolkit", // Rebranded from Utilities
  },
  {
    href: "/games",
    label: "Games",
  },
  {
    href: "/services",
    label: "Services",
  },
];

export const examLinks: NavLink[] = [
  {
    href: "/engineering/exams",
    label: "EXAM CENTER", // Changed from Dashboard
  },
  {
    href: "/engineering/exams/schedule",
    label: "PLANNER", // Changed from Schedule
  },
  {
    href: "/engineering/exams/results",
    label: "GRADES", // Changed from Results
  },
  {
    href: "/engineering/exams/profile",
    label: "PROCTOR LOGS", // Changed from Student ID to focus on the teacher's task
  },
];