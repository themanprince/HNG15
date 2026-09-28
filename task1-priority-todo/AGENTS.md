# AGENTS.md

Guidance for AI coding agents (Claude Code and others) working on this project.

## Project overview

A to-do list web app with one signature feature: **Priority by Comparison**. Users can set a priority when adding a task, and they can also re-rank the whole list by answering quick "which matters more?" matchups between two tasks. The app is frontend-only, saves data in browser storage (localStorage), and deploys to Vercel.

## Tech stack

- React 18 + TypeScript, bootstrapped with Vite
- Tailwind CSS for styling
- No backend, no database, no external APIs, no auth
- Keep dependencies minimal. Don't add a library for something that takes under ~30 lines to write.

## Commands

- `npm install`: install dependencies
- `npm run dev`: start the dev server
- `npm run build`: production build (must pass before any task is considered done)
- `npm run preview`: preview the production build
- `npm run lint`: lint (if configured)

## Folder structure

```
src/
  components/     UI components (TaskItem, TaskList, AddTaskForm, RankingModal, ...)
  hooks/          custom hooks (useTasks, useLocalStorage)
  lib/            pure logic with no React (ranking.ts, sorting.ts, storage.ts)
  types.ts        shared types
  App.tsx
  main.tsx
```

Keep ranking and sorting logic in `src/lib/` as pure functions so they're easy to reason about and test.

## Data model

```ts
type Priority = "high" | "medium" | "low";

interface Task {
  id: string;           // crypto.randomUUID()
  title: string;
  completed: boolean;
  priority: Priority;
  order: number;        // position within its priority group (lower = higher up)
  createdAt: number;    // timestamp
}
```

- Store all tasks under one localStorage key: `todo-app:tasks`.
- Always read storage defensively (wrap it in try/catch, and fall back to an empty list if the data is missing or corrupt).

## Sorting rules (the single source of truth)

1. Incomplete tasks come first, then completed tasks.
2. Among incomplete tasks: High, then Medium, then Low.
3. Within the same priority: ascending `order`.
4. Ties on `order` are broken by older `createdAt` first.

## Priority by Comparison (core feature)

**Adding a task:** the user picks High, Medium, or Low (default Medium). The new task goes to the **bottom of its priority group**.

**Re-ranking (the "Rank my tasks" button):**
1. Take all incomplete tasks. If there are fewer than 2, show a friendly message instead.
2. Build matchups:
   - 6 or fewer tasks: every possible pair, shuffled.
   - More than 6: random pairs, capped at `tasks.length * 2` rounds, making sure every task appears at least once.
3. Show one matchup at a time: two task cards, and the user taps the one that matters more. There is also a **Skip** button (no points awarded) and a progress bar ("Round 3 of 10").
4. Each win = +1 point. The user can press **"Done, show results"** early at any time.
5. Sort by points (descending), breaking ties by the task's previous position.
6. Show a results screen with the new order. **Apply** saves it; **Cancel** discards it.
7. On apply, split the ranked list into thirds and assign priorities: top third High, middle third Medium, bottom third Low (round sensibly for small lists). Reset `order` within each group to match the ranking.

Completed tasks are never included in ranking.

## Regular features

Add, edit (inline), delete, mark complete/incomplete, clear completed, filter (All / Active / Completed), and a task counter.

## Code conventions

- Functional components and hooks only.
- TypeScript strict mode. No `any`.
- Small components, one per file, named exports.
- Use Tailwind classes, not separate CSS files (except `index.css` for the Tailwind directives).
- Accessible by default: real `<button>`s, labels on inputs, visible focus states, keyboard-usable ranking (e.g. Left/Right arrow keys to pick).
- Mobile-first layout that works from 360px wide upward.

## Things not to do

- Don't add a backend, database, API keys, or a login.
- Don't add features beyond this spec without asking.
- Don't rewrite whole files for small changes. Make targeted edits.
- Don't leave `console.log`s in finished code.

## Definition of done

- `npm run build` passes with no TypeScript errors.
- Tasks and priorities survive a page refresh.
- Ranking works with 2 tasks, 6 tasks, and 10+ tasks.
- The app is ready to deploy to Vercel with zero extra configuration (Vite preset).
