// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ticket.sol";
import "./PriorityQueue.sol";
import "./LoyaltyPoints.sol";

contract TicketMarket {
    Ticket ticketContract;
    uint256 public commissionFee;
    address public owner;
    PriorityQueue public buyerQueue;
    LoyaltyPoints public loyaltyPoints;

    mapping(uint256 => uint256) public listPrice;

    uint256[] private listedTickets; // To track listed ticket IDs

    // Event emitted when a ticket is listed for sale
    event TicketListed(uint256 indexed id, uint256 price);

    // Event emitted when a ticket is unlisted
    event TicketUnlisted(uint256 indexed id);

    // Event emitted when a ticket is bought
    event TicketBought(uint256 indexed id, address buyer, uint256 price);

    // Event emitted when a ticket is transferred
    event TicketTransferred(
        uint256 indexed id,
        address from,
        address to,
        uint256 price
    );

    constructor(
        Ticket ticketAddress,
        uint256 fee,
        address _loyaltyPointsAddress
    ) {
        ticketContract = ticketAddress;
        commissionFee = fee;
        owner = msg.sender;
        loyaltyPoints = LoyaltyPoints(_loyaltyPointsAddress);
        buyerQueue = new PriorityQueue();
    }

    // List a ticket for sale. Price needs to be >= value + fee
    function list(uint256 id, uint256 price) public {
        require(
            price >= ticketContract.getPrice(id) + commissionFee,
            "Price must cover the ticket price and commission fee"
        );
        require(
            msg.sender == ticketContract.getPrevOwner(id),
            "Only the previous owner can list the ticket"
        );
        listPrice[id] = price;
        listedTickets.push(id); // Add ticket ID to the list of listed tickets
        emit TicketListed(id, price); // Emit event for ticket listing
    }

    function unlist(uint256 id) public {
        require(
            msg.sender == ticketContract.getPrevOwner(id),
            "Only the previous owner can unlist the ticket"
        );
        listPrice[id] = 0;
        emit TicketUnlisted(id); // Emit event for ticket unlisting

        // Remove the ticket ID from listedTickets
        for (uint256 i = 0; i < listedTickets.length; i++) {
            if (listedTickets[i] == id) {
                listedTickets[i] = listedTickets[listedTickets.length - 1]; // Move the last element to the current index
                listedTickets.pop(); // Remove the last element
                break; // Exit the loop once the ticket ID is removed
            }
        }
    }

    // Get price of ticket
    function getTicketPrice(uint256 id) public view returns (uint256) {
        return listPrice[id];
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
            emit TicketBought(ticketId, buyer, ticketPrice);

            // Remove the ticket from the listing.
            unlist(ticketId);
        }
    }

    // Buy the ticket at the requested price
    function buy(uint256 id) public payable {
        // Check if the ticket is listed for sale
        require(listPrice[id] != 0, "Ticket must be listed for sale");
        // Check if payment is enough
        require(msg.value >= listPrice[id], "Insufficient payment");

        address payable recipient = payable(ticketContract.getPrevOwner(id));

        // Calculate the amount to transfer to the ticket owner after deducting the commission fee
        uint256 amountToTransfer = listPrice[id] - commissionFee;
        // Transfer payment to the ticket owner after deducting the commission fee
        recipient.transfer(amountToTransfer);

        // Emit event for ticket purchase
        emit TicketBought(id, msg.sender, listPrice[id]);

        // Transfer ownership of the ticket
        ticketContract.transfer(id, msg.sender);

        // Remove the ticket from the listing after purchase
        listPrice[id] = 0;
    }

    /*function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }*/

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
