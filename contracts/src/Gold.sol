// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Gold
/// @notice Mock ERC-20 with a rate-limited public faucet. Backs the
///         `transferERC20` demo panel in the TBA Lab.
/// @dev    Testnet only.
contract Gold is ERC20 {
    /// @notice Amount minted per successful `faucet()` call.
    uint256 public constant FAUCET_AMOUNT = 1_000 ether;

    /// @notice Minimum time between two faucet claims from the same address.
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    /// @notice Unix timestamp of each address's most recent successful claim.
    mapping(address => uint256) public lastClaim;

    /// @notice Reverted when an address claims again before the cooldown elapses.
    /// @param retryAt Earliest unix timestamp at which the caller may claim again.
    error FaucetCooldown(uint256 retryAt);

    constructor() ERC20("Gold", "GOLD") {}

    /// @notice Mint `FAUCET_AMOUNT` GOLD to the caller, subject to the cooldown.
    function faucet() external {
        uint256 nextEligible = lastClaim[msg.sender] + FAUCET_COOLDOWN;
        if (lastClaim[msg.sender] != 0 && block.timestamp < nextEligible) {
            revert FaucetCooldown(nextEligible);
        }
        lastClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }
}
