"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);

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
    onChange({
      ...day,
      tasks: day.tasks.map((task) =>
        task.id === taskId ? nextTask : task
      )
    });
  }

  function editTask(task: PlannerTask) {
    setEditingTask(task);
  }

  function clearDayTasks() {
    if (day.tasks.length === 0) return;

    onChange({
      ...day,
      tasks: []
    });

    setConfirmingClear(false);
  }

  return (
    <section className="glass min-h-[420px] rounded-[1.5rem] p-4">

      {/* EDIT MODAL */}

      <AnimatePresence>
        {editingTask && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
          >

            <motion.div
              className="glass w-full max-w-md rounded-[1.5rem] p-6 shadow-glow"
              initial={{scale:0.95,y:20}}
              animate={{scale:1,y:0}}
              exit={{scale:0.95,y:20}}
            >

              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-lilac/30 text-plum">
                <Pencil className="h-5 w-5"/>
              </div>

              <p className="font-display text-3xl text-ink">
                Edit task
              </p>


              <input
                className="mt-5 w-full rounded-2xl border border-white/45 bg-white/50 px-4 py-3 text-sm text-ink focus:outline-none"
                value={editingTask.title}
                onChange={(e)=>
                  setEditingTask({
                    ...editingTask,
                    title:e.target.value
                  })
                }
              />


              <textarea
                className="mt-3 min-h-32 w-full rounded-2xl border border-white/45 bg-white/50 px-4 py-3 text-sm text-ink focus:outline-none"
                placeholder="Write study details, progress, problems..."
                value={editingTask.note}
                onChange={(e)=>
                  setEditingTask({
                    ...editingTask,
                    note:e.target.value
                  })
                }
              />


              <div className="mt-6 flex justify-end gap-3">

                <button
                  className="h-11 rounded-2xl bg-white/60 px-4 text-sm text-plum"
                  onClick={()=>setEditingTask(null)}
                  type="button"
                >
                  Cancel
                </button>


                <button
                  className="h-11 rounded-2xl bg-plum px-4 text-sm text-white shadow-soft"
                  type="button"
                  onClick={()=>{

                    if(!editingTask.title.trim()) return;

                    updateTask(editingTask.id,{
                      ...editingTask,
                      title:editingTask.title.trim(),
                      note:editingTask.note.trim()
                    });

                    setEditingTask(null);
                  }}
                >
                  Save changes
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>


      <div className="mb-4 flex items-start justify-between gap-3">

        <div>
          <p className="font-display text-2xl text-ink">
            {day.day}
          </p>

          <p className="mt-1 rounded-full bg-white/44 px-3 py-1 text-xs text-plum">
            Focus: {day.focus}
          </p>
        </div>


        <button
          disabled={day.tasks.length===0}
          onClick={()=>setConfirmingClear(true)}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/42 text-ink/45"
        >
          <Trash2 className="h-4 w-4"/>
        </button>

      </div>


      <div className="space-y-3">

        {day.tasks.map((task)=>(

          <TaskCard
            key={task.id}
            task={task}
            onDelete={() =>
              onChange({
                ...day,
                tasks:day.tasks.filter(
                  (item)=>item.id!==task.id
                )
              })
            }
            onEdit={()=>editTask(task)}
            onToggle={() =>
              updateTask(task.id,{
                ...task,
                done:!task.done
              })
            }
          />

        ))}

      </div>


      <form
        className="mt-4 space-y-2"
        onSubmit={addTask}
      >

        <input
          className="w-full rounded-2xl border border-white/45 bg-white/42 px-3 py-2 text-sm"
          placeholder="add a small task..."
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          className="w-full rounded-2xl border border-white/35 bg-white/30 px-3 py-2 text-xs"
          placeholder="small note, optional"
          value={note}
          onChange={(e)=>setNote(e.target.value)}
        />

        <button
          className="inline-flex h-10 items-center gap-2 rounded-2xl bg-plum px-4 text-sm text-white shadow-soft"
        >

          <Plus className="h-4 w-4"/>
          Add

        </button>

      </form>

    </section>
  );
}