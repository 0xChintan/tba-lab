// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @title Items
/// @notice Mock ERC-1155 collection — anyone can mint any id. Backs the
///         ERC-1155 `transferNFT` demo panel in the TBA Lab.
/// @dev    Testnet only. No access control on minting.
contract Items is ERC1155 {
    constructor() ERC1155("ipfs://bafy/items/{id}.json") {}

    /// @notice Mint `amount` units of `id` to the caller.
    /// @param id     The item type to mint.
    /// @param amount How many units to mint.
    function mint(uint256 id, uint256 amount) external {
        _mint(msg.sender, id, amount, "");
    }

    /// @notice Mint multiple item types to the caller in one transaction.
    /// @param ids     Parallel array of item type ids.
    /// @param amounts Parallel array of amounts (must match `ids` length).
    function mintBatch(uint256[] calldata ids, uint256[] calldata amounts) external {
        _mintBatch(msg.sender, ids, amounts, "");
    }
}
