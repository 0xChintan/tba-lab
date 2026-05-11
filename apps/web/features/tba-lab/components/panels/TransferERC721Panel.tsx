"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAAddress } from "@/features/tba-lab/hooks/useTBAAddress";
import { isSupportedChainId, type SupportedChainId } from "@/lib/chains";
import { CONTRACTS, contractsDeployed } from "@/lib/contracts";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";
import { TxButton, TxResult, Input } from "@/components/ui";

const source = `const txHash = await client.transferNFT({
  account: tba,
  tokenType: 'ERC721',
  tokenContract,
  tokenId,
  recipientAddress,
})`;

export function TransferERC721Panel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { tba, ready } = useTBAAddress();
  const { address, isConnected } = useAccount();

  const advAddr =
    supported && contractsDeployed(chainId as SupportedChainId)
      ? CONTRACTS[chainId as SupportedChainId].adventurerNFT
      : null;

  const [tokenContract, setTokenContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const effectiveContract = (
    isAddress(tokenContract) ? tokenContract : advAddr || ""
  ) as `0x${string}` | "";
  const recipientToUse = (isAddress(recipient) ? recipient : address) as
    | `0x${string}`
    | undefined;
  const validId = /^[0-9]+$/.test(tokenId);

  async function send() {
    if (!client || !tba || !recipientToUse || !effectiveContract || !validId) return;
    setBusy(true);
    setErr(null);
    setHash(null);
    try {
      const txHash = await client.transferNFT({
        account: tba,
        tokenType: "ERC721",
        tokenContract: effectiveContract,
        tokenId,
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
      title="Transfer ERC-721 from TBA"
      method="client.transferNFT({ tokenType: 'ERC721', ... })"
      description="Send a specific ERC-721 the TBA holds to a recipient."
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
            label="tokenContract"
            placeholder={advAddr ? `defaults to Adventurer (${advAddr.slice(0, 6)}…)` : "0x…"}
            value={tokenContract}
            onChange={(e) => setTokenContract(e.target.value)}
          />
          <Input
            label="tokenId"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            inputMode="numeric"
          />
          <Input
            label="recipientAddress"
            placeholder={`defaults to connected wallet (${address?.slice(0, 6)}…)`}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <TxButton
            onClick={send}
            loading={busy}
            disabled={!validId || !recipientToUse || !effectiveContract}
          >
            Send NFT
          </TxButton>
          <TxResult hash={hash} error={err} hint="TBA must own the tokenId first." />
        </div>
      )}
    </PanelShell>
  );
}
