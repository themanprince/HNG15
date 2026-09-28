import { useMemo, useState } from "react";
import type { Filter } from "./types";
import { useTasks } from "./hooks/useTasks";
import { AddTaskForm } from "./components/AddTaskForm";
import { FilterBar } from "./components/FilterBar";
import { TaskList } from "./components/TaskList";

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: "No tasks yet. Add one above!",
  active: "Nothing left to do.",
  completed: "No completed tasks yet.",
};

export function App() {
  const { tasks, addTask, updateTitle, toggleTask, deleteTask, clearCompleted } = useTasks();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      tasks.filter((t) => (filter === "all" ? true : filter === "active" ? !t.completed : t.completed)),
    [tasks, filter],
  );
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - activeCount;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-slate-900">Priority To-Do</h1>
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
        <button type="button" onClick={clearCompleted} className="self-end text-sm text-slate-500">
          Clear completed ({completedCount})
        </button>
      )}
    </main>
  );
}
