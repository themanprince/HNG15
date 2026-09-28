import { useState, type FormEvent } from "react";

interface Props {
  onAdd: (title: string) => void;
}

export function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
    </form>
  );
}
