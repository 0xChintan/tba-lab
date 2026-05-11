import { ViemTBAProvider } from "@/features/tba-lab/providers/ViemTBAProvider";
import { EthersTBAProvider } from "@/features/tba-lab/providers/EthersTBAProvider";
import { ConfigPanel } from "@/features/tba-lab/components/ConfigPanel";
import { NFTPicker } from "@/features/tba-lab/components/NFTPicker";
import { GetAccountPanel } from "@/features/tba-lab/components/panels/GetAccountPanel";
import { CheckDeploymentPanel } from "@/features/tba-lab/components/panels/CheckDeploymentPanel";
import { GetNFTPanel } from "@/features/tba-lab/components/panels/GetNFTPanel";
import { DeconstructBytecodePanel } from "@/features/tba-lab/components/panels/DeconstructBytecodePanel";
import { CreateAccountPanel } from "@/features/tba-lab/components/panels/CreateAccountPanel";

const COLUMNS = [
  {
    title: "viem + wagmi",
    Provider: ViemTBAProvider,
    accent: "border-emerald-500/40 bg-emerald-500/5",
  },
  {
    title: "ethers v6",
    Provider: EthersTBAProvider,
    accent: "border-sky-500/40 bg-sky-500/5",
  },
] as const;

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Compare</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Two <code className="font-mono">TokenboundClient</code> instances run against the same
          config — one built from a viem wallet/public client pair, one built from an ethers v6
          signer. Every panel should return identical values. Pick whichever column to broadcast
          the actual deploy.
        </p>
      </header>

      <ConfigPanel />
      <NFTPicker />

      <div className="grid lg:grid-cols-2 gap-6">
        {COLUMNS.map(({ title, Provider, accent }) => (
          <div
            key={title}
            className={`rounded-2xl border ${accent} p-4 space-y-4`}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {title}
            </h2>
            <Provider>
              <div className="space-y-4">
                <GetAccountPanel />
                <CheckDeploymentPanel />
                <GetNFTPanel />
                <DeconstructBytecodePanel />
                <CreateAccountPanel />
              </div>
            </Provider>
          </div>
        ))}
      </div>
    </div>
  );
}
