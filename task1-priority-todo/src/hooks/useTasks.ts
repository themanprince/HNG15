import { useCallback, useMemo } from "react";
import type { Priority, Task } from "../types";
import { nextOrder, sortTasks } from "../lib/sorting";
import { parseTasks, TASKS_KEY } from "../lib/storage";
import { useLocalStorage } from "./useLocalStorage";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, parseTasks);

  const addTask = useCallback(
    (title: string, priority: Priority) => {
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
          priority,
          order: nextOrder(prev, priority),
          createdAt: Date.now(),
        },
      ]);
    },
    [setTasks],
  );

  const updateTitle = useCallback(
    (id: string, title: string) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
    },
    [setTasks],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, [setTasks]);

  /** Replaces tasks with the given updated versions (matched by id). */
  const applyRanking = useCallback(
    (updated: readonly Task[]) => {
      const byId = new Map(updated.map((t) => [t.id, t]));
      setTasks((prev) => prev.map((t) => byId.get(t.id) ?? t));
    },
    [setTasks],
  );

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);

  return { tasks: sorted, addTask, updateTitle, toggleTask, deleteTask, clearCompleted, applyRanking };
}
