// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ticket.sol";

contract TicketMarket {
    Ticket ticketContract;
    uint256 public commissionFee;
    address public owner;

    mapping(uint256 => uint256) public listPrice;

    // Event emitted when a ticket is listed for sale
    event TicketListed(uint256 indexed id, uint256 price);

    // Event emitted when a ticket is unlisted
    event TicketUnlisted(uint256 indexed id);

    // Event emitted when a ticket is bought
    event TicketBought(uint256 indexed id, address buyer, uint256 price);

    // Event emitted when a ticket is transferred
    event TicketTransferred(uint256 indexed id, address from, address to, uint256 price);

    constructor(Ticket ticketAddress, uint256 fee) {
        ticketContract = ticketAddress;
        commissionFee = fee;
        owner = msg.sender;
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
        emit TicketListed(id, price); // Emit event for ticket listing
    }

    function unlist(uint256 id) public {
        require(
            msg.sender == ticketContract.getPrevOwner(id),
            "Only the previous owner can unlist the ticket"
        );
        listPrice[id] = 0;
        emit TicketUnlisted(id); // Emit event for ticket unlisting
    }

    // Get price of ticket
    function getTicketPrice(uint256 id) public view returns (uint256) {
        return listPrice[id];
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
        ticketContract.transfer(id, msg.sender, listPrice[id]);

        // Remove the ticket from the listing after purchase
        listPrice[id] = 0;
    }

    /*function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }*/
}