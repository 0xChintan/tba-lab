"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { encodeFunctionData } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAAddress } from "@/features/tba-lab/hooks/useTBAAddress";
import { isSupportedChainId } from "@/lib/chains";
import { CONTRACTS, contractsDeployed } from "@/lib/contracts";
import { questAbi } from "@/lib/abis";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";
import { TxButton, TxResult, CalldataPreview, Input } from "@/components/ui";
import type { SupportedChainId } from "@/lib/chains";

const source = `// Encode the inner call:
const data = encodeFunctionData({
  abi: questAbi,
  functionName: 'recordQuest',
  args: [questId],
})
// Preview (no signature):
const prep = await client.prepareExecution({ account: tba, to: quest, value: 0n, data })
// Execute (signed by the TBA's NFT owner):
const txHash = await client.execute({ account: tba, to: quest, value: 0n, data })`;

export function ExecutePanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { tba, ready } = useTBAAddress();
  const { isConnected } = useAccount();

  const questAddr =
    supported && contractsDeployed(chainId as SupportedChainId)
      ? CONTRACTS[chainId as SupportedChainId].quest
      : null;

  const [questId, setQuestId] = useState("42");
  const [prepared, setPrepared] = useState<
    { to: `0x${string}`; value: bigint; data: `0x${string}` } | null
  >(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<"preview" | "execute" | null>(null);

  const validQuest = /^[0-9]+$/.test(questId);

  function buildCall() {
    if (!questAddr || !tba) return null;
    const data = encodeFunctionData({
      abi: questAbi,
      functionName: "recordQuest",
      args: [BigInt(questId)],
    });
    return { account: tba, to: questAddr, value: 0n, data };
  }

  async function preview() {
    // Second click hides the calldata.
    if (prepared) {
      setPrepared(null);
      return;
    }
    const call = buildCall();
    if (!client || !call) return;
    setBusy("preview");
    setErr(null);
    try {
      const result = await client.prepareExecution(call);
      setPrepared(result as never);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function execute() {
    const call = buildCall();
    if (!client || !call) return;
    setBusy("execute");
    setErr(null);
    setHash(null);
    try {
      const txHash = await client.execute(call);
      setHash(txHash);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <PanelShell
      title="Execute call from TBA"
      method="client.execute + prepareExecution"
      description="Send a call from inside the TBA. We target Quest.recordQuest — msg.sender on the Quest contract will equal the TBA."
      docsHref={DOCS.methods}
      source={source}
    >
      {!isConnected ? (
        <StatusBadge tone="warn">connect a wallet</StatusBadge>
      ) : !ready ? (
        <StatusBadge tone="muted">awaiting inputs</StatusBadge>
      ) : !questAddr ? (
        <StatusBadge tone="warn">Quest contract not deployed — populate contracts.ts</StatusBadge>
      ) : (
        <div className="space-y-3">
          <div className="text-sm space-y-1">
            <div><span className="text-zinc-500">from TBA: </span><Mono>{tba}</Mono></div>
            <div><span className="text-zinc-500">to Quest: </span><Mono>{questAddr}</Mono></div>
          </div>
          <Input
            label="questId"
            value={questId}
            onChange={(e) => setQuestId(e.target.value)}
            inputMode="numeric"
          />
          <div className="flex gap-2 flex-wrap">
            <TxButton
              onClick={preview}
              loading={busy === "preview"}
              disabled={!validQuest && !prepared}
              variant="secondary"
            >
              {prepared ? "Hide preview" : "Preview (prepareExecution)"}
            </TxButton>
            <TxButton
              onClick={execute}
              loading={busy === "execute"}
              disabled={!validQuest}
            >
              Execute
            </TxButton>
          </div>
          <CalldataPreview prepared={prepared} />
          <TxResult hash={hash} error={err} />
        </div>
      )}
    </PanelShell>
  );
}
