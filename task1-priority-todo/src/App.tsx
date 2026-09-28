import { useMemo, useState } from "react";
import type { Filter } from "./types";
import { useTasks } from "./hooks/useTasks";
import { AddTaskForm } from "./components/AddTaskForm";
import { FilterBar } from "./components/FilterBar";
import { TaskList } from "./components/TaskList";
import { RankingModal } from "./components/RankingModal";

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: "No tasks yet. Add one above!",
  active: "Nothing left to do.",
  completed: "No completed tasks yet.",
};

export function App() {
  const { tasks, addTask, updateTitle, toggleTask, deleteTask, clearCompleted, applyRanking } =
    useTasks();
  const [filter, setFilter] = useState<Filter>("all");
  const [ranking, setRanking] = useState(false);

  const visible = useMemo(
    () =>
      tasks.filter((t) => (filter === "all" ? true : filter === "active" ? !t.completed : t.completed)),
    [tasks, filter],
  );
  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const activeCount = activeTasks.length;
  const completedCount = tasks.length - activeCount;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-4 px-4 pt-6 pb-10 sm:pt-10">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Priority To-Do</h1>
        <button
          type="button"
          onClick={() => setRanking(true)}
          className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
        >
          Rank my tasks
        </button>
      </header>
      <AddTaskForm onAdd={addTask} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FilterBar filter={filter} onChange={setFilter} />
        <p className="text-sm text-slate-500" aria-live="polite">
          {activeCount} {activeCount === 1 ? "task" : "tasks"} left
        </p>
      </div>
      <TaskList
        tasks={visible}
        emptyMessage={EMPTY_MESSAGES[filter]}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onRename={updateTitle}
      />
      {completedCount > 0 && (
        <button
          type="button"
          onClick={clearCompleted}
          className="self-end rounded-lg px-2 py-1 text-sm text-slate-500 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Clear completed ({completedCount})
        </button>
      )}
      {ranking && (
        <RankingModal
          tasks={activeTasks}
          onClose={() => setRanking(false)}
          onApply={(ranked) => {
            applyRanking(ranked);
            setRanking(false);
          }}
        />
      )}
    </main>
  );
}
