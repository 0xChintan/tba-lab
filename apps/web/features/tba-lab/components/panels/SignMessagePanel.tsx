"use client";

import { useState } from "react";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { hashMessage } from "viem";
import { useTBAClient } from "@/features/tba-lab/providers/TBAClientContext";
import { useTBAAddress } from "@/features/tba-lab/hooks/useTBAAddress";
import { isSupportedChainId } from "@/lib/chains";
import { erc1271Abi } from "@/lib/abis";
import { PanelShell, StatusBadge, Mono } from "@/components/ui";
import { DOCS } from "@/lib/docs";
import { TxButton, Input } from "@/components/ui";

const source = `// 1) Sign as the TBA — under V3 this is forwarded through the account.
const sig = await client.signMessage({ message: 'Hello from TBA' })

// 2) Verify the signature on-chain via ERC-1271:
const magic = await publicClient.readContract({
  address: tba,
  abi: erc1271Abi,
  functionName: 'isValidSignature',
  args: [hashMessage('Hello from TBA'), sig],
})
// magic === '0x1626ba7e' ⇒ valid`;

const ERC1271_MAGIC = "0x1626ba7e";

export function SignMessagePanel() {
  const chainId = useChainId();
  const supported = isSupportedChainId(chainId);
  const { client } = useTBAClient();
  const publicClient = usePublicClient({ chainId: supported ? chainId : 11155111 });
  const { tba, ready } = useTBAAddress();
  const { isConnected } = useAccount();

  const [message, setMessage] = useState("Hello from TBA");
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [magic, setMagic] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<"sign" | "verify" | null>(null);

  async function sign() {
    if (!client) return;
    setBusy("sign");
    setErr(null);
    setSignature(null);
    setMagic(null);
    try {
      const sig = await client.signMessage({ message });
      setSignature(sig);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function verify() {
    if (!publicClient || !tba || !signature) return;
    setBusy("verify");
    setErr(null);
    try {
      const result = await publicClient.readContract({
        address: tba,
        abi: erc1271Abi,
        functionName: "isValidSignature",
        args: [hashMessage(message), signature],
      });
      setMagic(result as string);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <PanelShell
      title="Sign message as TBA"
      method="client.signMessage({ message })  →  ERC-1271 isValidSignature(...)"
      description="Sign a message and verify it on-chain by calling the TBA's ERC-1271 isValidSignature. The magic value 0x1626ba7e means valid."
      docsHref={DOCS.eip1271}
      source={source}
    >
      {!isConnected ? (
        <StatusBadge tone="warn">connect a wallet</StatusBadge>
      ) : !ready ? (
        <StatusBadge tone="muted">awaiting inputs</StatusBadge>
      ) : (
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-zinc-500">TBA: </span><Mono>{tba}</Mono>
          </div>
          <Input
            label="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            <TxButton onClick={sign} loading={busy === "sign"}>Sign</TxButton>
            <TxButton
              onClick={verify}
              loading={busy === "verify"}
              disabled={!signature}
              variant="secondary"
            >
              Verify on-chain (ERC-1271)
            </TxButton>
          </div>
          {signature ? (
            <div className="space-y-1">
              <div className="text-xs text-zinc-500">signature</div>
              <Mono className="block break-all">{signature}</Mono>
            </div>
          ) : null}
          {magic ? (
            <div className="flex items-center gap-2">
              {magic === ERC1271_MAGIC ? (
                <StatusBadge tone="ok">
                  isValidSignature → 0x1626ba7e (valid)
                </StatusBadge>
              ) : (
                <StatusBadge tone="error">
                  isValidSignature → {magic} (invalid)
                </StatusBadge>
              )}
            </div>
          ) : null}
          {err ? (
            <pre className="text-xs font-mono text-red-500 whitespace-pre-wrap">{err}</pre>
          ) : null}
        </div>
      )}
    </PanelShell>
  );
}
