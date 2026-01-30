import Link from "next/link";

type SidebarNavProps = {
  devMode: boolean;
};

const NAV_LINKS = [
  { label: "Overview", href: "#", active: true },
  { label: "Repositories", href: "/repos/luna-dashboard" },
  { label: "Activity Feed", href: "#activity" },
  { label: "Tasks", href: "#tasks" },
  { label: "Mind Map", href: "#mind-map" },
];

export function SidebarNav({ devMode }: SidebarNavProps) {
  return (
    <aside className="h-fit rounded-2xl border bg-white/70 p-5 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Navigation
      </p>
      <nav className="space-y-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              link.active
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-xl border border-dashed bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold">Dev Mode</p>
        <p>
          {devMode
            ? "Auth + Supabase reads are bypassed while we iterate on UI."
            : "Auth enforced. Flip NEXT_PUBLIC_DEV_BYPASS_AUTH=true to edit safely."}
        </p>
      </div>
    </aside>
  );
}
