"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAAddress } from "@/features/tba-lab/hooks/useTBAAddress";
import { isSupportedChainId } from "@/lib/chains";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";
import { TxButton, TxResult, Input } from "@/components/ui";

const source = `const txHash = await client.transferETH({
  account: tba,
  amount: 0.001,          // human-readable, not wei
  recipientAddress,
})`;

export function TransferETHPanel() {
  const { client } = useTBAClient();
  const { tba, ready } = useTBAAddress();
  const { address, isConnected } = useAccount();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const recipientToUse = (isAddress(recipient) ? recipient : address) as
    | `0x${string}`
    | undefined;
  const validAmount = Number(amount) > 0;

  async function send() {
    if (!client || !tba || !recipientToUse) return;
    setBusy(true);
    setErr(null);
    setHash(null);
    try {
      const txHash = await client.transferETH({
        account: tba,
        amount: Number(amount),
        recipientAddress: recipientToUse,
      });
      setHash(txHash);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PanelShell
      title="Transfer ETH from TBA"
      method="client.transferETH({ account, amount, recipientAddress })"
      description="Sends native ETH out of the TBA. `amount` is in ETH units, not wei."
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
            <span className="text-zinc-500">from TBA: </span><Mono>{tba}</Mono>
          </div>
          <Input
            label="recipientAddress"
            placeholder={`defaults to connected wallet (${address?.slice(0, 6)}…)`}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <Input
            label="amount (ETH)"
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TxButton onClick={send} loading={busy} disabled={!validAmount || !recipientToUse}>
            Send ETH
          </TxButton>
          <TxResult hash={hash} error={err} hint="TBA must hold ETH first." />
        </div>
      )}
    </PanelShell>
  );
}
