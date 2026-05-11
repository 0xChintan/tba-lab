"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import { useTBAAddress } from "@/features/tba-lab/hooks/useTBAAddress";
import { isSupportedChainId } from "@/lib/chains";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";
import { TxButton, TxResult, CalldataPreview } from "@/components/ui";

const source = `// Preview the deploy tx without sending:
const prepared = await client.prepareCreateAccount({
  tokenContract,
  tokenId,
  salt,
})
// Or send it:
const { account, txHash } = await client.createAccount({
  tokenContract,
  tokenId,
  salt,
})`;

type Prepared = { to: `0x${string}`; value: bigint; data: `0x${string}` } | null;

export function CreateAccountPanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { config } = useTBAConfig();
  const { tba, ready } = useTBAAddress();
  const { isConnected } = useAccount();

  const [prepared, setPrepared] = useState<Prepared>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [account, setAccount] = useState<`0x${string}` | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<"preview" | "deploy" | null>(null);

  async function preview() {
    // Second click hides the calldata.
    if (prepared) {
      setPrepared(null);
      return;
    }
    if (!client || !ready) return;
    setBusy("preview");
    setErr(null);
    try {
      const result = await client.prepareCreateAccount({
        tokenContract: config.tokenContract as `0x${string}`,
        tokenId: config.tokenId,
        salt: config.salt,
      });
      setPrepared(result as Prepared);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function deploy() {
    if (!client || !ready) return;
    setBusy("deploy");
    setErr(null);
    setHash(null);
    try {
      const result = await client.createAccount({
        tokenContract: config.tokenContract as `0x${string}`,
        tokenId: config.tokenId,
        salt: config.salt,
      });
      setHash(result.txHash);
      setAccount(result.account);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <PanelShell
      title="Deploy TBA"
      method="client.createAccount + prepareCreateAccount"
      description="Preview the deploy calldata, or send the transaction. The deployed address always equals getAccount(...) — it's deterministic."
      docsHref={DOCS.methods}
      source={source}
    >
      {!isConnected ? (
        <StatusBadge tone="warn">connect a wallet</StatusBadge>
      ) : !ready ? (
        <StatusBadge tone="muted">awaiting inputs</StatusBadge>
      ) : (
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-zinc-500">deploying to: </span>
            <Mono>{tba}</Mono>
          </div>
          <div className="flex gap-2 flex-wrap">
            <TxButton onClick={preview} loading={busy === "preview"} variant="secondary">
              {prepared ? "Hide preview" : "Preview (prepareCreateAccount)"}
            </TxButton>
            <TxButton onClick={deploy} loading={busy === "deploy"}>
              Deploy (createAccount)
            </TxButton>
          </div>
          <CalldataPreview prepared={prepared} />
          {account && hash ? (
            <div className="text-sm">
              <span className="text-zinc-500">account: </span>
              <Mono>{account}</Mono>
            </div>
          ) : null}
          <TxResult hash={hash} error={err} />
        </div>
      )}
    </PanelShell>
  );
}
