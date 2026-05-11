import Link from "next/link";
import { StatusStrip } from "@/components/layout/StatusStrip";

type Step = {
  title: string;
  body: string;
  hint?: string;
};

const STEPS: Step[] = [
  {
    title: "Connect a wallet",
    body:
      "Click Connect Wallet (above or top-right), pick MetaMask, and switch the network to Sepolia.",
    hint: "If you have no testnet ETH, grab some at sepoliafaucet.com — about 0.01 ETH is plenty.",
  },
  {
    title: "Open the viem lab",
    body:
      "Head to /viem. The Config panel shows the live TokenboundClient constructor; the NFT picker is where you tell it which NFT will own the TBA.",
  },
  {
    title: "Mint your owner NFT",
    body:
      "In the Setup helpers panel, click Mint NFT. After it confirms, click the matching token-id button (start with 0) to auto-fill the NFT picker.",
  },
  {
    title: "Watch the read panels light up",
    body:
      "Compute address shows the deterministic TBA address. Deployment status reads its bytecode. The TBA → NFT lookup is empty until step 5.",
    hint: "Toggle the chain in Config — the same NFT yields the same TBA address on both Sepolia and Base Sepolia.",
  },
  {
    title: "Deploy the TBA",
    body:
      "In the Deploy TBA panel: click Preview first to see prepareCreateAccount's calldata, then Deploy to broadcast createAccount. After it confirms, every read panel updates.",
  },
  {
    title: "Fund the TBA, then exercise the writes",
    body:
      "Send some ETH to the TBA address from your wallet. Claim GOLD and mint Items in the Setup panel, then transfer some to the TBA. Now run transferETH, transferERC20, transferNFT (721 and 1155), execute (Quest.recordQuest), and signMessage from the Writes section.",
    hint: "signMessage's on-chain verify returns 0x1626ba7e when the signature is valid (ERC-1271 magic value).",
  },
];

const PANELS = [
  ["getAccount", "Deterministic TBA address from (tokenContract, tokenId, salt)."],
  ["checkAccountDeployment", "Has the TBA proxy been deployed yet?"],
  ["getNFT", "Reverse lookup — TBA → owning NFT contract + id + chain."],
  ["createAccount + prepareCreateAccount", "Deploy a TBA, with side-by-side calldata preview."],
  ["execute + prepareExecution", "Call a contract from the TBA itself."],
  ["transferETH", "Send native ETH out of the TBA."],
  ["transferERC20", "Send our Gold token out of the TBA."],
  ["transferNFT (ERC-721)", "Send an AdventurerNFT out of the TBA."],
  ["transferNFT (ERC-1155)", "Send Items out of the TBA."],
  ["signMessage", "Sign a message; verify it via ERC-1271 on the deployed TBA."],
  ["isValidSigner", "Is the connected wallet a valid signer for the TBA?"],
  ["deconstructBytecode", "Parse implementation/salt/chainId/tokenContract/tokenId out of the proxy."],
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          A hands-on lab for the Tokenbound SDK.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Every panel maps 1:1 to a{" "}
          <code className="font-mono text-emerald-600 dark:text-emerald-400">
            TokenboundClient
          </code>{" "}
          method. Connect a wallet, mint a test NFT, and walk every SDK call
          end-to-end on Sepolia or Base Sepolia.
        </p>
      </section>

      <StatusStrip />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          First time? Do this.
        </h2>
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-semibold">
                {i + 1}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold tracking-tight">{s.title}</h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{s.body}</p>
                {s.hint ? (
                  <p className="text-xs text-zinc-500 italic">{s.hint}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/viem"
            className="rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-sm font-medium"
          >
            Open viem lab →
          </Link>
          <Link
            href="/ethers"
            className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Try the ethers v6 lab →
          </Link>
          <Link
            href="/compare"
            className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Compare both stacks →
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          SDK surface — every method has a panel
        </h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {PANELS.map(([name, desc]) => (
            <li
              key={name}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
            >
              <code className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                {name}
              </code>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Troubleshooting
        </h2>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>&ldquo;Wrong network&rdquo; in MetaMask</strong> — open Config and click
            either Sepolia or Base Sepolia. The button switches the wallet for you.
          </li>
          <li>
            <strong>Transaction reverts with &ldquo;not the owner&rdquo;</strong> — your
            wallet must own the NFT shown in the picker, since the TBA forwards calls to
            its NFT&apos;s owner.
          </li>
          <li>
            <strong>checkAccountDeployment stays red</strong> — the deploy tx hasn&apos;t
            confirmed yet. Click refresh on the panel a few seconds later.
          </li>
          <li>
            <strong>Insufficient funds</strong> — Sepolia faucet at{" "}
            <a href="https://sepoliafaucet.com" className="text-emerald-600 dark:text-emerald-400 hover:underline" target="_blank" rel="noreferrer">
              sepoliafaucet.com
            </a>
            , Base Sepolia at{" "}
            <a href="https://www.alchemy.com/faucets/base-sepolia" className="text-emerald-600 dark:text-emerald-400 hover:underline" target="_blank" rel="noreferrer">
              alchemy.com/faucets/base-sepolia
            </a>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
