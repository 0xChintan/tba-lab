import type { ReactNode } from "react";

import { ConfigPanel } from "./ConfigPanel";
import { NFTPicker } from "./NFTPicker";
import { SetupPanel } from "./SetupPanel";
import { GetAccountPanel } from "./panels/GetAccountPanel";
import { CheckDeploymentPanel } from "./panels/CheckDeploymentPanel";
import { GetNFTPanel } from "./panels/GetNFTPanel";
import { IsValidSignerPanel } from "./panels/IsValidSignerPanel";
import { DeconstructBytecodePanel } from "./panels/DeconstructBytecodePanel";
import { CreateAccountPanel } from "./panels/CreateAccountPanel";
import { ExecutePanel } from "./panels/ExecutePanel";
import { TransferETHPanel } from "./panels/TransferETHPanel";
import { TransferERC20Panel } from "./panels/TransferERC20Panel";
import { TransferERC721Panel } from "./panels/TransferERC721Panel";
import { TransferERC1155Panel } from "./panels/TransferERC1155Panel";
import { SignMessagePanel } from "./panels/SignMessagePanel";

/**
 * The shared body of /viem and /ethers — every panel mounted in the same order.
 * The page wraps this in its own provider so the same panels read a different
 * underlying TokenboundClient construction.
 */
export function LabShell({
  title,
  intro,
}: {
  title: string;
  intro: ReactNode;
}) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{intro}</p>
      </header>

      <ConfigPanel />
      <NFTPicker />
      <SetupPanel />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Reads
        </h2>
        <div className="grid lg:grid-cols-2 gap-5">
          <GetAccountPanel />
          <CheckDeploymentPanel />
          <GetNFTPanel />
          <IsValidSignerPanel />
          <DeconstructBytecodePanel />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Writes
        </h2>
        <div className="grid lg:grid-cols-2 gap-5">
          <CreateAccountPanel />
          <ExecutePanel />
          <TransferETHPanel />
          <TransferERC20Panel />
          <TransferERC721Panel />
          <TransferERC1155Panel />
          <SignMessagePanel />
        </div>
      </section>
    </div>
  );
}
