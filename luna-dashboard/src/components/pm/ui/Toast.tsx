// components/pm/ui/Toast.tsx
// Lightweight toast. We keep it local to the dashboard (no global state yet).

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-2xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/90 backdrop-blur">
      {message}
    </div>
  );
}
