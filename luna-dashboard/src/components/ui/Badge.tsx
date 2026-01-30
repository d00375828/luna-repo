import { cn } from "@/lib/cn";

type BadgeProps = {
  label: string;
  tone?: "default" | "success" | "warning";
};

export function Badge({ label, tone = "default" }: BadgeProps) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-200 text-slate-700";

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        toneClass,
      )}
    >
      {label}
    </span>
  );
}
