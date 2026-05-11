export const questAbi = [
  {
    type: "function",
    name: "recordQuest",
    stateMutability: "nonpayable",
    inputs: [{ name: "questId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "completedCount",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;
