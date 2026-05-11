// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Gold} from "../src/Gold.sol";

contract GoldTest is Test {
    Gold internal gold;
    address internal alice = makeAddr("alice");

    function setUp() public {
        gold = new Gold();
    }

    function test_faucet_mintsToCaller() public {
        vm.prank(alice);
        gold.faucet();
        assertEq(gold.balanceOf(alice), 1000 ether);
    }

    function test_faucet_revertsIfCalledWithinCooldown() public {
        vm.prank(alice);
        gold.faucet();
        vm.expectRevert(); // FaucetCooldown(uint256)
        vm.prank(alice);
        gold.faucet();
    }

    function test_faucet_succeedsAfterCooldown() public {
        vm.prank(alice);
        gold.faucet();
        vm.warp(block.timestamp + 1 hours + 1);
        vm.prank(alice);
        gold.faucet();
        assertEq(gold.balanceOf(alice), 2000 ether);
    }
}
