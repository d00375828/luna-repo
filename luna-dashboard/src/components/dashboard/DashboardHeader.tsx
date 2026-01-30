type DashboardHeaderProps = {
  openTasks: number;
  totalTasks: number;
  repoCount: number;
};

export function DashboardHeader({
  openTasks,
  totalTasks,
  repoCount,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Luna PM Lab
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Product Management Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          {openTasks} open tasks · {totalTasks} total · {repoCount} repos
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-full border bg-white/80 px-4 py-2 text-sm">
          Export Snapshot
        </button>
        <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
          Share Live View
        </button>
      </div>
    </header>
  );
}
