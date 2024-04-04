// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LoyaltyPoints.sol";

contract FutureConcertPoll {
    LoyaltyPoints public loyaltyPointsContract;

    // Mapping of concert option IDs to their vote counts
    mapping(uint256 => uint256) public concertVotes;

    // Mapping of user votes (user address => (concert option ID => points spent))
    mapping(address => mapping(uint256 => uint256)) public userVotes;

    event VoteCasted(address voter, uint256 concertOptionId, uint256 points);

    constructor(LoyaltyPoints _loyaltyPointsContract) {
        loyaltyPointsContract = _loyaltyPointsContract;
    }

    // Function for users to cast votes
    function castVote(uint256 concertOptionId, uint256 points) external {
        require(points > 0, "Points must be greater than 0");

        // Ensure the user has enough loyalty points to cast this vote
        uint256 userPoints = loyaltyPointsContract.getPoints(msg.sender);
        require(userPoints >= points, "Not enough loyalty points");

        loyaltyPointsContract.subtractLoyaltyPoints(msg.sender, points);

        // Record the user's vote
        userVotes[msg.sender][concertOptionId] += points;
        concertVotes[concertOptionId] += points;

        emit VoteCasted(msg.sender, concertOptionId, points);
    }

    // Function to check the total votes for a concert option
    function getTotalVotes(uint256 concertOptionId) public view returns (uint256) {
        return concertVotes[concertOptionId];
    }

    // Function to check the votes casted by a user for a concert option
    function getUserVotes(address user, uint256 concertOptionId) public view returns (uint256) {
        return userVotes[user][concertOptionId];
    }
}
