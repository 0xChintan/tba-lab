"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAAddress } from "@/features/tba-lab/hooks/useTBAAddress";
import { isSupportedChainId, type SupportedChainId } from "@/lib/chains";
import { CONTRACTS, contractsDeployed, GOLD_DECIMALS } from "@/lib/contracts";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";
import { TxButton, TxResult, Input } from "@/components/ui";

const source = `const txHash = await client.transferERC20({
  account: tba,
  amount: 10,            // human-readable, scaled by erc20tokenDecimals
  erc20tokenAddress:  gold,
  erc20tokenDecimals: 18,
  recipientAddress,
})`;

export function TransferERC20Panel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { tba, ready } = useTBAAddress();
  const { address, isConnected } = useAccount();

  const goldAddr =
    supported && contractsDeployed(chainId as SupportedChainId)
      ? CONTRACTS[chainId as SupportedChainId].gold
      : null;

  const [tokenAddr, setTokenAddr] = useState<string>("");
  const [decimals, setDecimals] = useState("18");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("10");
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const effectiveToken = (
    isAddress(tokenAddr) ? tokenAddr : goldAddr || ""
  ) as `0x${string}` | "";
  const recipientToUse = (isAddress(recipient) ? recipient : address) as
    | `0x${string}`
    | undefined;
  const validAmount = Number(amount) > 0;
  const validDecimals = /^[0-9]+$/.test(decimals);

  async function send() {
    if (!client || !tba || !recipientToUse || !effectiveToken) return;
    setBusy(true);
    setErr(null);
    setHash(null);
    try {
      const txHash = await client.transferERC20({
        account: tba,
        amount: Number(amount),
        erc20tokenAddress: effectiveToken,
        erc20tokenDecimals: Number(decimals),
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
      title="Transfer ERC-20 from TBA"
      method="client.transferERC20(...)"
      description="Sends any ERC-20 the TBA holds. Pre-fills our Gold token when companion contracts are deployed."
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
            label="erc20tokenAddress"
            placeholder={goldAddr ? `defaults to Gold (${goldAddr.slice(0, 6)}…)` : "0x…"}
            value={tokenAddr}
            onChange={(e) => setTokenAddr(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="decimals"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              hint={`Gold = ${GOLD_DECIMALS}`}
            />
            <Input
              label="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              hint="human units"
            />
          </div>
          <Input
            label="recipientAddress"
            placeholder={`defaults to connected wallet (${address?.slice(0, 6)}…)`}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <TxButton
            onClick={send}
            loading={busy}
            disabled={!validAmount || !validDecimals || !recipientToUse || !effectiveToken}
          >
            Send ERC-20
          </TxButton>
          <TxResult hash={hash} error={err} hint="TBA must hold the ERC-20 first." />
        </div>
      )}
    </PanelShell>
  );
}
