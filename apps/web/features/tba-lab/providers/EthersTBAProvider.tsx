"use client";

import { useMemo, type ReactNode } from "react";
import { useChainId } from "wagmi";
import { TokenboundClient, TBVersion } from "@tokenbound/sdk";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { useTBAConfig } from "../state/TBAConfig";
import { isSupportedChainId } from "@/lib/chains";
import { TBAClientProvider } from "./TBAClientContext";

/**
 * Builds a {@link TokenboundClient} from an ethers v6 `JsonRpcSigner` (bridged
 * out of wagmi's connector client by `useEthersSigner`) and exposes it via
 * {@link TBAClientProvider}. Used by `/ethers` and the right column of
 * `/compare`.
 *
 * Note: unlike the viem provider, this one has no separate public client to
 * fall back on — read methods require a connected wallet because the signer is
 * the only chain client we hand the SDK.
 */
export function EthersTBAProvider({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const effective = supported ? chainId : 11155111;
  const signer = useEthersSigner({ chainId: effective });
  const { config } = useTBAConfig();

  const client = useMemo(() => {
    if (!signer) return null;
    return new TokenboundClient({
      signer,
      chainId: effective,
      version: config.version === 2 ? TBVersion.V2 : TBVersion.V3,
      implementationAddress: config.implementationAddress || undefined,
      registryAddress: config.registryAddress || undefined,
    });
  }, [
    effective,
    signer,
    config.version,
    config.implementationAddress,
    config.registryAddress,
  ]);

  return (
    <TBAClientProvider client={client} stack="ethers">
      {children}
    </TBAClientProvider>
  );
}
