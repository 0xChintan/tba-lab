"use client";

import clsx from "clsx";

export function Input({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
        {label}
        {hint ? (
          <span className="text-zinc-500 font-normal ml-1">— {hint}</span>
        ) : null}
      </label>
      <input
        {...props}
        className={clsx(
          "w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
          props.className,
        )}
      />
    </div>
  );
}
