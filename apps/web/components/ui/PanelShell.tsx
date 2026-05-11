"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

type Props = {
  title: string;
  method: string;
  description: string;
  source?: string;
  /** Optional link to the relevant docs page (e.g. Tokenbound SDK or an EIP). */
  docsHref?: string;
  children: ReactNode;
  className?: string;
};

export function PanelShell({
  title,
  method,
  description,
  source,
  docsHref,
  children,
  className,
}: Props) {
  const [showSource, setShowSource] = useState(false);
  return (
    <section
      className={clsx(
        "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
        className,
      )}
    >
      <header className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <p className="text-xs text-zinc-500 mt-0.5 font-mono break-all">{method}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5">{description}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {docsHref ? (
            <a
              href={docsHref}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              docs ↗
            </a>
          ) : null}
          {source ? (
            <button
              type="button"
              onClick={() => setShowSource((s) => !s)}
              className="text-xs px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              {showSource ? "hide source" : "show source"}
            </button>
          ) : null}
        </div>
      </header>
      {showSource && source ? (
        <pre className="px-5 py-3 text-xs font-mono overflow-x-auto bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
          {source}
        </pre>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}
