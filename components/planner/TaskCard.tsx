"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { PlannerTask } from "@/components/journey/JourneyProgressContext";

export function TaskCard({
  task,
  onDelete,
  onEdit,
  onToggle
}: {
  task: PlannerTask;
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-2xl border p-3 transition ${task.done ? "border-butter/60 bg-butter/18" : "border-white/45 bg-white/36"}`}>
      <div className="flex items-start gap-3">
        <button
          aria-label={task.done ? "Mark incomplete" : "Mark complete"}
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${
            task.done ? "border-plum bg-plum text-white" : "border-plum/30 bg-white/40 text-transparent"
          }`}
          onClick={onToggle}
        >
          <Check className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium leading-5 ${task.done ? "text-ink/55 line-through" : "text-ink"}`}>{task.title}</p>
          {task.note && <p className="mt-1 text-xs leading-5 text-ink/55">{task.note}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <button className="rounded-lg p-1.5 text-ink/45 hover:bg-white/50 hover:text-plum" onClick={onEdit} aria-label="Edit task">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button className="rounded-lg p-1.5 text-ink/45 hover:bg-white/50 hover:text-plum" onClick={onDelete} aria-label="Delete task">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
