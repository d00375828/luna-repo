import Link from "next/link";
import { notFound } from "next/navigation";

import {
  devDashboardData,
  getRepoBySlug,
} from "@/data/dev/dashboardData";
import { RepoSummaryHeader } from "../components/RepoSummaryHeader";
import { RepoTaskList } from "../components/RepoTaskList";
import { RepoActivityList } from "../components/RepoActivityList";
import { RepoFileList } from "../components/RepoFileList";

export default function RepoPage({
  params,
}: {
  params: { repoId: string };
}) {
  const repo = getRepoBySlug(params.repoId);
  if (!repo) {
    notFound();
  }

  const repoTasks = devDashboardData.tasks.filter(
    (task) => task.repoId === repo.id,
  );
  const repoActivity = devDashboardData.activity.filter(
    (item) => item.repoId === repo.id,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/" className="text-sm text-slate-500">
          ← Back to dashboard
        </Link>

        <RepoSummaryHeader repo={repo} />

        <section className="grid gap-6 lg:grid-cols-2">
          <RepoTaskList tasks={repoTasks} />
          <RepoActivityList items={repoActivity} />
        </section>

        <RepoFileList repo={repo} />
      </div>
    </main>
  );
}
