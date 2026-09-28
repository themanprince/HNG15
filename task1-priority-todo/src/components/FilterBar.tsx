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
    <div role="group" aria-label="Filter tasks" className="flex gap-1">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={filter === value}
          onClick={() => onChange(value)}
          className={`rounded-md px-3 py-1 text-sm ${filter === value ? "bg-indigo-600 text-white" : "text-slate-600"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
