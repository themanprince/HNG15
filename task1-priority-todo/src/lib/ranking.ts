import type { Priority, Task } from "../types";
import { PRIORITIES } from "./priority";

/** Two task ids shown against each other in one round. */
export type Matchup = readonly [string, string];

export type Scores = Readonly<Record<string, number>>;

export interface RankingSession {
  matchups: readonly Matchup[];
  /** Index of the current matchup; equals matchups.length when finished. */
  round: number;
  scores: Scores;
}

export type RandomFn = () => number;

/** Fisher–Yates shuffle; returns a new array. */
export function shuffle<T>(items: readonly T[], random: RandomFn = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * Builds the matchups for a ranking session.
 * - 6 or fewer tasks: every possible pair, shuffled.
 * - More than 6: random unique pairs, capped at `ids.length * 2`, with every task appearing at least once.
 */
export function buildMatchups(ids: readonly string[], random: RandomFn = Math.random): Matchup[] {
  if (ids.length < 2) return [];

  const pairs: Matchup[] = [];
  const seen = new Set<string>();
  const add = (a: string, b: string) => {
    const key = pairKey(a, b);
    if (a === b || seen.has(key)) return;
    seen.add(key);
    // Randomise which side each task appears on.
    pairs.push(random() < 0.5 ? [a, b] : [b, a]);
  };

  if (ids.length <= 6) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) add(ids[i], ids[j]);
    }
    return shuffle(pairs, random);
  }

  const cap = ids.length * 2;

  // Coverage: pair up a shuffled copy so every task appears at least once.
  const shuffled = shuffle(ids, random);
  for (let i = 0; i + 1 < shuffled.length; i += 2) add(shuffled[i], shuffled[i + 1]);
  if (shuffled.length % 2 === 1) {
    const last = shuffled[shuffled.length - 1];
    add(last, shuffled[Math.floor(random() * (shuffled.length - 1))]);
  }

  // Fill the rest with random unique pairs. n > 6 guarantees n(n-1)/2 > 2n unique pairs exist.
  while (pairs.length < cap) {
    const a = ids[Math.floor(random() * ids.length)];
    const b = ids[Math.floor(random() * ids.length)];
    add(a, b);
  }

  return shuffle(pairs, random);
}

export function startSession(tasks: readonly Task[], random: RandomFn = Math.random): RankingSession {
  const ids = tasks.map((t) => t.id);
  return {
    matchups: buildMatchups(ids, random),
    round: 0,
    scores: Object.fromEntries(ids.map((id) => [id, 0])),
  };
}

export function currentMatchup(session: RankingSession): Matchup | undefined {
  return session.matchups[session.round];
}

export function isFinished(session: RankingSession): boolean {
  return session.round >= session.matchups.length;
}

/** Awards the winner of the current round one point and advances. */
export function pickWinner(session: RankingSession, winnerId: string): RankingSession {
  if (isFinished(session)) return session;
  return {
    ...session,
    round: session.round + 1,
    scores: { ...session.scores, [winnerId]: (session.scores[winnerId] ?? 0) + 1 },
  };
}

/** Advances without awarding any points. */
export function skipRound(session: RankingSession): RankingSession {
  if (isFinished(session)) return session;
  return { ...session, round: session.round + 1 };
}

/**
 * Sorts tasks by points (descending). `tasks` must be in their previous display order,
 * which breaks ties.
 */
export function rankByScore(tasks: readonly Task[], scores: Scores): Task[] {
  return tasks
    .map((task, index) => ({ task, index, points: scores[task.id] ?? 0 }))
    .sort((a, b) => b.points - a.points || a.index - b.index)
    .map(({ task }) => task);
}

/** Priority for position `index` in a ranked list of `total`: top third High, middle Medium, bottom Low. */
export function priorityForPosition(index: number, total: number): Priority {
  return PRIORITIES[Math.min(2, Math.floor((index * 3) / total))];
}

/** Assigns priorities by thirds and resets `order` within each priority group to match the ranking. */
export function assignPriorities(ranked: readonly Task[]): Task[] {
  const nextOrder: Record<Priority, number> = { high: 0, medium: 0, low: 0 };
  return ranked.map((task, index) => {
    const priority = priorityForPosition(index, ranked.length);
    return { ...task, priority, order: nextOrder[priority]++ };
  });
}
