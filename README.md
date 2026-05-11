# TBA Lab

[![CI](https://img.shields.io/badge/CI-passing-brightgreen?style=flat-square)](.github/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Foundry](https://img.shields.io/badge/Foundry-1.7-orange?style=flat-square)](https://book.getfoundry.sh)

A hands-on lab for the [Tokenbound SDK](https://docs.tokenbound.org/) that exercises **every public method** on `TokenboundClient` — across **both viem and ethers v6**, on **Sepolia and Base Sepolia**.

Each UI panel maps 1:1 to a single SDK call, with a *show calldata* toggle that reveals the `prepare*` variant alongside the live action and a *docs ↗* link straight to the upstream reference.

> Useful if you are: learning [ERC-6551](https://eips.ethereum.org/EIPS/eip-6551), evaluating Tokenbound for production use, comparing viem vs ethers ergonomics, or onboarding teammates onto token-bound accounts.

## Quickstart

```bash
git clone https://github.com/<you>/tba-lab.git
cd tba-lab
pnpm install
cp apps/web/.env.example apps/web/.env.local      # set NEXT_PUBLIC_WC_PROJECT_ID
pnpm dev
```

Open http://localhost:3000, connect a wallet on Sepolia, and follow the six-step walkthrough on the homepage.

## Using the lab — six steps

> The same checklist is rendered on the homepage with a live status strip
> (wallet, chain, balance, deployed-contracts state).

1. **Connect a wallet.** Top-right Connect button → MetaMask → switch to Sepolia.
   Need testnet ETH? [sepoliafaucet.com](https://sepoliafaucet.com) or
   [alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia).
2. **Open `/viem`.** The Config panel drives the live `TokenboundClient`
   constructor; the NFT picker tells it which NFT will own the TBA.
3. **Mint your owner NFT.** Setup helpers → Mint NFT → confirm. Once it lands,
   it appears as a row in *Your AdventurerNFTs* (auto-discovered on-chain) —
   click it to wire every panel.
4. **Watch the reads light up.** Compute address, deployment status,
   `isValidSigner`, and `deconstructBytecode` all derive from the picker.
   Toggle the chain in Config — the same NFT yields the same TBA address on
   both Sepolia and Base Sepolia.
5. **Deploy the TBA.** Deploy TBA panel → Preview (renders
   `prepareCreateAccount` calldata) → Deploy (broadcasts `createAccount`).
   The reverse `getNFT` lookup then returns `{ tokenContract, tokenId, chainId }`.
6. **Fund and exercise the writes.** Send a tiny ETH amount to the TBA address
   from your wallet, claim Gold and mint Items in Setup helpers, transfer some
   to the TBA, then drive every write panel: ETH / ERC-20 / ERC-721 / ERC-1155 /
   `execute` (Quest.recordQuest) / `signMessage` (ERC-1271 verify returns
   `0x1626ba7e` when valid).

Once it works on `/viem`, repeat on `/ethers` — same panels, different SDK
init under the hood (ethers v6 `JsonRpcSigner` via a wagmi bridge). `/compare`
runs both stacks side-by-side reading from the same config.

## What's in the box

```
apps/web/        Next.js 16 App Router · TS · Tailwind 4 · wagmi v2 · RainbowKit 2 · ethers v6 · @tokenbound/sdk 0.5
contracts/       Foundry · Solidity 0.8.24 · OpenZeppelin v5
```

### Companion contracts

Four mock contracts make the lab self-contained on testnet:

| Contract        | Purpose |
|-----------------|---------|
| `AdventurerNFT` | ERC-721 with public `mint()`. The NFT that "owns" each TBA. |
| `Gold`          | ERC-20 with a rate-limited `faucet()`. For `transferERC20` demos. |
| `Items`         | ERC-1155 with public `mintBatch()`. For `transferNFT` (ERC-1155) demos. |
| `Quest`         | Emits `QuestCompleted(msg.sender, questId)`. Target for `execute()`. |

### SDK surface covered

| Panel                          | SDK call                                |
|--------------------------------|------------------------------------------|
| Compute address                | `getAccount`                            |
| Deployment status              | `checkAccountDeployment`                |
| Owner lookup                   | `getNFT`                                |
| Deploy TBA + calldata          | `createAccount` + `prepareCreateAccount` |
| Call contract from TBA         | `execute` + `prepareExecution`          |
| Send ETH out of TBA            | `transferETH`                           |
| Send ERC-20 out of TBA         | `transferERC20`                         |
| Send ERC-721 out of TBA        | `transferNFT` (`ERC721`)                |
| Send ERC-1155 out of TBA       | `transferNFT` (`ERC1155`)               |
| Sign + ERC-1271 verify         | `signMessage`                           |
| Connected wallet is signer?    | `isValidSigner`                         |
| Inspect TBA proxy bytecode     | `deconstructBytecode`                   |

Constructor options also exercised: `version` (V2/V3), `implementationAddress`,
`registryAddress`, `salt`, `chainId`.

### Pages

- `/` — onboarding (live status strip + six-step walkthrough)
- `/viem` — every panel, backed by a wagmi-built `TokenboundClient`
- `/ethers` — same panels, backed by an ethers v6 `Signer`
- `/compare` — viem vs ethers v6 side-by-side

## Architecture

The 12 SDK panels are **stack-agnostic** — each one reads its `TokenboundClient`
from a React context (`useTBAClient()`):

```
ViemTBAProvider                     EthersTBAProvider
  ↳ walletClient + publicClient       ↳ JsonRpcSigner (wagmi bridge)
         ↓                                   ↓
         └────────── useTBAClient ───────────┘
                          ↓
                     12 SDK panels
```

The wallet is the only source of persistence — `useOwnedAdventurerTBAs` walks the
connected wallet's on-chain holdings via multicall and surfaces each owned NFT's
deterministic TBA address plus its live deployment status. No localStorage, no
backend.

## Local setup from scratch

### Prerequisites

- Node 20+ and pnpm 11+
- Foundry (`curl -L https://foundry.paradigm.xyz | bash && foundryup`)
- A testnet wallet funded with Sepolia ETH and/or Base Sepolia ETH

### Frontend only

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
# fill in NEXT_PUBLIC_WC_PROJECT_ID (https://cloud.walletconnect.com)
pnpm dev
```

The lab works against the companion contracts already deployed on Sepolia and
Base Sepolia (addresses checked into [`apps/web/lib/contracts.ts`](apps/web/lib/contracts.ts)).

### Deploying the companion contracts yourself

```bash
cp contracts/.env.example contracts/.env
# fill in PRIVATE_KEY (throwaway testnet key) and RPCs

cd contracts
source .env
forge test                                       # 10 tests
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY
```

Then update [`apps/web/lib/contracts.ts`](apps/web/lib/contracts.ts) with the
new addresses.

## Workspace scripts

```bash
pnpm dev               # next dev (apps/web)
pnpm build             # next build
pnpm typecheck         # tsc --noEmit
pnpm lint              # eslint
pnpm test              # forge test
pnpm contracts:build   # forge build
pnpm contracts:fmt     # forge fmt
pnpm clean             # nuke .next / node_modules
```

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs typecheck +
build for the web app and `forge build --sizes` + `forge test` for the
contracts on every push and PR.

## Resources

- [Tokenbound SDK docs](https://docs.tokenbound.org/)
- [@tokenbound/sdk on GitHub](https://github.com/tokenbound/sdk)
- [EIP-6551 — Non-fungible Token Bound Accounts](https://eips.ethereum.org/EIPS/eip-6551)
- [EIP-1271 — Standard Signature Validation Method for Contracts](https://eips.ethereum.org/EIPS/eip-1271)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
# tba-lab
# tba-lab
# tba-lab
