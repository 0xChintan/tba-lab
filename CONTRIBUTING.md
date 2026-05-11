# Contributing

Thanks for your interest in TBA Lab. This is a learning-focused project — clarity beats cleverness.

## Local setup

```bash
git clone <your-fork>
cd tokenbound-6551
pnpm install
cp apps/web/.env.example apps/web/.env.local   # fill in NEXT_PUBLIC_WC_PROJECT_ID
pnpm dev
```

For contract work:

```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
cp contracts/.env.example contracts/.env       # fill in PRIVATE_KEY + RPC URLs
pnpm test                                       # forge tests
```

## What to keep in mind

- **Every UI panel maps 1:1 to a Tokenbound SDK method.** If you're adding a new
  panel, name it after the method, drop it in
  [`apps/web/features/tba-lab/components/panels/`](apps/web/features/tba-lab/components/panels/),
  and wire its `docsHref` in [`lib/docs.ts`](apps/web/lib/docs.ts).
- **Stack-agnostic.** Panels must work for both viem and ethers v6 — they read
  `useTBAClient()` from context. Never import `wagmi`'s `useWalletClient` /
  `usePublicClient` directly inside a panel.
- **No localStorage for app state.** The connected wallet's on-chain holdings are
  the source of truth. See [`useOwnedAdventurerTBAs`](apps/web/features/tba-lab/hooks/useOwnedAdventurerTBAs.ts).
- **One component per file** in `components/ui/`. Use the barrel
  `import { ... } from "@/components/ui"` to consume them.

## Checks before opening a PR

```bash
pnpm typecheck   # tsc --noEmit
pnpm build       # next build
pnpm test        # forge test
```

CI runs the same three on every PR.

## Commit style

Conventional commits are preferred:

```
feat(panel): add prepareCreateAccount preview toggle
fix(setup): mint count refresh after AdventurerNFT mint
docs(readme): clarify Base Sepolia setup
```

## Adding a new chain

1. Add the chain to [`apps/web/lib/chains.ts`](apps/web/lib/chains.ts).
2. Add an entry to [`apps/web/lib/wagmi-config.ts`](apps/web/lib/wagmi-config.ts).
3. Run `forge script script/Deploy.s.sol:Deploy` on the new RPC.
4. Add the deployed addresses to [`apps/web/lib/contracts.ts`](apps/web/lib/contracts.ts).
