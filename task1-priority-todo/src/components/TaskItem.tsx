import { useState, type FormEvent } from "react";
import type { Task } from "../types";
import { PriorityBadge } from "./PriorityBadge";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function TaskItem({ task, onToggle, onDelete, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  function startEdit() {
    setDraft(task.title);
    setEditing(true);
  }

  function save(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.title) onRename(task.id, trimmed);
    setEditing(false);
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        className="h-5 w-5"
      />
      {editing ? (
        <form onSubmit={save} className="flex-1">
          <label htmlFor={`edit-${task.id}`} className="sr-only">
            Edit task
          </label>
          <input
            id={`edit-${task.id}`}
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => save()}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            className="w-full rounded border border-slate-300 px-2 py-1"
          />
        </form>
      ) : (
        <span className={`flex-1 break-words ${task.completed ? "text-slate-400 line-through" : ""}`}>
          {task.title}
        </span>
      )}
      {!editing && <PriorityBadge priority={task.priority} />}
      {!editing && (
        <button type="button" onClick={startEdit} className="text-sm text-slate-500">
          Edit
        </button>
      )}
      <button type="button" onClick={() => onDelete(task.id)} className="text-sm text-red-600">
        Delete
      </button>
    </li>
  );
}
