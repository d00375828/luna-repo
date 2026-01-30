import Link from "next/link";

import type { DevRepo } from "@/data/dev/dashboardData";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

type RepoSnapshotProps = {
  repos: DevRepo[];
};

export function RepoSnapshot({ repos }: RepoSnapshotProps) {
  return (
    <Card>
      <SectionHeader eyebrow="Repositories" title="Active surfaces">
        <Link className="text-sm text-indigo-600" href="/repos/luna-dashboard">
          View all
        </Link>
      </SectionHeader>

      <div className="space-y-4">
        {repos.map((repo) => (
          <Link
            key={repo.id}
            href={`/repos/${repo.slug}`}
            className="block rounded-xl border bg-slate-50/70 px-4 py-3 hover:border-indigo-400"
          >
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold text-slate-900">{repo.name}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  repo.status === "healthy"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {repo.status === "healthy" ? "On track" : "Needs attention"}
              </span>
            </div>
            <p className="text-xs text-slate-600">{repo.description}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
