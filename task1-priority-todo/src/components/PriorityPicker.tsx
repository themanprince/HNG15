import type { Priority } from "../types";
import { PRIORITIES, PRIORITY_LABEL, PRIORITY_STYLES } from "../lib/priority";

interface Props {
  value: Priority;
  onChange: (priority: Priority) => void;
}

export function PriorityPicker({ value, onChange }: Props) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">Priority</legend>
      {PRIORITIES.map((p) => (
        <label
          key={p}
          className={`cursor-pointer rounded-full border px-3 py-1 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 ${
            value === p ? PRIORITY_STYLES[p].selected : "border-slate-300 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <input
            type="radio"
            name="priority"
            value={p}
            checked={value === p}
            onChange={() => onChange(p)}
            className="sr-only"
          />
          {PRIORITY_LABEL[p]}
        </label>
      ))}
    </fieldset>
  );
}
