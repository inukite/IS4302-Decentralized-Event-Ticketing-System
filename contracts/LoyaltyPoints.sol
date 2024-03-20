// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoyaltyPoints {
    mapping(address => uint256) public lpBalances;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addLoyaltyPoints(address user, uint256 points) public onlyOwner {
        lpBalances[user] += points;
    }

    function subtractLoyaltyPoints(
        address user,
        uint256 points
    ) public onlyOwner {
        require(lpBalances[user] >= points, "Insufficient balance.");
        lpBalances[user] -= points;
    }

    // Other loyalty points management functions as needed
}
