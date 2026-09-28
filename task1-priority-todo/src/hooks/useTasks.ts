import { useCallback } from "react";
import type { Task } from "../types";
import { parseTasks, TASKS_KEY } from "../lib/storage";
import { useLocalStorage } from "./useLocalStorage";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, parseTasks);

  const addTask = useCallback(
    (title: string) => {
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
          priority: "medium",
          order: prev.length,
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

  return { tasks, addTask, updateTitle, toggleTask, deleteTask, clearCompleted };
}
