"use client";

import { useMemo } from "react";
import { useAccount, useChainId, useReadContract, useReadContracts } from "wagmi";
import { adventurerNFTAbi } from "@/lib/abis";
import { CONTRACTS, contractsDeployed } from "@/lib/contracts";
import { isSupportedChainId, type SupportedChainId } from "@/lib/chains";

/**
 * Scan AdventurerNFT.nextTokenId() and then ownerOf(0..n-1) via multicall to
 * find which AdventurerNFTs the connected wallet currently owns.
 *
 * AdventurerNFT doesn't implement ERC-721Enumerable, so we walk the id space
 * ourselves. Multicall makes this one RPC round-trip regardless of supply.
 */
export function useOwnedAdventurerNFTs() {
  const { address } = useAccount();
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const adv =
    supported && contractsDeployed(chainId as SupportedChainId)
      ? CONTRACTS[chainId as SupportedChainId].adventurerNFT
      : null;

  const { data: nextTokenId } = useReadContract({
    abi: adventurerNFTAbi,
    address: adv ?? undefined,
    functionName: "nextTokenId",
    query: { enabled: !!adv && !!address, refetchInterval: 15_000 },
  });

  const count = nextTokenId ? Number(nextTokenId) : 0;
  const tokenIds = useMemo(
    () => Array.from({ length: count }, (_, i) => i),
    [count],
  );

  const { data: owners, isLoading } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      abi: adventurerNFTAbi,
      address: adv ?? undefined,
      functionName: "ownerOf",
      args: [BigInt(id)],
    })),
    query: { enabled: tokenIds.length > 0 && !!adv && !!address },
  });

  const owned = useMemo(() => {
    if (!owners || !address) return [];
    const me = address.toLowerCase();
    return tokenIds.filter((_, i) => {
      const result = owners[i];
      return (
        result?.status === "success" &&
        (result.result as string).toLowerCase() === me
      );
    });
  }, [owners, address, tokenIds]);

  return {
    owned,
    nftAddress: adv,
    loading: isLoading,
    nextTokenId: count,
  };
}
