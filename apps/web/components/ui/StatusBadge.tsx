"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export type StatusTone = "ok" | "warn" | "error" | "muted";

export function StatusBadge({
  tone,
  children,
}: {
  tone: StatusTone;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium",
        tone === "ok" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        tone === "warn" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        tone === "error" && "bg-red-500/10 text-red-600 dark:text-red-400",
        tone === "muted" && "bg-zinc-500/10 text-zinc-500",
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full",
          tone === "ok" && "bg-emerald-500",
          tone === "warn" && "bg-amber-500",
          tone === "error" && "bg-red-500",
          tone === "muted" && "bg-zinc-400",
        )}
      />
      {children}
    </span>
  );
}
