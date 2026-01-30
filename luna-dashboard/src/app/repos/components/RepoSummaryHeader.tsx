import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { DevRepo } from "@/data/dev/dashboardData";

type RepoSummaryHeaderProps = {
  repo: DevRepo;
};

export function RepoSummaryHeader({ repo }: RepoSummaryHeaderProps) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        Repository
      </p>
      <h1 className="text-3xl font-semibold text-slate-900">{repo.name}</h1>
      <p className="mt-1 text-slate-600">{repo.description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Badge label={`Default branch: ${repo.defaultBranch}`} />
        <Badge label={`Owner: ${repo.owner}`} />
        <Badge label={`${repo.pushesThisWeek} pushes this week`} />
        <Badge
          label={repo.status === "healthy" ? "On track" : "Needs attention"}
          tone={repo.status === "healthy" ? "success" : "warning"}
        />
      </div>
    </Card>
  );
}
