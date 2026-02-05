import { Card } from "@/components/pm/ui/Card";
import { Pill } from "@/components/pm/ui/Pill";
import type { TaskItem, TaskStatus } from "@/lib/pm/mockTasks";

const statusTokens: Record<TaskStatus, { label: string; tone: string }> = {
  "not-started": {
    label: "Not started",
    tone: "text-white/70 border-white/20",
  },
  "in-progress": {
    label: "In progress",
    tone: "text-sky-200 border-sky-300/40",
  },
  blocked: {
    label: "Blocked",
    tone: "text-amber-200 border-amber-200/40",
  },
};

const priorityTone: Record<TaskItem["priority"], string> = {
  high: "text-rose-200 border-rose-200/30",
  medium: "text-amber-200 border-amber-200/30",
  low: "text-emerald-200 border-emerald-200/30",
};

export function TaskBoard({
  tasks,
  onStartTask,
}: {
  tasks: TaskItem[];
  onStartTask: (task: TaskItem) => void;
}) {
  return (
    <Card
      title="Task Board"
      right={
        <div className="text-xs text-white/50">
          {tasks.filter((t) => t.status === "in-progress").length} in progress
        </div>
      }
      className="bg-gradient-to-b from-[#0c0f2a] to-[#0b0d24]"
    >
      <div className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-purple-400/10 bg-[#1a1233]/70 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-white">{task.title}</h3>
              <span
                className={[
                  "rounded-full border px-2 py-0.5 text-[11px]",
                  statusTokens[task.status].tone,
                ].join(" ")}
              >
                {statusTokens[task.status].label}
              </span>
              <span
                className={[
                  "rounded-full border px-2 py-0.5 text-[11px]",
                  priorityTone[task.priority],
                ].join(" ")}
              >
                {task.priority} priority
              </span>
            </div>

            <p className="mt-2 text-sm text-white/70 leading-relaxed">
              {task.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-[11px] font-semibold text-white/80">
                  {task.assignee.avatar}
                </div>
                <div className="leading-tight">
                  <div className="text-white/90">{task.assignee.name}</div>
                  <div className="text-white/50">{task.estimate} estimate</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/50">Related Files:</span>
                {task.files.map((file) => (
                  <Pill key={file}>{file}</Pill>
                ))}
              </div>
              <button
                onClick={() => onStartTask(task)}
                className="ml-auto rounded-2xl border border-purple-400/30 bg-purple-500/20 px-3 py-1.5 text-xs text-white/90 hover:bg-purple-500/30"
              >
                Start Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
