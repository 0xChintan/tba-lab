"use client";

import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { isAddress } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import {
  isSupportedChainId,
  CHAIN_LABEL,
  type SupportedChainId,
} from "@/lib/chains";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";

const source = `const segs = await client.deconstructBytecode({ accountAddress: tba })
// Returns { implementationAddress, salt, tokenChainId, tokenContract, tokenId }
// parsed out of the proxy's immutable bytecode (EIP-1167-style).`;

type Seg = {
  implementationAddress: `0x${string}`;
  salt: string;
  tokenChainId: number;
  tokenContract: `0x${string}`;
  tokenId: string;
} | null;

export function DeconstructBytecodePanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const { config } = useTBAConfig();

  const [seg, setSeg] = useState<Seg>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ready =
    supported &&
    client &&
    isAddress(config.tokenContract) &&
    /^[0-9]+$/.test(config.tokenId);

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

  async function inspect() {
    if (!client || !tba) return;
    setLoading(true);
    setErr(null);
    setSeg(null);
    try {
      const result = await client.deconstructBytecode({ accountAddress: tba });
      setSeg(result as Seg);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tba && client) void inspect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tba, client]);

  return (
    <PanelShell
      title="Inspect proxy bytecode"
      method="client.deconstructBytecode({ accountAddress })"
      description="Pulls the (implementation, salt, chainId, tokenContract, tokenId) immutable arguments straight out of the proxy contract."
      docsHref={DOCS.methods}
      source={source}
    >
      {!ready ? (
        <StatusBadge tone="muted">awaiting inputs</StatusBadge>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={inspect}
            disabled={loading || !tba}
            className="text-xs px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "inspecting…" : "inspect"}
          </button>
          {err ? (
            <>
              <StatusBadge tone="error">
                returned null — TBA proxy not deployed
              </StatusBadge>
              <pre className="text-xs font-mono text-red-500 whitespace-pre-wrap">{err}</pre>
            </>
          ) : null}
          {seg ? (
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-3 text-sm space-y-1">
              <Row label="implementation"><Mono>{seg.implementationAddress}</Mono></Row>
              <Row label="salt"><Mono>{seg.salt}</Mono></Row>
              <Row label="tokenChainId">
                <Mono>{seg.tokenChainId}</Mono>{" "}
                <span className="text-zinc-500 text-xs">
                  ({CHAIN_LABEL[seg.tokenChainId as SupportedChainId] ?? "?"})
                </span>
              </Row>
              <Row label="tokenContract"><Mono>{seg.tokenContract}</Mono></Row>
              <Row label="tokenId"><Mono>{seg.tokenId}</Mono></Row>
            </div>
          ) : null}
        </div>
      )}
    </PanelShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-xs text-zinc-500 w-32 shrink-0">{label}</span>
      <span className="break-all">{children}</span>
    </div>
  );
}
