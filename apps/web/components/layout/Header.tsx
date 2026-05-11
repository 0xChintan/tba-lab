"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { DOCS } from "@/lib/docs";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/viem", label: "viem lab" },
  { href: "/ethers", label: "ethers v6 lab" },
  { href: "/compare", label: "Compare" },
];

const EXTERNAL = [
  { href: DOCS.tokenboundHome, label: "Tokenbound docs" },
  { href: DOCS.eip6551, label: "EIP-6551" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="font-semibold tracking-tight shrink-0">
            TBA <span className="text-emerald-500">Lab</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-3 py-1.5 rounded-md transition-colors shrink-0",
                  pathname === item.href
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50",
                )}
              >
                {item.label}
              </Link>
            ))}
            <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" aria-hidden />
            {EXTERNAL.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-md text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
              >
                {item.label} <span aria-hidden>↗</span>
              </a>
            ))}
          </nav>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>
    </header>
  );
}
