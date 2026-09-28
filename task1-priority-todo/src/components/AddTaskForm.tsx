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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex gap-2">
        <label htmlFor="new-task" className="sr-only">
          New task
        </label>
        <input
          id="new-task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
        >
          Add
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500" aria-hidden="true">
          Priority
        </span>
        <PriorityPicker value={priority} onChange={setPriority} />
      </div>
    </form>
  );
}
