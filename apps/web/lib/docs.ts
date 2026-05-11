/**
 * Canonical links to upstream documentation. Centralized so we can fix all
 * panel links from one place if Tokenbound restructures their docs.
 */
export const DOCS = {
  tokenboundHome: "https://docs.tokenbound.org/",
  installation: "https://docs.tokenbound.org/sdk/installation",
  methods: "https://docs.tokenbound.org/sdk/methods",
  github: "https://github.com/tokenbound/sdk",

  // Foundational specs
  eip6551: "https://eips.ethereum.org/EIPS/eip-6551",
  eip1271: "https://eips.ethereum.org/EIPS/eip-1271",
  erc721: "https://eips.ethereum.org/EIPS/eip-721",
  erc1155: "https://eips.ethereum.org/EIPS/eip-1155",
  erc20: "https://eips.ethereum.org/EIPS/eip-20",
} as const;
