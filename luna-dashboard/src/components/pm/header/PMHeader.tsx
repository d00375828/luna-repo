// components/pm/header/PMHeader.tsx
// Dashboard header: brand, search input, connect button.
// Keeps only UI + events. No GitHub logic is placed here.

export default function PMHeader({
  query,
  onQueryChange,
  onConnectGitHub,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onConnectGitHub: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#080a1f]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-semibold text-white shadow-[0_0_32px_rgba(147,51,234,0.45)]">
            L
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-white">Luna</div>
            <div className="text-xs text-white/60">Code Visualization</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-[320px] sm:w-[360px]">
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search codebase..."
              className="w-full rounded-2xl border border-purple-400/20 bg-[#1a1233]/70 px-4 py-2 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/10"
            />
          </div>

          <button
            onClick={onConnectGitHub}
            className="rounded-2xl border border-purple-400/30 bg-purple-500/15 px-4 py-2 text-sm text-white/90 hover:bg-purple-500/20"
          >
            Connected
          </button>
        </div>
      </div>
    </header>
  );
}
