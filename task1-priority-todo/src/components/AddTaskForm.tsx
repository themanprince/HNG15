import { useState, type FormEvent } from "react";
import type { Priority } from "../types";
import { PriorityPicker } from "./PriorityPicker";

interface Props {
  onAdd: (title: string, priority: Priority) => void;
}

export function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setTitle("");
    setPriority("medium");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
      <label htmlFor="new-task" className="sr-only">
        New task
      </label>
      <input
        id="new-task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2"
      />
      <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
          Add
        </button>
      </div>
      <PriorityPicker value={priority} onChange={setPriority} />
    </form>
  );
}
