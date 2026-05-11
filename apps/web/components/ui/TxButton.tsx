"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export function TxButton({
  onClick,
  loading,
  disabled,
  variant = "primary",
  children,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={clsx(
        "text-xs px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
          : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800",
      )}
    >
      {loading ? "…" : children}
    </button>
  );
}
