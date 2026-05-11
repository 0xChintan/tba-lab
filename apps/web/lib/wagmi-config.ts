import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia, baseSepolia } from "wagmi/chains";
import { RPC_URL } from "./chains";

/**
 * The single wagmi/RainbowKit config consumed by `<WagmiProvider>` in
 * [providers.tsx](../app/providers.tsx).
 *
 * - `projectId` comes from `NEXT_PUBLIC_WC_PROJECT_ID`. A placeholder lets the
 *   app build/run without WalletConnect, but mobile wallet connections will
 *   warn until you set a real id from https://cloud.walletconnect.com.
 * - `transports` lets users plug in private RPC URLs via env vars; falls back
 *   to viem's public defaults when unset.
 * - `ssr: true` makes wagmi tolerant of Next.js App Router server rendering.
 */
export const wagmiConfig = getDefaultConfig({
  appName: "TBA Lab",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo-project-id",
  chains: [sepolia, baseSepolia],
  transports: {
    [sepolia.id]: http(RPC_URL[sepolia.id]),
    [baseSepolia.id]: http(RPC_URL[baseSepolia.id]),
  },
  ssr: true,
});
