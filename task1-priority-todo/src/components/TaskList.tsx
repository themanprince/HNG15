import type { Task } from "../types";
import { TaskItem } from "./TaskItem";

interface Props {
  tasks: Task[];
  emptyMessage: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function TaskList({ tasks, emptyMessage, ...handlers }: Props) {
  if (tasks.length === 0) {
    return <p className="py-10 text-center text-slate-500">{emptyMessage}</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} {...handlers} />
      ))}
    </ul>
  );
}
