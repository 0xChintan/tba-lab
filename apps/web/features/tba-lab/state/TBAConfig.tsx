"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TBVersionOpt = 2 | 3;

export type TBAConfig = {
  /** NFT that "owns" the TBA. */
  tokenContract: `0x${string}` | "";
  tokenId: string;
  /** Constructor option: salt for the CREATE2 derivation. */
  salt: number;
  /** Constructor option: 2 or 3 (TBVersion). */
  version: TBVersionOpt;
  /** Constructor option: override the implementation address. */
  implementationAddress: `0x${string}` | "";
  /** Constructor option: override the ERC-6551 registry address. */
  registryAddress: `0x${string}` | "";
};

const DEFAULT_CONFIG: TBAConfig = {
  tokenContract: "",
  tokenId: "",
  salt: 0,
  version: 3,
  implementationAddress: "",
  registryAddress: "",
};

type TBAConfigContext = {
  config: TBAConfig;
  setConfig: (next: Partial<TBAConfig>) => void;
  reset: () => void;
};

const Ctx = createContext<TBAConfigContext | null>(null);

/**
 * Holds the current TBA derivation knobs in memory only. No localStorage —
 * the source of truth for "what TBAs do I have?" is the connected wallet's
 * on-chain NFT holdings (see useOwnedAdventurerTBAs).
 */
export function TBAConfigProvider({ children }: { children: ReactNode }) {
  const [config, _setConfig] = useState<TBAConfig>(DEFAULT_CONFIG);

  const value = useMemo<TBAConfigContext>(
    () => ({
      config,
      setConfig: (next) => _setConfig((prev) => ({ ...prev, ...next })),
      reset: () => _setConfig(DEFAULT_CONFIG),
    }),
    [config],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTBAConfig() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTBAConfig must be used inside TBAConfigProvider");
  return v;
}
