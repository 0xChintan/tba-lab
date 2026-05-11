// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Quest} from "../src/Quest.sol";

contract QuestTest is Test {
    Quest internal quest;
    address internal tba = makeAddr("tba");

    event QuestCompleted(address indexed adventurerTba, uint256 indexed questId, uint256 timestamp);

    function setUp() public {
        quest = new Quest();
    }

    function test_recordQuest_emitsEvent() public {
        vm.expectEmit(true, true, false, false, address(quest));
        emit QuestCompleted(tba, 42, 0);
        vm.prank(tba);
        quest.recordQuest(42);
        assertTrue(quest.completed(tba, 42));
        assertEq(quest.completedCount(tba), 1);
    }

    function test_recordQuest_revertsOnDuplicate() public {
        vm.prank(tba);
        quest.recordQuest(42);
        vm.expectRevert();
        vm.prank(tba);
        quest.recordQuest(42);
    }

    function test_recordQuest_tracksIndependentTbas() public {
        address otherTba = makeAddr("otherTba");
        vm.prank(tba);
        quest.recordQuest(1);
        vm.prank(otherTba);
        quest.recordQuest(1);
        assertEq(quest.completedCount(tba), 1);
        assertEq(quest.completedCount(otherTba), 1);
    }
}
