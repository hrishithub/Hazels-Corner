"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { PlannerDay, PlannerTask } from "@/components/journey/JourneyProgressContext";
import { TaskCard } from "@/components/planner/TaskCard";

export function PlannerDayColumn({
  day,
  onChange
}: {
  day: PlannerDay;
  onChange: (day: PlannerDay) => void;
}) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    onChange({
      ...day,
      tasks: [
        ...day.tasks,
        {
          id: `${day.day}-${Date.now()}`,
          title: title.trim(),
          note: note.trim(),
          done: false
        }
      ]
    });
    setTitle("");
    setNote("");
  }

  function updateTask(taskId: string, nextTask: PlannerTask) {
    onChange({ ...day, tasks: day.tasks.map((task) => (task.id === taskId ? nextTask : task)) });
  }

  function editTask(task: PlannerTask) {
    const nextTitle = window.prompt("Edit this task gently:", task.title);
    if (nextTitle === null || !nextTitle.trim()) return;
    const nextNote = window.prompt("Optional note:", task.note) ?? task.note;
    updateTask(task.id, { ...task, title: nextTitle.trim(), note: nextNote.trim() });
  }

  return (
    <section className="glass min-h-[420px] rounded-[1.5rem] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl text-ink">{day.day}</p>
          <p className="mt-1 rounded-full bg-white/44 px-3 py-1 text-xs text-plum">Focus: {day.focus}</p>
        </div>
        <span className="rounded-full bg-butter/35 px-2 py-1 text-xs text-ink/60">{day.tasks.filter((task) => task.done).length}/{day.tasks.length}</span>
      </div>

      <div className="space-y-3">
        {day.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => onChange({ ...day, tasks: day.tasks.filter((item) => item.id !== task.id) })}
            onEdit={() => editTask(task)}
            onToggle={() => updateTask(task.id, { ...task, done: !task.done })}
          />
        ))}
      </div>

      <form className="mt-4 space-y-2" onSubmit={addTask}>
        <input
          className="w-full rounded-2xl border border-white/45 bg-white/42 px-3 py-2 text-sm text-ink placeholder:text-ink/42 focus:outline-none focus:ring-2 focus:ring-lilac/60"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="add a small task..."
          value={title}
        />
        <input
          className="w-full rounded-2xl border border-white/35 bg-white/30 px-3 py-2 text-xs text-ink placeholder:text-ink/38 focus:outline-none focus:ring-2 focus:ring-lilac/60"
          onChange={(event) => setNote(event.target.value)}
          placeholder="soft note, optional"
          value={note}
        />
        <button className="inline-flex h-10 items-center gap-2 rounded-2xl bg-plum px-4 text-sm text-white shadow-soft" type="submit">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
    </section>
  );
}
