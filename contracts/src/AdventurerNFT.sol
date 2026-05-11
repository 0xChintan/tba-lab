// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title AdventurerNFT
/// @notice Permissionless ERC-721 used by TBA Lab to drive Tokenbound accounts.
///         Each minted NFT owns a deterministic ERC-6551 account; the NFT
///         owner is the rightful signer for that account.
/// @dev    Testnet only — no supply cap, no access control, no royalties.
contract AdventurerNFT is ERC721 {
    /// @notice The token id that will be assigned on the next `mint()` call.
    /// @dev Also exposed for off-chain enumeration (see useOwnedAdventurerNFTs).
    uint256 public nextTokenId;

    string private constant BASE_URI = "ipfs://bafy/adventurer/";

    constructor() ERC721("Adventurer", "ADV") {}

    /// @notice Mint the next AdventurerNFT to the caller.
    /// @return tokenId The id of the freshly minted NFT.
    function mint() external returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    /// @inheritdoc ERC721
    function _baseURI() internal pure override returns (string memory) {
        return BASE_URI;
    }
}
