/**
 * Central chain registry for the lab. Every read/write panel and every
 * provider derives chain-specific behavior from this file:
 *
 *   - {@link SUPPORTED_CHAINS}    — wagmi chain objects shipped to `getDefaultConfig`.
 *   - {@link SupportedChainId}    — narrow union type used for typed lookups.
 *   - {@link CHAIN_LABEL}         — display name per chain id.
 *   - {@link RPC_URL}             — optional custom RPC (env-driven, viem falls back to public).
 *   - {@link EXPLORER_TX}         — tx-hash → explorer URL builder.
 *   - {@link EXPLORER_ADDRESS}    — address → explorer URL builder.
 *   - {@link isSupportedChainId}  — type guard, primary chain validation.
 *
 * To add a new chain: import its `wagmi/chains` entry, append it to
 * `SUPPORTED_CHAINS`, and fill in every per-chain record below.
 */

import { sepolia, baseSepolia, type Chain } from "wagmi/chains";

export const SUPPORTED_CHAINS = [sepolia, baseSepolia] as const satisfies readonly Chain[];

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]["id"];

export const CHAIN_LABEL: Record<SupportedChainId, string> = {
  [sepolia.id]: "Sepolia",
  [baseSepolia.id]: "Base Sepolia",
};

export const RPC_URL: Record<SupportedChainId, string | undefined> = {
  [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  [baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
};

export const EXPLORER_TX: Record<SupportedChainId, (hash: string) => string> = {
  [sepolia.id]: (h) => `https://sepolia.etherscan.io/tx/${h}`,
  [baseSepolia.id]: (h) => `https://sepolia.basescan.org/tx/${h}`,
};

export const EXPLORER_ADDRESS: Record<SupportedChainId, (a: string) => string> = {
  [sepolia.id]: (a) => `https://sepolia.etherscan.io/address/${a}`,
  [baseSepolia.id]: (a) => `https://sepolia.basescan.org/address/${a}`,
};

/** Type guard for {@link SupportedChainId}. Use before keying into any of the maps above. */
export function isSupportedChainId(id: number | undefined): id is SupportedChainId {
  return id === sepolia.id || id === baseSepolia.id;
}
