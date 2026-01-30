import { Card } from "@/components/ui/Card";
import type { ActivityItem } from "@/data/dev/dashboardData";

type RepoActivityListProps = {
  items: ActivityItem[];
};

export function RepoActivityList({ items }: RepoActivityListProps) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Latest activity
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No recent pushes or deployments here yet.
        </p>
      ) : (
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border px-4 py-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{item.type}</span>
                <span>{item.branch}</span>
              </div>
              <p className="font-semibold text-slate-900">{item.summary}</p>
              <p className="text-slate-600">
                {item.user} · {item.file}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
