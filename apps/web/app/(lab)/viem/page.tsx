import { ViemTBAProvider } from "@/features/tba-lab/providers/ViemTBAProvider";
import { LabShell } from "@/features/tba-lab/components/LabShell";

export default function ViemLabPage() {
  return (
    <ViemTBAProvider>
      <LabShell
        title="viem lab"
        intro={
          <>
            The <code className="font-mono">TokenboundClient</code> on this page is built
            from wagmi&apos;s <code className="font-mono">walletClient</code> and{" "}
            <code className="font-mono">publicClient</code>.
          </>
        }
      />
    </ViemTBAProvider>
  );
}
