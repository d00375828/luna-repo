import { Card } from "@/components/pm/ui/Card";
import type { BranchSummary, BranchStatus } from "@/lib/pm/mockBranches";

const statusCopy: Record<BranchStatus, { label: string; tone: string }> = {
  active: { label: "Active", tone: "text-emerald-300 bg-emerald-300/10" },
  idle: { label: "Idle", tone: "text-amber-200 bg-amber-200/10" },
  archived: { label: "Archived", tone: "text-white/70 bg-white/10" },
};

function Avatar({ text }: { text: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 text-xs font-semibold text-white/80">
      {text}
    </div>
  );
}

export function BranchList({ branches }: { branches: BranchSummary[] }) {
  return (
    <Card
      title="Active Branches"
      right={
        <button className="rounded-2xl border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10">
          View GitHub
        </button>
      }
      className="bg-gradient-to-b from-[#0c0f2a] to-[#0b0d24]"
    >
      <div className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
        {branches.map((branch) => {
          const status = statusCopy[branch.status];
          return (
            <div
              key={branch.name}
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/15 p-3"
            >
              <Avatar text={branch.owner.avatar} />
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-white">
                  <span className="font-semibold">{branch.name}</span>
                  <span className="text-xs text-white/50">·</span>
                  <span className="text-xs text-white/60">{branch.owner.name}</span>
                </div>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <span>{branch.createdAgo}</span>
                <span className="text-white/30">•</span>
                <span>{branch.commits} commits</span>
              </div>
              </div>
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium",
                  status.tone,
                ].join(" ")}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
