import type { Priority } from "../types";
import { PRIORITY_LABEL, PRIORITY_STYLES } from "../lib/priority";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[priority].badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_STYLES[priority].dot}`} aria-hidden="true" />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
