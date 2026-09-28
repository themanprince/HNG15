export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  order: number;
  createdAt: number;
}

export type Filter = "all" | "active" | "completed";
