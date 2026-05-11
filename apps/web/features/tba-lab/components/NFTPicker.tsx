"use client";

import { useChainId } from "wagmi";
import { isAddress } from "viem";
import clsx from "clsx";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import { useOwnedAdventurerTBAs } from "@/features/tba-lab/hooks/useOwnedAdventurerTBAs";
import { CONTRACTS, contractsDeployed } from "@/lib/contracts";
import { isSupportedChainId, type SupportedChainId } from "@/lib/chains";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";

export function NFTPicker() {
  const chainId = useChainId();
  const { config, setConfig } = useTBAConfig();
  const supported = isSupportedChainId(chainId);
  const deployed = supported && contractsDeployed(chainId as SupportedChainId);
  const adventurerAddr = supported
    ? CONTRACTS[chainId as SupportedChainId].adventurerNFT
    : undefined;

  const { tbas, loading: loadingOwned } = useOwnedAdventurerTBAs();

  const validContract =
    config.tokenContract === "" || isAddress(config.tokenContract);
  const validTokenId =
    config.tokenId === "" || /^[0-9]+$/.test(config.tokenId);

  function selectAdventurer(tokenId: number) {
    if (!adventurerAddr) return;
    setConfig({ tokenContract: adventurerAddr, tokenId: String(tokenId) });
  }

  const activeAdventurerTokenId =
    adventurerAddr &&
    config.tokenContract.toLowerCase() === adventurerAddr.toLowerCase()
      ? config.tokenId
      : null;

  return (
    <PanelShell
      title="Owner NFT"
      method="(tokenContract, tokenId) — input for every other panel"
      description="The NFT whose owner is the rightful operator of the TBA. Every SDK call below derives from this pair."
    >
      {adventurerAddr ? (
        <div className="mb-4 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Your AdventurerNFTs on this chain
              </div>
              <div className="text-[11px] text-zinc-500">
                The connected wallet&apos;s holdings — discovered live on-chain.
              </div>
            </div>
            {loadingOwned ? (
              <StatusBadge tone="muted">scanning…</StatusBadge>
            ) : tbas.length === 0 ? (
              <StatusBadge tone="muted">none yet — mint one below</StatusBadge>
            ) : (
              <StatusBadge tone="ok">{tbas.length} owned</StatusBadge>
            )}
          </div>
          {tbas.length > 0 ? (
            <ul className="space-y-1.5">
              {tbas.map((t) => {
                const active = String(t.tokenId) === activeAdventurerTokenId;
                return (
                  <li key={t.tokenId}>
                    <button
                      type="button"
                      onClick={() => selectAdventurer(t.tokenId)}
                      className={clsx(
                        "w-full text-left rounded-md border px-3 py-2 flex items-center gap-3 transition-colors",
                        active
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/60",
                      )}
                    >
                      <span
                        className={clsx(
                          "shrink-0 inline-flex w-9 h-7 items-center justify-center rounded text-xs font-semibold",
                          active
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
                        )}
                      >
                        #{t.tokenId}
                      </span>
                      <Mono className="flex-1 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                        {t.tbaAddress}
                      </Mono>
                      {t.checking ? (
                        <StatusBadge tone="muted">checking…</StatusBadge>
                      ) : t.deployed ? (
                        <StatusBadge tone="ok">deployed</StatusBadge>
                      ) : (
                        <StatusBadge tone="muted">fresh</StatusBadge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            tokenContract
          </label>
          <input
            type="text"
            placeholder="0x…"
            value={config.tokenContract}
            onChange={(e) =>
              setConfig({ tokenContract: e.target.value as `0x${string}` })
            }
            className={
              inputCls + (validContract ? "" : " border-red-500 focus:ring-red-500/50")
            }
          />
          {deployed && adventurerAddr ? (
            <button
              type="button"
              onClick={() => setConfig({ tokenContract: adventurerAddr })}
              className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Use deployed AdventurerNFT ({adventurerAddr.slice(0, 6)}…
              {adventurerAddr.slice(-4)})
            </button>
          ) : (
            <p className="mt-2 text-xs text-zinc-500">
              Deploy companion contracts and update{" "}
              <code className="font-mono">lib/contracts.ts</code> to enable the preset.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            tokenId
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={config.tokenId}
            onChange={(e) => setConfig({ tokenId: e.target.value })}
            className={
              inputCls + (validTokenId ? "" : " border-red-500 focus:ring-red-500/50")
            }
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {!validContract ? (
          <StatusBadge tone="error">tokenContract is not a valid address</StatusBadge>
        ) : null}
        {!validTokenId ? (
          <StatusBadge tone="error">tokenId must be a non-negative integer</StatusBadge>
        ) : null}
        {validContract && validTokenId && config.tokenContract && config.tokenId ? (
          <StatusBadge tone="ok">ready</StatusBadge>
        ) : (
          <StatusBadge tone="muted">awaiting inputs</StatusBadge>
        )}
      </div>
    </PanelShell>
  );
}

const inputCls =
  "w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50";
