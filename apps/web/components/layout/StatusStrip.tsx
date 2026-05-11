"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  CHAIN_LABEL,
  isSupportedChainId,
  type SupportedChainId,
} from "@/lib/chains";
import { contractsDeployed } from "@/lib/contracts";
import { StatusBadge, Mono } from "@/components/ui";

/**
 * Shows the user, at a glance, whether they're ready to start the lab:
 * wallet connected, on a supported chain, has ETH, contracts available.
 */
export function StatusStrip() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { data: balance } = useBalance({ address });

  const hasETH = balance ? balance.value > 0n : false;
  const contractsOk = supported && contractsDeployed(chainId as SupportedChainId);

  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
      {/* <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Setup checklist
        </h2>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div> */}
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <Item ok={isConnected} label="Wallet connected">
          {isConnected ? (
            <Mono className="text-xs">
              {address?.slice(0, 6)}…{address?.slice(-4)}
            </Mono>
          ) : (
            <span className="text-xs text-zinc-500">click Connect →</span>
          )}
        </Item>
        <Item ok={supported} label="On a supported chain">
          {supported ? (
            <span className="text-xs">
              {CHAIN_LABEL[chainId as SupportedChainId]}
            </span>
          ) : (
            <span className="text-xs text-zinc-500">
              switch to Sepolia or Base Sepolia
            </span>
          )}
        </Item>
        <Item ok={hasETH} label="Has gas">
          {balance ? (
            <span className="text-xs">
              {(Number(balance.value) / 1e18).toFixed(4)} {balance.symbol}
            </span>
          ) : (
            <span className="text-xs text-zinc-500">need testnet ETH</span>
          )}
        </Item>
        <Item ok={contractsOk} label="Companion contracts">
          {contractsOk ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              deployed
            </span>
          ) : (
            <span className="text-xs text-zinc-500">
              update lib/contracts.ts
            </span>
          )}
        </Item>
      </ul>
    </section>
  );
}

function Item({
  ok,
  label,
  children,
}: {
  ok: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
        <StatusBadge tone={ok ? "ok" : "muted"}>
          {ok ? "ready" : "pending"}
        </StatusBadge>
      </div>
      <div>{children}</div>
    </li>
  );
}
