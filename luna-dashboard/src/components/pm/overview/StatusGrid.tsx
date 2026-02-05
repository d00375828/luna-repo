type StatusTile = {
  title: string;
  value: string;
  delta?: string;
  tone: string;
  caption: string;
};

export function StatusGrid({ items }: { items: StatusTile[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_12px_35px_rgba(5,6,21,0.45)]"
        >
          <div className="text-xs uppercase tracking-wide text-white/50">
            {item.title}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-semibold">{item.value}</div>
            {item.delta && (
              <span className={`text-xs ${item.tone}`}>{item.delta}</span>
            )}
          </div>
          <div className="mt-1 text-sm text-white/60">{item.caption}</div>
        </div>
      ))}
    </div>
  );
}
