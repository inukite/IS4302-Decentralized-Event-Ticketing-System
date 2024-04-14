// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title A contract for managing migrations in a Truffle project
 * @dev This contract keeps track of which migrations were done on the current network.
 **/
contract Migrations {
    address public owner; // Address of the contract owner
    uint public last_completed_migration; // Tracks the last completed migration

    /**
     * @notice Restricts function calls to the contract owner
     **/
    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    /**
     * @notice Initializes the contract setting the deployer as the owner
     **/
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Updates the number of the last completed migration
     * @param completed The migration number that has just been completed
     **/
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
}
