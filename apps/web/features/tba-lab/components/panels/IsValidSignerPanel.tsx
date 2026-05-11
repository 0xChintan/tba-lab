"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import { isSupportedChainId } from "@/lib/chains";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";

const source = `const ok = await client.isValidSigner({ account: tba })
// Asks the deployed TBA whether the *connected wallet* is allowed to sign for it.
// For a freshly-deployed V3 account, only the NFT owner returns true.`;

export function IsValidSignerPanel() {
  const chainId = useChainId();
  const { address: connected } = useAccount();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { config } = useTBAConfig();

  const [valid, setValid] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ready =
    supported &&
    client &&
    isAddress(config.tokenContract) &&
    /^[0-9]+$/.test(config.tokenId) &&
    !!connected;

  let tba: `0x${string}` | null = null;
  if (ready && client) {
    try {
      tba = client.getAccount({
        tokenContract: config.tokenContract as `0x${string}`,
        tokenId: config.tokenId,
        salt: config.salt,
      });
    } catch {
      tba = null;
    }
  }

  async function check() {
    if (!client || !tba) return;
    setLoading(true);
    setErr(null);
    try {
      const v = await client.isValidSigner({ account: tba });
      setValid(v);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tba && client) void check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tba, client]);

  return (
    <PanelShell
      title="Validate signer"
      method="client.isValidSigner({ account })"
      description="Is the connected wallet authorized to sign as this TBA? Reads the V3 account's signer set on-chain."
      docsHref={DOCS.methods}
      source={source}
    >
      {!connected ? (
        <StatusBadge tone="warn">connect a wallet first</StatusBadge>
      ) : !ready ? (
        <StatusBadge tone="muted">awaiting inputs</StatusBadge>
      ) : (
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-zinc-500">connected: </span>
            <Mono>{connected}</Mono>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {loading ? (
              <StatusBadge tone="muted">checking…</StatusBadge>
            ) : err ? (
              <StatusBadge tone="error">error (TBA likely not deployed)</StatusBadge>
            ) : valid === true ? (
              <StatusBadge tone="ok">valid signer</StatusBadge>
            ) : valid === false ? (
              <StatusBadge tone="warn">not a valid signer</StatusBadge>
            ) : null}
            <button
              type="button"
              onClick={check}
              disabled={loading || !tba}
              className="text-xs px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              recheck
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
