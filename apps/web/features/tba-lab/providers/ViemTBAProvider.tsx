"use client";

import { useMemo, type ReactNode } from "react";
import { useWalletClient, usePublicClient, useChainId } from "wagmi";
import { TokenboundClient, TBVersion } from "@tokenbound/sdk";
import { useTBAConfig } from "../state/TBAConfig";
import { isSupportedChainId } from "@/lib/chains";
import { TBAClientProvider } from "./TBAClientContext";

/**
 * Builds a {@link TokenboundClient} from wagmi's `walletClient` + `publicClient`
 * and exposes it via {@link TBAClientProvider}. Used by `/viem` and the left
 * column of `/compare`.
 *
 * Falls back to Sepolia (`11155111`) when the connected chain isn't one we
 * support, so read methods still work on a sane default while the user
 * switches networks.
 */
export function ViemTBAProvider({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const effective = supported ? chainId : 11155111;
  const { data: walletClient } = useWalletClient({ chainId: effective });
  const publicClient = usePublicClient({ chainId: effective });
  const { config } = useTBAConfig();

  const client = useMemo(() => {
    if (!publicClient) return null;
    return new TokenboundClient({
      walletClient: walletClient ?? undefined,
      publicClient,
      chainId: effective,
      version: config.version === 2 ? TBVersion.V2 : TBVersion.V3,
      implementationAddress: config.implementationAddress || undefined,
      registryAddress: config.registryAddress || undefined,
    });
  }, [
    effective,
    walletClient,
    publicClient,
    config.version,
    config.implementationAddress,
    config.registryAddress,
  ]);

  return (
    <TBAClientProvider client={client} stack="viem">
      {children}
    </TBAClientProvider>
  );
}
