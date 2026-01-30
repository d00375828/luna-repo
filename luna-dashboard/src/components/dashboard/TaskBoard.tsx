import type { DevRepo, DevTask, DevTaskStatus } from "@/data/dev/dashboardData";

const STATUS_LABELS: Record<DevTaskStatus, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "In Review",
  done: "Done",
};

const PRIORITY_TAGS = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-600",
  high: "bg-rose-100 text-rose-600",
};

type TaskBoardProps = {
  groupedTasks: Record<DevTaskStatus, DevTask[]>;
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  repos: DevRepo[];
};

export function TaskBoard({
  groupedTasks,
  selectedTaskId,
  onSelectTask,
  repos,
}: TaskBoardProps) {
  return (
    <div id="tasks" className="grid gap-3 lg:grid-cols-4">
      {Object.entries(STATUS_LABELS).map(([status, label]) => {
        const typedStatus = status as DevTaskStatus;
        const columnTasks = groupedTasks[typedStatus];
        return (
          <div
            key={status}
            className="rounded-2xl border bg-slate-50/60 p-3 shadow-inner"
          >
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>{label}</span>
              <span>{columnTasks.length}</span>
            </div>
            <div className="space-y-3">
              {columnTasks.length === 0 && (
                <p className="text-xs text-slate-400">No tasks yet.</p>
              )}
              {columnTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onSelectTask(task.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selectedTaskId === task.id
                      ? "border-indigo-400 bg-white shadow"
                      : "bg-white/90 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{task.owner}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_TAGS[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{task.title}</p>
                  <p className="text-xs text-slate-500">
                    {repos.find((repo) => repo.id === task.repoId)?.name ??
                      "Unknown repo"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
