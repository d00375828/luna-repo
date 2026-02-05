// components/pm/ui/IconButton.tsx
// Minimal icon button used for zoom controls.

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white/15"
    >
      {children}
    </button>
  );
}
