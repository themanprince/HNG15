import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Task } from "../types";
import {
  assignPriorities,
  currentMatchup,
  isFinished,
  pickWinner,
  rankByScore,
  skipRound,
  startSession,
} from "../lib/ranking";
import { MatchupCard } from "./MatchupCard";
import { RankingResults } from "./RankingResults";

interface Props {
  /** Incomplete tasks in their current display order. */
  tasks: readonly Task[];
  onApply: (ranked: Task[]) => void;
  onClose: () => void;
}

const PICK_DELAY_MS = 260;

export function RankingModal({ tasks, onApply, onClose }: Props) {
  const [session, setSession] = useState(() => startSession(tasks));
  const [showResults, setShowResults] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const tooFew = tasks.length < 2;
  const byId = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);
  const matchup = currentMatchup(session);
  const done = showResults || isFinished(session);
  const total = session.matchups.length;

  const ranked = useMemo(
    () => (done ? assignPriorities(rankByScore(tasks, session.scores)) : []),
    [done, tasks, session.scores],
  );

  // Lock page scroll and focus the dialog while open; restore focus on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  // Cards remount each round; keep focus inside the dialog so arrow keys keep working.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.contains(document.activeElement)) dialog.focus();
  }, [session.round, done]);

  // Advance after the pick animation has played.
  useEffect(() => {
    if (!picked) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => {
        setSession((s) => pickWinner(s, picked));
        setPicked(null);
      },
      reduceMotion ? 0 : PICK_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [picked]);

  function pick(id: string) {
    if (!picked) setPicked(id);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Tab") {
      // Keep focus inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled)");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (done || !matchup) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      pick(matchup[0]);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      pick(matchup[1]);
    }
  }

  const secondaryBtn =
    "rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-40";
  const primaryBtn =
    "rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300";

  let body;
  if (tooFew) {
    body = (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-4xl" aria-hidden="true">
          🤔
        </p>
        <p className="text-lg text-slate-700">
          You need at least two unfinished tasks to rank. Add a few more and come back!
        </p>
        <button type="button" onClick={onClose} className={primaryBtn}>
          Got it
        </button>
      </div>
    );
  } else if (done) {
    body = (
      <>
        <p className="text-slate-600">Here's your new order. Apply it to update your list and priorities.</p>
        <div className="-mx-1 flex-1 overflow-y-auto px-1 py-1">
          <RankingResults ranked={ranked} scores={session.scores} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={secondaryBtn}>
            Cancel
          </button>
          <button type="button" onClick={() => onApply(ranked)} className={primaryBtn}>
            Apply
          </button>
        </div>
      </>
    );
  } else if (matchup) {
    const [left, right] = matchup;
    const cardState = (id: string) => (picked === null ? "idle" : picked === id ? "picked" : "faded");
    body = (
      <>
        <div>
          <div className="mb-1 flex justify-between text-sm text-slate-500">
            <span>
              Round {session.round + 1} of {total}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Ranking progress"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={session.round}
            className="h-2 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-indigo-500 transition-[width] duration-300"
              style={{ width: `${(session.round / total) * 100}%` }}
            />
          </div>
        </div>
        <h3 className="text-center text-xl font-bold text-slate-900">Which matters more right now?</h3>
        <div key={session.round} className="grid gap-3 motion-safe:animate-pop-in sm:grid-cols-2">
          {[left, right].map((id, i) => {
            const task = byId.get(id);
            return task ? (
              <MatchupCard
                key={id}
                task={task}
                side={i === 0 ? "left" : "right"}
                state={cardState(id)}
                disabled={picked !== null}
                onPick={pick}
              />
            ) : null;
          })}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSession(skipRound)}
            disabled={picked !== null}
            className={secondaryBtn}
          >
            Skip
          </button>
          <button type="button" onClick={() => setShowResults(true)} className={secondaryBtn}>
            Done, show results
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ranking-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex max-h-[100dvh] min-h-[70dvh] w-full max-w-2xl flex-col gap-4 rounded-t-3xl bg-slate-50 p-5 shadow-xl outline-none motion-safe:animate-pop-in sm:min-h-0 sm:rounded-3xl sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 id="ranking-title" className="text-lg font-bold text-indigo-700">
            {done && !tooFew ? "Your new ranking" : "Rank my tasks"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {body}
      </div>
    </div>
  );
}
