import { useState, type FormEvent } from "react";
import type { Task } from "../types";
import { PRIORITY_STYLES } from "../lib/priority";
import { PriorityBadge } from "./PriorityBadge";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

const iconBtn =
  "rounded-lg p-2 text-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";

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
    <li
      className={`flex items-center gap-3 rounded-xl border border-l-4 border-slate-200 bg-white py-2 pr-2 pl-3 shadow-sm ${
        task.completed ? "border-l-slate-300 opacity-70" : PRIORITY_STYLES[task.priority].stripe
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
      />
      {editing ? (
        <form onSubmit={save} className="min-w-0 flex-1">
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
            className="w-full rounded-lg border border-indigo-400 px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </form>
      ) : (
        <>
          <span
            className={`min-w-0 flex-1 break-words ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}
          >
            {task.title}
          </span>
          <PriorityBadge priority={task.priority} />
          <button type="button" onClick={startEdit} aria-label={`Edit "${task.title}"`} className={`${iconBtn} hover:text-indigo-600`}>
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M13.6 2.6a2 2 0 012.8 2.8l-9 9-3.9 1.1 1.1-3.9 9-9z" />
            </svg>
          </button>
        </>
      )}
      <button type="button" onClick={() => onDelete(task.id)} aria-label={`Delete "${task.title}"`} className={`${iconBtn} hover:text-rose-600`}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M8 2h4a1 1 0 011 1v1h4v2H3V4h4V3a1 1 0 011-1zM4 7h12l-1 10a2 2 0 01-2 1.8H7A2 2 0 015 17L4 7z" />
        </svg>
      </button>
    </li>
  );
}
