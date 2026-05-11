"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export function Mono({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <code className={clsx("font-mono text-sm break-all", className)}>{children}</code>
  );
}
