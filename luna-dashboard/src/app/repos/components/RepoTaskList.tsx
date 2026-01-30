import { Card } from "@/components/ui/Card";
import type { DevTask } from "@/data/dev/dashboardData";

type RepoTaskListProps = {
  tasks: DevTask[];
};

export function RepoTaskList({ tasks }: RepoTaskListProps) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Live tasks
      </h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No live tasks for this repo yet.
        </p>
      ) : (
        <ul className="space-y-3 text-sm">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-xl border px-4 py-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{task.owner}</span>
                <span>{task.status}</span>
              </div>
              <p className="text-slate-900">{task.title}</p>
              <p className="text-slate-600">{task.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
