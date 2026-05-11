import { EthersTBAProvider } from "@/features/tba-lab/providers/EthersTBAProvider";
import { LabShell } from "@/features/tba-lab/components/LabShell";

export default function EthersLabPage() {
  return (
    <EthersTBAProvider>
      <LabShell
        title="ethers v6 lab"
        intro={
          <>
            Same panels, but the <code className="font-mono">TokenboundClient</code> is
            built from an ethers v6 <code className="font-mono">JsonRpcSigner</code>{" "}
            bridged out of wagmi&apos;s{" "}
            <code className="font-mono">useConnectorClient</code>. Pure read methods
            require a connected wallet here because the signer is the only client we
            pass.
          </>
        }
      />
    </EthersTBAProvider>
  );
}
