import Link from "next/link";

import type { DevRepo, DevTask } from "@/data/dev/dashboardData";
import { Card } from "@/components/ui/Card";

type TaskDetailsProps = {
  task: DevTask | null;
  repo: DevRepo | null;
  branchName: string | null;
};

export function TaskDetails({ task, repo, branchName }: TaskDetailsProps) {
  if (!task) {
    return (
      <Card className="text-sm text-slate-600">
        Select a task to see branch + file recommendations.
      </Card>
    );
  }

  return (
    <Card>
      <header className="mb-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Selected task
        </p>
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-sm text-slate-600">{task.summary}</p>
      </header>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Suggested branch
          </p>
          {branchName ? (
            <code className="mt-1 block rounded-lg bg-slate-900 px-3 py-2 text-xs text-white">
              git checkout -b {branchName}
            </code>
          ) : (
            <p className="text-slate-600">Select a task to generate branch.</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Target repo
          </p>
          {repo ? (
            <Link
              className="text-sm font-semibold text-indigo-600"
              href={`/repos/${repo.slug}`}
            >
              {repo.name}
            </Link>
          ) : (
            <p className="text-sm text-slate-600">Unknown repo</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Files to touch
          </p>
          {task.files.length === 0 ? (
            <p className="text-sm text-slate-600">Assign files before kickoff.</p>
          ) : (
            <ul className="mt-1 space-y-2 text-sm">
              {task.files.map((file) => (
                <li
                  key={file}
                  className="rounded-lg border border-dashed px-3 py-2 font-mono text-xs text-slate-600"
                >
                  {file}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}
