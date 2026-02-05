// components/pm/ui/Pill.tsx
// Tiny badge/pill used for tags like "Root", "Module", etc.

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
      {children}
    </span>
  );
}
