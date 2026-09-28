import type { Task } from "../types";
import type { Scores } from "../lib/ranking";
import { PriorityBadge } from "./PriorityBadge";

interface Props {
  ranked: readonly Task[];
  scores: Scores;
}

export function RankingResults({ ranked, scores }: Props) {
  return (
    <ol className="flex flex-col gap-2">
      {ranked.map((task, index) => (
        <li
          key={task.id}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 motion-safe:animate-pop-in"
        >
          <span className="w-6 shrink-0 text-right font-bold text-slate-400">{index + 1}</span>
          <span className="min-w-0 flex-1 break-words text-slate-900">{task.title}</span>
          <span className="shrink-0 text-xs text-slate-400">
            {scores[task.id] ?? 0} pt{scores[task.id] === 1 ? "" : "s"}
          </span>
          <PriorityBadge priority={task.priority} />
        </li>
      ))}
    </ol>
  );
}
