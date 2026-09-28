import type { Filter } from "../types";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export function FilterBar({ filter, onChange }: Props) {
  return (
    <div role="group" aria-label="Filter tasks" className="flex rounded-xl bg-slate-200/70 p-1">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={filter === value}
          onClick={() => onChange(value)}
          className={`rounded-lg px-3 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            filter === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
