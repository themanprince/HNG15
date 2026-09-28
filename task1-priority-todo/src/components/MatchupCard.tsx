import type { Task } from "../types";
import { PriorityBadge } from "./PriorityBadge";

interface Props {
  task: Task;
  side: "left" | "right";
  state: "idle" | "picked" | "faded";
  disabled: boolean;
  onPick: (id: string) => void;
}

const STATE_CLASSES: Record<Props["state"], string> = {
  idle: "border-slate-200 hover:border-indigo-400 hover:shadow-md active:scale-[0.98]",
  picked: "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-200 motion-safe:animate-picked",
  faded: "border-slate-200 opacity-40",
};

export function MatchupCard({ task, side, state, disabled, onPick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPick(task.id)}
      aria-keyshortcuts={side === "left" ? "ArrowLeft" : "ArrowRight"}
      className={`flex min-h-32 w-full flex-col items-start justify-between gap-3 rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 sm:min-h-44 ${STATE_CLASSES[state]}`}
    >
      <span className="text-lg font-semibold break-words text-slate-900">{task.title}</span>
      <span className="flex w-full items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <kbd className="hidden rounded border border-slate-300 px-1.5 text-xs text-slate-400 sm:inline">
          {side === "left" ? "←" : "→"}
        </kbd>
      </span>
    </button>
  );
}
