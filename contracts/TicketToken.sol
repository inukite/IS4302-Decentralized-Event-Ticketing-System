// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";

/**
 * @title A contract for managing Ticket Tokens (TT) within the Decentralized Event Ticketing System.
 **/
contract TicketToken {
    ERC20 public erc20Contract; // The ERC20 token contract for TicketToken
    address private owner; // Owner of the contract

    /**
     * @notice Constructor that initializes the ERC20 token upon deployment
     **/
    constructor() {
        ERC20 e = new ERC20();
        erc20Contract = e;
        owner = msg.sender; // Setting the owner as the contract deployer
    }

    /**
     * @notice Allows users to exchange ETH for Ticket Tokens (TT)
     * @dev Mints new tokens based on the amount of ETH sent to the function
     **/
    function getCredit() public payable {
        uint256 amt = msg.value / 10000000000000000; // Calculate the number of TTs eligible for minting
        require(amt > 0, "You must send enough ETH to mint at least one TT");
        erc20Contract.mint(msg.sender, amt); // Minting the tokens directly to the user
    }

    /**
     * @notice Checks the balance of the caller in the ERC20 contract
     * @return uint256 The number of tokens the caller has
     **/
    function checkCredit() public view returns (uint256) {
        return erc20Contract.balanceOf(msg.sender);
    }

    /**
     * @notice Checks the balance of any account in the ERC20 contract
     * @param account The address to query the balance for
     * @return uint256 The number of tokens the account has
     **/
    function balanceOf(address account) public view returns (uint256) {
        return erc20Contract.balanceOf(account);
    }
}
