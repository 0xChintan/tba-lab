// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Quest
/// @notice Receives "quest completed" calls and emits an event tagged with
///         `msg.sender`. When a TBA executes `recordQuest` via the SDK's
///         `execute()` method, `msg.sender` resolves to the TBA itself —
///         proving the token-bound account was the originator.
/// @dev    Idempotent per (caller, questId) pair: a TBA can record each
///         quest id at most once.
contract Quest {
    /// @notice Emitted when an adventurer's TBA records a quest completion.
    /// @param adventurerTba The token-bound account that called `recordQuest`.
    /// @param questId       The quest identifier.
    /// @param timestamp     Block timestamp at recording.
    event QuestCompleted(address indexed adventurerTba, uint256 indexed questId, uint256 timestamp);

    /// @notice `completed[tba][questId]` is true once a TBA has recorded the quest.
    mapping(address => mapping(uint256 => bool)) public completed;

    /// @notice Running count of distinct quests an adventurer has completed.
    mapping(address => uint256) public completedCount;

    /// @notice Reverted when a TBA tries to record the same quest twice.
    /// @param adventurer The TBA attempting the duplicate record.
    /// @param questId    The quest id that's already been completed.
    error AlreadyCompleted(address adventurer, uint256 questId);

    /// @notice Record that `msg.sender` (the TBA) has completed `questId`.
    /// @param  questId The quest identifier to record.
    function recordQuest(uint256 questId) external {
        if (completed[msg.sender][questId]) revert AlreadyCompleted(msg.sender, questId);
        completed[msg.sender][questId] = true;
        completedCount[msg.sender] += 1;
        emit QuestCompleted(msg.sender, questId, block.timestamp);
    }
}
