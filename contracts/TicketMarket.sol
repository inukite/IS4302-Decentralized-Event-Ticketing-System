// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ticket.sol";
import "./TicketToken.sol";
import "./PriorityQueue.sol";
import "./LoyaltyPoints.sol";

interface ITicket {
    function getPrice(uint256 ticketId) external view returns (uint256);
    function getPrevOwner(uint256 ticketId) external view returns (address);
    function getOwner(uint256 ticketId) external view returns (address);
    function getTicketState(
        uint256 ticketId
    ) external view returns (Ticket.TicketState);
    function transfer(uint256 ticketId, address newOwner) external;
}

contract TicketMarket {
    address public owner;
    ITicket public ticketContract;
    TicketToken public ticketTokenContract;
    uint256 public commissionFee = 0.01 ether;

    PriorityQueue public buyerQueue;
    LoyaltyPoints public loyaltyPoints;

    // Mapping from ticket ID to listing price
    mapping(uint256 => uint256) public listPrice;

    uint256[] private listedTickets; // To track listed ticket IDs

    // Event emitted when a ticket is listed for sale
    event TicketListed(uint256 ticketId, uint256 price);
    event TicketUnlisted(uint256 ticketId);
    event TicketSold(uint256 ticketId, address buyer, uint256 price);

    // Event emitted when a ticket is transferred
    event TicketTransferred(
        uint256 indexed id,
        address from,
        address to,
        uint256 price
    );

    constructor(
        address _ticketContract,
        uint256 fee
    ) //address _loyaltyPointsAddress
    {
        ticketContract = ITicket(_ticketContract);
        commissionFee = fee;
        owner = msg.sender;
        //loyaltyPoints = LoyaltyPoints(_loyaltyPointsAddress);
        //buyerQueue = new PriorityQueue();
    }

    // List a ticket for sale. Price needs to be >= value + fee
    function list(uint256 ticketId, uint256 price) public {
        require(price >= ticketContract.getPrice(ticketId) + commissionFee);
        require(msg.sender == ticketContract.getOwner(ticketId));
        emit TicketListed(ticketId, price);
        listPrice[ticketId] = price;
        listedTickets.push(ticketId); // Add ticket ID to the list of listed tickets
    }

    function unlist(uint256 ticketId) public {
        require(msg.sender == ticketContract.getOwner(ticketId));
        listPrice[ticketId] = 0;
        emit TicketUnlisted(ticketId); // Emit event for ticket unlisting

        // Find and remove the ticket ID from listedTickets array
        for (uint256 i = 0; i < listedTickets.length; i++) {
            if (listedTickets[i] == ticketId) {
                // Move the last element to the current index
                listedTickets[i] = listedTickets[listedTickets.length - 1];
                // Remove the last element
                listedTickets.pop();
                break; // Exit the loop once the ticket ID is removed
            }
        }
    }

    // Get price of ticket
    function getTicketPrice(uint256 ticketId) public view returns (uint256) {
        return listPrice[ticketId];
    }

    // Get the commission fee
    function getCommission() public view returns (uint256) {
        return commissionFee;
    }

    //Addition of PriorityQueue
    //add buyers to the PriorityQueue instead of immediately processing the purchase
    function requestTicketPurchase(address buyer) public {
        uint points = loyaltyPoints.getPoints(buyer);
        buyerQueue.enqueue(buyer, points);
    }

    function processTicketPurchases() public {
        require(msg.sender == owner, "Only the owner can process purchases");

        while (!buyerQueue.isEmpty() && thereAreTicketsAvailable()) {
            address buyer = buyerQueue.dequeue();

            // For simplicity, we attempt to purchase the first available ticket.
            uint256 ticketId = listedTickets[0];

            uint256 ticketPrice = listPrice[ticketId];

            // Transfer the ticket and emit an event.
            ticketContract.transfer(ticketId, buyer);
            emit TicketSold(ticketId, buyer, ticketPrice);

            // Remove the ticket from the listing.
            unlist(ticketId);
        }
    }

    // Buy the ticket at the requested price
    function buy(uint256 ticketId) public payable {
        // Check if the ticket is listed for sale
        require(listPrice[ticketId] != 0, "Ticket must be listed for sale");
        // Check if payment is enough
        require(msg.value >= listPrice[ticketId], "Insufficient payment");

        address ticketOwner = ticketContract.getOwner(ticketId);
        require(msg.sender != ticketOwner, "Buyer already owns the ticket");

        address payable recipient = payable(
            ticketContract.getPrevOwner(ticketId)
        );

        // Calculate the amount to transfer to the ticket owner after deducting the commission fee
        uint256 amountToTransfer = listPrice[ticketId] - commissionFee;
        // Transfer payment to the ticket owner after deducting the commission fee
        recipient.transfer(amountToTransfer);

        // Transfer ownership in the Ticket contract
        ticketContract.transfer(ticketId, msg.sender);

        // Emit event for ticket purchase
        emit TicketSold(ticketId, msg.sender, listPrice[ticketId]);

        // Transfer ownership of the ticket
        ticketContract.transfer(ticketId, msg.sender);

        // Remove the ticket from the listing after purchase
        listPrice[ticketId] = 0;
    }

    function thereAreTicketsAvailable() public view returns (bool) {
        uint256 availableTickets = 0;
        for (uint256 i = 0; i < listedTickets.length; i++) {
            if (listPrice[i] > 0) {
                availableTickets++;
            }
        }
        return availableTickets > 0;
    }

    // get price of ticket
    function checkPrice(uint256 id) public view returns (uint256) {
        return listPrice[id];
    }
}
