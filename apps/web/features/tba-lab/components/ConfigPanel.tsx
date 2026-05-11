"use client";

import { useChainId, useSwitchChain } from "wagmi";
import {
  SUPPORTED_CHAINS,
  CHAIN_LABEL,
  isSupportedChainId,
  type SupportedChainId,
} from "@/lib/chains";
import { useTBAConfig } from "@/features/tba-lab/state/TBAConfig";
import { PanelShell, StatusBadge } from "@/components/ui";
import { DOCS } from "@/lib/docs";

const source = `// TokenboundClient constructor exercised by this panel:
new TokenboundClient({
  walletClient,        // from wagmi useWalletClient()
  publicClient,        // from wagmi usePublicClient({ chainId })
  chainId,             // selected via wagmi useSwitchChain
  version: TBVersion.V3,           // or V2 — re-derives the TBA address
  implementationAddress: '0x...',  // optional override
  registryAddress:       '0x...',  // optional override
  salt: 0,                         // optional CREATE2 salt
})`;

export function ConfigPanel() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const { config, setConfig, reset } = useTBAConfig();

  const supported = isSupportedChainId(chainId);

  return (
    <PanelShell
      title="Config — TokenboundClient constructor"
      method="new TokenboundClient({...})"
      description="Every panel below reads from this config. Switching any value rebuilds the client; getAccount re-derives instantly."
      docsHref={DOCS.installation}
      source={source}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Chain">
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CHAINS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => switchChain({ chainId: c.id })}
                disabled={isPending || chainId === c.id}
                className={
                  "text-xs px-2.5 py-1.5 rounded-md border transition-colors disabled:opacity-50 " +
                  (chainId === c.id
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800")
                }
              >
                {c.name} <span className="text-zinc-500">·</span> {c.id}
              </button>
            ))}
          </div>
          {!supported ? (
            <div className="mt-2">
              <StatusBadge tone="warn">unsupported chain — switch above</StatusBadge>
            </div>
          ) : null}
        </Field>

        <Field label="Version">
          <div className="flex gap-2">
            {([2, 3] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setConfig({ version: v })}
                className={
                  "text-xs px-2.5 py-1.5 rounded-md border transition-colors " +
                  (config.version === v
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800")
                }
              >
                V{v}
              </button>
            ))}
            <span className="text-xs text-zinc-500 self-center ml-2">
              Different versions ⇒ different TBA address for the same NFT.
            </span>
          </div>
        </Field>

        <Field label="Salt (number)">
          <input
            type="number"
            min={0}
            value={config.salt}
            onChange={(e) => setConfig({ salt: Number(e.target.value) || 0 })}
            className={inputCls}
          />
        </Field>

        <Field label="Connected chain ID" hint={CHAIN_LABEL[chainId as SupportedChainId] ?? "—"}>
          <div className="font-mono text-sm">{chainId || "(not connected)"}</div>
        </Field>

        <Field
          label="Override implementationAddress"
          hint="Leave blank for the SDK default."
        >
          <input
            type="text"
            placeholder="0x… (optional)"
            value={config.implementationAddress}
            onChange={(e) =>
              setConfig({ implementationAddress: e.target.value as `0x${string}` })
            }
            className={inputCls}
          />
        </Field>

        <Field
          label="Override registryAddress"
          hint="Leave blank to use ERC-6551 canonical registry."
        >
          <input
            type="text"
            placeholder="0x… (optional)"
            value={config.registryAddress}
            onChange={(e) =>
              setConfig({ registryAddress: e.target.value as `0x${string}` })
            }
            className={inputCls}
          />
        </Field>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="text-xs px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Reset config
        </button>
      </div>
    </PanelShell>
  );
}

const inputCls =
  "w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
        {label}
        {hint ? <span className="text-zinc-500 font-normal ml-1">— {hint}</span> : null}
      </label>
      {children}
    </div>
  );
}
