import type { Priority, Task } from "../types";

export const TASKS_KEY = "todo-app:tasks";

const PRIORITIES: readonly Priority[] = ["high", "medium", "low"];

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    typeof v.completed === "boolean" &&
    typeof v.priority === "string" &&
    PRIORITIES.includes(v.priority as Priority) &&
    typeof v.order === "number" &&
    typeof v.createdAt === "number"
  );
}

/** Parses stored tasks, dropping anything malformed. Never throws. */
export function parseTasks(raw: unknown): Task[] {
  return Array.isArray(raw) ? raw.filter(isTask) : [];
}

export function readJSON(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private mode): keep working in memory.
  }
}
