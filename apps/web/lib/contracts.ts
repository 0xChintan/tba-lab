import { sepolia, baseSepolia } from "wagmi/chains";
import type { SupportedChainId } from "./chains";

export type ContractAddresses = {
  adventurerNFT: `0x${string}`;
  gold: `0x${string}`;
  items: `0x${string}`;
  quest: `0x${string}`;
};

const ZERO = "0x0000000000000000000000000000000000000000" as const;

/**
 * Companion contract addresses, deployed by contracts/script/Deploy.s.sol.
 * The same deployer EOA with the same fresh nonce sequence yields identical
 * CREATE addresses on both chains — hence the apparent duplication.
 */
export const CONTRACTS: Record<SupportedChainId, ContractAddresses> = {
  [sepolia.id]: {
    adventurerNFT: "0x40CbfADD16549eF6e4F0eB51b56eA7E487e33Bb9",
    gold:          "0xDA7fE21E8EF4ff3632a109F9D8F4FdF8893fb7c5",
    items:         "0xCfB0614f664a5bD54e9AeA2F3B806199B7cE79eC",
    quest:         "0x70E4c4d1D9a016B6C35C40859ECC2Eaac68Fadba",
  },
  [baseSepolia.id]: {
    adventurerNFT: "0x40CbfADD16549eF6e4F0eB51b56eA7E487e33Bb9",
    gold:          "0xDA7fE21E8EF4ff3632a109F9D8F4FdF8893fb7c5",
    items:         "0xCfB0614f664a5bD54e9AeA2F3B806199B7cE79eC",
    quest:         "0x70E4c4d1D9a016B6C35C40859ECC2Eaac68Fadba",
  },
};

export const GOLD_DECIMALS = 18;

export function contractsDeployed(chainId: SupportedChainId): boolean {
  const c = CONTRACTS[chainId];
  return c.adventurerNFT !== ZERO;
}
