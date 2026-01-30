import type { DevPresence, DevRepo, DevTask } from "@/data/dev/dashboardData";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatRelativeMinutes } from "@/lib/time";

type DevLocationsProps = {
  devs: DevPresence[];
  repos: DevRepo[];
  tasks: DevTask[];
};

export function DevLocations({ devs, repos, tasks }: DevLocationsProps) {
  const repoById = new Map(repos.map((repo) => [repo.id, repo]));
  const taskById = new Map(tasks.map((task) => [task.id, task]));

  return (
    <Card>
      <SectionHeader eyebrow="Live Presence" title="Who is in which file?" />
      <ul className="space-y-3 text-sm">
        {devs.map((dev) => (
          <li
            key={dev.id}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{formatRelativeMinutes(dev.locationUpdatedAt)}</span>
              <span>{repoById.get(dev.repoId)?.name ?? dev.repoId}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{dev.name}</p>
            <p className="text-xs text-slate-500">{dev.message}</p>
            <p className="mt-1 text-sm text-slate-700">
              {dev.file}
              {taskById.get(dev.taskId)
                ? ` • ${taskById.get(dev.taskId)?.title}`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
