"use client";

import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import {
  isSupportedChainId,
  CHAIN_LABEL,
  EXPLORER_ADDRESS,
  type SupportedChainId,
} from "@/lib/chains";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";

const source = `// Reverse lookup: TBA → owning NFT
const nft = await client.getNFT({ accountAddress: tba })
// Returns { tokenContract, tokenId, chainId }.
// Only meaningful after the TBA has been deployed.`;

type NFT = { tokenContract: `0x${string}`; tokenId: string; chainId: number };

export function GetNFTPanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { config } = useTBAConfig();

  const [nft, setNft] = useState<NFT | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tba, setTba] = useState<`0x${string}` | null>(null);

  const ready =
    supported &&
    client &&
    isAddress(config.tokenContract) &&
    /^[0-9]+$/.test(config.tokenId);

  useEffect(() => {
    if (!ready || !client) return;
    try {
      setTba(
        client.getAccount({
          tokenContract: config.tokenContract as `0x${string}`,
          tokenId: config.tokenId,
          salt: config.salt,
        }),
      );
    } catch {
      setTba(null);
    }
  }, [ready, client, config.tokenContract, config.tokenId, config.salt]);

  async function fetchNFT() {
    if (!client || !tba) return;
    setLoading(true);
    setErr(null);
    setNft(null);
    try {
      const result = await client.getNFT({ accountAddress: tba });
      setNft(result as NFT);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PanelShell
      title="Reverse lookup — TBA → NFT"
      method="client.getNFT({ accountAddress })"
      description="Reads the proxy's immutable bytecode to recover the (tokenContract, tokenId, chainId) it was created for."
      docsHref={DOCS.methods}
      source={source}
    >
      {!ready ? (
        <StatusBadge tone="muted">awaiting inputs</StatusBadge>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={fetchNFT}
            disabled={loading || !tba}
            className="text-xs px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "fetching…" : "fetch"}
          </button>
          {err ? (
            <>
              <StatusBadge tone="error">failed (likely TBA not deployed)</StatusBadge>
              <pre className="text-xs font-mono text-red-500 whitespace-pre-wrap">{err}</pre>
            </>
          ) : null}
          {nft ? (
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-3 text-sm space-y-1">
              <Row label="tokenContract">
                <a
                  href={EXPLORER_ADDRESS[chainId as SupportedChainId](nft.tokenContract)}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  <Mono>{nft.tokenContract}</Mono>
                </a>
              </Row>
              <Row label="tokenId">
                <Mono>{nft.tokenId}</Mono>
              </Row>
              <Row label="chainId">
                <Mono>{nft.chainId}</Mono>{" "}
                <span className="text-zinc-500 text-xs">
                  ({CHAIN_LABEL[nft.chainId as SupportedChainId] ?? "?"})
                </span>
              </Row>
            </div>
          ) : null}
        </div>
      )}
    </PanelShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-xs text-zinc-500 w-24 shrink-0">{label}</span>
      <span className="break-all">{children}</span>
    </div>
  );
}
