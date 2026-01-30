import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export function Card({ children, className, as: Component = "section" }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl border bg-white/80 p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </Component>
  );
}
