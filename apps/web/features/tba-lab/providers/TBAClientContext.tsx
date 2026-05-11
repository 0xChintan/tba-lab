"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TokenboundClient } from "@tokenbound/sdk";

/**
 * Which signer library backs the active {@link TokenboundClient}.
 * Surfaced by {@link useTBAClient} so panels can show a stack badge if needed.
 */
export type TBAStack = "viem" | "ethers";

type TBAClientCtx = {
  /** The active SDK client, or `null` until prerequisites (wallet/public client) are ready. */
  client: TokenboundClient | null;
  /** Which library built `client`. */
  stack: TBAStack;
};

const Ctx = createContext<TBAClientCtx>({ client: null, stack: "viem" });

/**
 * Stack-agnostic provider that exposes a pre-built {@link TokenboundClient} to
 * every panel via {@link useTBAClient}. The concrete builders live in
 * `ViemTBAProvider` and `EthersTBAProvider`; both render this provider with the
 * resulting client. Panels never construct the client themselves — they read
 * it through context, which is what makes a single panel work against either
 * viem or ethers v6.
 */
export function TBAClientProvider({
  client,
  stack,
  children,
}: {
  client: TokenboundClient | null;
  stack: TBAStack;
  children: ReactNode;
}) {
  return <Ctx.Provider value={{ client, stack }}>{children}</Ctx.Provider>;
}

/**
 * Read the current {@link TokenboundClient} and its underlying stack from
 * context. Returns `{ client: null }` outside any provider — most panels guard
 * on this and render a "connect a wallet" hint until the client is ready.
 */
export function useTBAClient() {
  return useContext(Ctx);
}
