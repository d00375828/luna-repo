import type { ActivityItem } from "@/data/dev/dashboardData";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatRelativeMinutes } from "@/lib/time";

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card id="activity">
      <SectionHeader eyebrow="Activity" title="Latest pushes & events">
        <button className="text-sm text-slate-500 hover:text-slate-800">
          Filter
        </button>
      </SectionHeader>

      <ul className="space-y-4 text-sm">
        {items.map((item) => (
          <li key={item.id} className="space-y-1 rounded-lg border p-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              <span>{item.type}</span>
              <span>{formatRelativeMinutes(item.timestamp)}</span>
            </div>
            <p className="font-semibold text-slate-900">{item.summary}</p>
            <p className="text-slate-600">
              {item.user} · {item.branch} · {item.file}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
