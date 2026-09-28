import type { Priority, Task } from "../types";

export const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Sorting rules from AGENTS.md: incomplete first, then priority, then order, then oldest. */
export function compareTasks(a: Task, b: Task): number {
  return (
    Number(a.completed) - Number(b.completed) ||
    PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
    a.order - b.order ||
    a.createdAt - b.createdAt
  );
}

export function sortTasks(tasks: readonly Task[]): Task[] {
  return [...tasks].sort(compareTasks);
}

/** The `order` that places a new task at the bottom of its priority group. */
export function nextOrder(tasks: readonly Task[], priority: Priority): number {
  return tasks.reduce((max, t) => (t.priority === priority ? Math.max(max, t.order + 1) : max), 0);
}
