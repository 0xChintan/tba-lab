"use client";

import { useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import { isSupportedChainId, EXPLORER_ADDRESS, type SupportedChainId } from "@/lib/chains";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";

const source = `const tba = client.getAccount({
  tokenContract: config.tokenContract,
  tokenId:       config.tokenId,
  salt:          config.salt,
})
// Synchronous — pure CREATE2 address derivation.`;

export function GetAccountPanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { config } = useTBAConfig();

  const inputsReady =
    supported &&
    client &&
    isAddress(config.tokenContract) &&
    /^[0-9]+$/.test(config.tokenId);

  let tba: `0x${string}` | null = null;
  let err: string | null = null;
  if (inputsReady && client) {
    try {
      tba = client.getAccount({
        tokenContract: config.tokenContract as `0x${string}`,
        tokenId: config.tokenId,
        salt: config.salt,
      });
    } catch (e) {
      err = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <PanelShell
      title="Compute TBA address"
      method="client.getAccount({ tokenContract, tokenId, salt })"
      description="Synchronous CREATE2 derivation. Same NFT yields the same address on every chain where the registry + implementation pair is deployed."
      docsHref={DOCS.methods}
      source={source}
    >
      {!supported ? (
        <StatusBadge tone="warn">switch to a supported chain in Config</StatusBadge>
      ) : !inputsReady ? (
        <StatusBadge tone="muted">fill in tokenContract + tokenId</StatusBadge>
      ) : err ? (
        <div className="space-y-2">
          <StatusBadge tone="error">getAccount threw</StatusBadge>
          <pre className="text-xs font-mono text-red-500 whitespace-pre-wrap">{err}</pre>
        </div>
      ) : tba ? (
        <div className="space-y-2">
          <StatusBadge tone="ok">derived</StatusBadge>
          <Mono className="block">{tba}</Mono>
          <a
            href={EXPLORER_ADDRESS[chainId as SupportedChainId](tba)}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View on explorer ↗
          </a>
        </div>
      ) : null}
    </PanelShell>
  );
}
