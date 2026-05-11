"use client";

import { useChainId } from "wagmi";
import { EXPLORER_TX, isSupportedChainId, type SupportedChainId } from "@/lib/chains";
import { StatusBadge } from "./StatusBadge";
import { Mono } from "./Mono";

export function TxResult({
  hash,
  error,
  hint,
}: {
  hash?: `0x${string}` | null;
  error?: string | null;
  hint?: string;
}) {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);

  if (error) {
    return (
      <div className="space-y-1">
        <StatusBadge tone="error">tx failed</StatusBadge>
        <pre className="text-xs font-mono text-red-500 whitespace-pre-wrap">
          {error}
        </pre>
      </div>
    );
  }
  if (hash) {
    return (
      <div className="space-y-1">
        <StatusBadge tone="ok">submitted</StatusBadge>
        <div className="text-sm">
          <Mono>{hash}</Mono>
        </div>
        {supported ? (
          <a
            href={EXPLORER_TX[chainId as SupportedChainId](hash)}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View on explorer ↗
          </a>
        ) : null}
      </div>
    );
  }
  if (hint) return <div className="text-xs text-zinc-500">{hint}</div>;
  return null;
}
