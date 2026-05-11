"use client";

import { useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { isSupportedChainId, type SupportedChainId } from "@/lib/chains";
import { CONTRACTS, contractsDeployed } from "@/lib/contracts";
import { adventurerNFTAbi, goldAbi, itemsAbi } from "@/lib/abis";
import { PanelShell, StatusBadge, Mono, TxButton, TxResult } from "@/components/ui";

export function SetupPanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { isConnected, address } = useAccount();
  const deployed = supported && contractsDeployed(chainId as SupportedChainId);
  const c = supported && deployed ? CONTRACTS[chainId as SupportedChainId] : null;

  const { writeContractAsync } = useWriteContract();
  const [busy, setBusy] = useState<"nft" | "gold" | "items" | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function mintNFT() {
    if (!c || !address) return;
    setBusy("nft"); setErr(null); setHash(null);
    try {
      const txHash = await writeContractAsync({
        abi: adventurerNFTAbi,
        address: c.adventurerNFT,
        functionName: "mint",
      });
      setHash(txHash);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally { setBusy(null); }
  }

  async function claimGold() {
    if (!c) return;
    setBusy("gold"); setErr(null); setHash(null);
    try {
      const txHash = await writeContractAsync({
        abi: goldAbi, address: c.gold, functionName: "faucet",
      });
      setHash(txHash);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally { setBusy(null); }
  }

  async function mintItems() {
    if (!c) return;
    setBusy("items"); setErr(null); setHash(null);
    try {
      const txHash = await writeContractAsync({
        abi: itemsAbi, address: c.items, functionName: "mint", args: [1n, 10n],
      });
      setHash(txHash);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally { setBusy(null); }
  }

  return (
    <PanelShell
      title="Setup helpers — mint test assets"
      method="(not an SDK call — wagmi useWriteContract on the companion contracts)"
      description="Mint an AdventurerNFT, claim Gold, and mint Items so you actually have something to play with."
    >
      {!isConnected ? (
        <StatusBadge tone="warn">connect a wallet</StatusBadge>
      ) : !deployed || !c ? (
        <StatusBadge tone="warn">
          companion contracts not deployed — run forge script + update contracts.ts
        </StatusBadge>
      ) : (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <Action title="AdventurerNFT" address={c.adventurerNFT}>
              <TxButton onClick={mintNFT} loading={busy === "nft"}>Mint NFT</TxButton>
            </Action>
            <Action title="Gold (ERC-20)" address={c.gold}>
              <TxButton onClick={claimGold} loading={busy === "gold"}>Claim 1000 GOLD</TxButton>
            </Action>
            <Action title="Items (ERC-1155)" address={c.items}>
              <TxButton onClick={mintItems} loading={busy === "items"}>
                Mint 10× id 1
              </TxButton>
            </Action>
          </div>
          <TxResult hash={hash} error={err} />
          {hash ? (
            <div className="text-xs text-zinc-500">
              Once the tx confirms, your new AdventurerNFT will appear in the picker
              above (it polls on-chain every 15s).
            </div>
          ) : null}
        </div>
      )}
    </PanelShell>
  );
}

function Action({
  title,
  address,
  children,
}: {
  title: string;
  address: `0x${string}`;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-3 space-y-2">
      <div className="text-sm font-medium">{title}</div>
      <Mono className="block text-xs text-zinc-500">
        {address.slice(0, 10)}…{address.slice(-6)}
      </Mono>
      {children}
    </div>
  );
}
