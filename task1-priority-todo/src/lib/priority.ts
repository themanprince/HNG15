import type { Priority } from "../types";

export const PRIORITIES: readonly Priority[] = ["high", "medium", "low"];

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

/** Tailwind classes per priority (kept as full literals so Tailwind can detect them). */
export const PRIORITY_STYLES: Record<Priority, { badge: string; dot: string; selected: string; stripe: string }> = {
  high: {
    badge: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
    selected: "bg-rose-500 text-white border-rose-500",
    stripe: "border-l-rose-500",
  },
  medium: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
    selected: "bg-amber-400 text-amber-950 border-amber-400",
    stripe: "border-l-amber-400",
  },
  low: {
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
    selected: "bg-sky-500 text-white border-sky-500",
    stripe: "border-l-sky-500",
  },
};
