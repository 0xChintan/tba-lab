"use client";

import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import { useOwnedAdventurerNFTs } from "./useOwnedAdventurerNFTs";

export type OwnedTBA = {
  tokenId: number;
  tbaAddress: `0x${string}`;
  /** True once we've verified eth_getCode returned non-empty bytecode. */
  deployed: boolean;
  /** True until the first deployment check completes for this address. */
  checking: boolean;
};

/**
 * For every AdventurerNFT the connected wallet owns, return the deterministic
 * TBA address plus its live on-chain deployment status. This is the wallet's
 * persistent "memory" — no localStorage needed.
 */
export function useOwnedAdventurerTBAs(): {
  tbas: OwnedTBA[];
  loading: boolean;
} {
  const { client } = useTBAClient();
  const publicClient = usePublicClient();
  const { config } = useTBAConfig();
  const { owned, nftAddress, loading } = useOwnedAdventurerNFTs();

  // Compute TBA addresses synchronously — getAccount is pure CREATE2.
  const baseList = useMemo(() => {
    if (!client || !nftAddress) return [];
    return owned.map((id) => {
      try {
        const tba = client.getAccount({
          tokenContract: nftAddress,
          tokenId: String(id),
          salt: config.salt,
        });
        return { tokenId: id, tbaAddress: tba };
      } catch {
        return null;
      }
    }).filter((x): x is { tokenId: number; tbaAddress: `0x${string}` } => x !== null);
  }, [client, nftAddress, owned, config.salt]);

  const [deployment, setDeployment] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!publicClient || baseList.length === 0) return;
    let cancelled = false;

    Promise.all(
      baseList.map(async ({ tbaAddress }) => {
        try {
          const code = await publicClient.getBytecode({ address: tbaAddress });
          return [tbaAddress, !!code && code !== "0x"] as const;
        } catch {
          return [tbaAddress, false] as const;
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      setDeployment(Object.fromEntries(results));
    });

    return () => {
      cancelled = true;
    };
  }, [publicClient, baseList]);

  const tbas = useMemo<OwnedTBA[]>(
    () =>
      baseList.map(({ tokenId, tbaAddress }) => ({
        tokenId,
        tbaAddress,
        deployed: deployment[tbaAddress] ?? false,
        checking: !(tbaAddress in deployment),
      })),
    [baseList, deployment],
  );

  return { tbas, loading };
}
