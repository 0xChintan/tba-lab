// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {AdventurerNFT} from "../src/AdventurerNFT.sol";

contract AdventurerNFTTest is Test {
    AdventurerNFT internal nft;
    address internal alice = makeAddr("alice");

    function setUp() public {
        nft = new AdventurerNFT();
    }

    function test_mint_assignsSequentialIds() public {
        vm.prank(alice);
        uint256 id0 = nft.mint();
        vm.prank(alice);
        uint256 id1 = nft.mint();
        assertEq(id0, 0);
        assertEq(id1, 1);
        assertEq(nft.ownerOf(0), alice);
        assertEq(nft.ownerOf(1), alice);
        assertEq(nft.balanceOf(alice), 2);
    }

    function test_metadata() public view {
        assertEq(nft.name(), "Adventurer");
        assertEq(nft.symbol(), "ADV");
    }
}
