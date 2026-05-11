"use client";

import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import { isSupportedChainId } from "@/lib/chains";
import { PanelShell, StatusBadge } from "@/components/ui";
import { DOCS } from "@/lib/docs";

const source = `const isDeployed = await client.checkAccountDeployment({
  accountAddress: tba,
})
// Reads the proxy's bytecode via eth_getCode.`;

export function CheckDeploymentPanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { config } = useTBAConfig();

  const [deployed, setDeployed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tba, setTba] = useState<`0x${string}` | null>(null);

  const inputsReady =
    supported &&
    client &&
    isAddress(config.tokenContract) &&
    /^[0-9]+$/.test(config.tokenId);

  useEffect(() => {
    if (!inputsReady || !client) {
      setTba(null);
      setDeployed(null);
      return;
    }
    try {
      const addr = client.getAccount({
        tokenContract: config.tokenContract as `0x${string}`,
        tokenId: config.tokenId,
        salt: config.salt,
      });
      setTba(addr);
    } catch {
      setTba(null);
    }
  }, [
    inputsReady,
    client,
    config.tokenContract,
    config.tokenId,
    config.salt,
  ]);

  async function refresh() {
    if (!client || !tba) return;
    setLoading(true);
    setErr(null);
    try {
      const ok = await client.checkAccountDeployment({ accountAddress: tba });
      setDeployed(ok);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tba && client) void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tba, client]);

  return (
    <PanelShell
      title="Deployment status"
      method="client.checkAccountDeployment({ accountAddress })"
      description="Has the TBA proxy been deployed to its deterministic address yet?"
      docsHref={DOCS.methods}
      source={source}
    >
      {!inputsReady ? (
        <StatusBadge tone="muted">awaiting tokenContract + tokenId</StatusBadge>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {loading ? (
              <StatusBadge tone="muted">checking…</StatusBadge>
            ) : err ? (
              <StatusBadge tone="error">error</StatusBadge>
            ) : deployed === null ? (
              <StatusBadge tone="muted">unknown</StatusBadge>
            ) : deployed ? (
              <StatusBadge tone="ok">deployed</StatusBadge>
            ) : (
              <StatusBadge tone="warn">not deployed yet</StatusBadge>
            )}
            <button
              type="button"
              onClick={refresh}
              disabled={loading || !tba}
              className="text-xs px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              refresh
            </button>
          </div>
          {err ? (
            <pre className="text-xs font-mono text-red-500 whitespace-pre-wrap">{err}</pre>
          ) : null}
        </div>
      )}
    </PanelShell>
  );
}
