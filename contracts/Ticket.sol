// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "./ERC20.sol";

contract Ticket {

    // Different states of the ticket
    enum TicketState {
        Active,            // Active = the ticket still not used, can be resold
        Redeemed,          // Redeemed = the ticket is redeemed, cannot be resold
        Frozen             // Frozen = the concert has ended, ticket is frozen, cannot be resold
    }

    struct ticket {
        uint256 ticketId;
        uint256 concertId;
        string concertName;
        string concertVenue;
        uint256 concertDate;
        string ticketCategory;
        uint256 ticketSectionNo;
        uint256 ticketSeatNo;
        TicketState ticketState;
        address owner;
        address prevOwner;
        uint256 price; // New field to store ticket price
    }

    mapping(uint256 => ticket) public tickets;
    mapping(address => mapping(uint256 => bool)) public ownedTickets;

    TicketState public ticketState;
    uint256 public ticketCounter = 0;
    address public organizer;
    ERC20 public detToken;

    event TicketPurchased(address indexed buyer, uint256 indexed ticketId, uint256 price);
    event TicketListedForSale(uint256 indexed ticketId, uint256 price);
    event TicketBought(uint256 indexed ticketId, address indexed buyer, uint256 price);
    event TicketRedeemed(uint256 indexed ticketId, address indexed redeemer);

    constructor(address _detToken) {
        organizer = msg.sender;
        detToken = ERC20(_detToken);
    }

    function purchaseTicket(
        uint256 _concertId,
        string memory _concertName,
        string memory _concertVenue,
        uint256 _concertDate,
        string memory _ticketCategory,
        uint256 _ticketSectionNo,
        uint256 _ticketSeatNo,
        uint256 _price
    ) external {
        ticketCounter++;
        tickets[ticketCounter] = ticket({
            ticketId: ticketCounter,
            concertId: _concertId,
            concertName: _concertName,
            concertVenue: _concertVenue,
            concertDate: _concertDate,
            ticketCategory: _ticketCategory,
            ticketSectionNo: _ticketSectionNo,
            ticketSeatNo: _ticketSeatNo,
            ticketState: TicketState.Active,
            owner: msg.sender,
            prevOwner: msg.sender,
            price: _price
        });
        ownedTickets[msg.sender][ticketCounter] = true;
        emit TicketPurchased(msg.sender, ticketCounter, _price);
    }

    // Function Modifiers

    modifier onlyOrganizer() {
        require( msg.sender == organizer, "Only the concert organizer can call this function");
        _;
    }

    // Modifier to ensure that the ticketId is valid doesn't exceed count of total tickets (ticketCounter) 
    modifier validTicketId(uint256 ticketId) {
        require(ticketId < ticketCounter);
        _;
    }

    function listTicketForSale(uint256 _ticketId, uint256 _price) external {
        require(ownedTickets[msg.sender][_ticketId], "You don't own this ticket");
        require(tickets[_ticketId].ticketState == TicketState.Active, "Ticket is not eligible for resale");
        tickets[_ticketId].price = _price;
        emit TicketListedForSale(_ticketId, _price);
    }

    function buyTicket(uint256 _ticketId) external payable {
        ticket storage ticket = tickets[_ticketId]; // Correct variable declaration

        require(ticket.ticketState == TicketState.Active, "Ticket is not available for purchase");
        require(msg.value >= ticket.price, "Insufficient funds");
        require(ticket.owner != msg.sender, "You already own this ticket");
        payable(ticket.owner).transfer(ticket.price); // Transfer funds to seller using payable address
        ticket.owner = msg.sender;
        ticket.ticketState = TicketState.Redeemed;
        ownedTickets[msg.sender][_ticketId] = true;
        emit TicketBought(_ticketId, msg.sender, ticket.price);
    }

    function redeemTicket(uint256 _ticketId) external {
        require(ownedTickets[msg.sender][_ticketId], "You don't own this ticket");
        ticket storage ticket = tickets[_ticketId]; // Correct variable declaration

        // Once the ticket is redeemed, the ticketState is then set to "Redeemed"
        ticket.ticketState = TicketState.Redeemed;
        detToken.transfer(msg.sender, calculateDETSReward(ticket.ticketCategory)); // Transfer tokens using ERC20 contract instance
        emit TicketRedeemed(_ticketId, msg.sender);
}

    function calculateDETSReward(
        string memory _ticketCategory
    ) internal view returns (uint256) {
        // You can implement your logic for calculating DETS reward based on ticket category here
        // For demonstration purposes, let's assume a fixed reward for simplicity
        uint256 reward = 100; // Arbitrary value, you should adjust it according to your requirement
        return reward;
    }


    // Getter Functions for Ticket attributes

    function getTicketId(uint256 ticketId) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].ticketId;
    }

    function getConcertId(uint256 ticketId) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].concertId;
    }

    function getConcertName(uint256 ticketId) public view validTicketId(ticketId) returns (string memory) {
        return tickets[ticketId].concertName;
    }

    function getConcertVenue(uint256 ticketId) public view validTicketId(ticketId) returns (string memory) {
        return tickets[ticketId].concertVenue;
    }

    function getConcertDate(uint256 ticketId) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].concertDate;
    }

    function getTicketCategory(uint256 ticketId) public view validTicketId(ticketId) returns (string memory) {
        return tickets[ticketId].ticketCategory;
    }

    function getTicketSectionNo(uint256 ticketId) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].ticketSectionNo;
    }

    function getTicketSeatNo(uint256 ticketId) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].ticketSeatNo;
    }

    function getTicketState(uint256 ticketId) public view validTicketId(ticketId) returns (TicketState) {
        return tickets[ticketId].ticketState;
    }

    function getOwner(uint256 ticketId) public view validTicketId(ticketId) returns (address) {
        return tickets[ticketId].owner;
    }

    function getPrevOwner(uint256 ticketId) public view validTicketId(ticketId) returns (address) {
        return tickets[ticketId].prevOwner;
    }

    function getPrice(uint256 ticketId) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].price;
    }
}
