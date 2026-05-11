// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Items} from "../src/Items.sol";

contract ItemsTest is Test {
    Items internal items;
    address internal alice = makeAddr("alice");

    function setUp() public {
        items = new Items();
    }

    function test_mintBatch_assignsBalances() public {
        uint256[] memory ids = new uint256[](3);
        uint256[] memory amounts = new uint256[](3);
        ids[0] = 1; ids[1] = 2; ids[2] = 3;
        amounts[0] = 10; amounts[1] = 20; amounts[2] = 30;
        vm.prank(alice);
        items.mintBatch(ids, amounts);
        assertEq(items.balanceOf(alice, 1), 10);
        assertEq(items.balanceOf(alice, 2), 20);
        assertEq(items.balanceOf(alice, 3), 30);
    }

    function test_mint_singleId() public {
        vm.prank(alice);
        items.mint(7, 5);
        assertEq(items.balanceOf(alice, 7), 5);
    }
}
