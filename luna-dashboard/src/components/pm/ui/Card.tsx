// components/pm/ui/Card.tsx
// Small Card primitive to keep UI consistent.
// All dashboard sections should use this instead of re-typing classNames everywhere.

import React from "react";

export function Card({
  title,
  right,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
        "shadow-[0_18px_55px_rgba(0,0,0,0.35)]",
        className,
      ].join(" ")}
    >
      {(title || right) && (
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div>{right}</div>
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
