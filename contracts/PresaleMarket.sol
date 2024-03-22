// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ticket.sol";
import "./TicketToken.sol";
import "./PriorityQueue.sol";
import "./LoyaltyPoints.sol";


contract PresaleMarket {
    address _owner = msg.sender;
    uint256 public commissionFee;
    Ticket public ticketContract;


}