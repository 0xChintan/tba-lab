// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {AdventurerNFT} from "../src/AdventurerNFT.sol";
import {Gold} from "../src/Gold.sol";
import {Items} from "../src/Items.sol";
import {Quest} from "../src/Quest.sol";

/// @notice Deploys all four companion contracts.
///
/// Usage (private key passed on the CLI — `0x` prefix optional):
///   forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY
///   forge script script/Deploy.s.sol:Deploy --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY
contract Deploy is Script {
    function run() external returns (address nft, address gold, address items, address quest) {
        vm.startBroadcast();

        AdventurerNFT _nft = new AdventurerNFT();
        Gold _gold = new Gold();
        Items _items = new Items();
        Quest _quest = new Quest();

        vm.stopBroadcast();

        nft = address(_nft);
        gold = address(_gold);
        items = address(_items);
        quest = address(_quest);

        console2.log("chainId            ", block.chainid);
        console2.log("AdventurerNFT      ", nft);
        console2.log("Gold               ", gold);
        console2.log("Items              ", items);
        console2.log("Quest              ", quest);
    }
}
