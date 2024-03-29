// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./TicketToken.sol";
import "./PresaleMarket.sol";

contract Ticket {
    enum TicketState {
        Active,
        Redeemed,
        Frozen
    }

    struct ticket {
        uint256 ticketId;
        uint256 concertId;
        string concertName;
        string concertVenue;
        uint256 concertDate;
        uint256 ticketSectionNo;
        uint256 ticketSeatNo;
        TicketState ticketState;
        address owner;
        address prevOwner;
        uint256 price;
        uint256 resellPrice;
    }

    mapping(uint256 => ticket) public tickets;

    event TicketCreated(uint256 indexed ticketId, address owner);
    event TicketRedeemed(uint256 ticketId);
    event TicketFrozen(uint256 ticketId);
    event TicketBought(uint256 ticketId, address newOwner, uint256 price);

    TicketToken public ticketToken;
    uint256 public ticketCounter = 0;
    address public owner;
    address public presaleMarketAddress;

    function setPresaleMarketAddress(address _presaleMarketAddress) public {
        presaleMarketAddress = _presaleMarketAddress;
    }

    constructor(address _ticketToken) {
        owner = msg.sender;
        ticketToken = TicketToken(_ticketToken);
    }

    modifier atState(uint256 _ticketId, TicketState _state) {
        require(
            tickets[_ticketId].ticketState == _state,
            "Ticket at wrong state, action not performed"
        );
        _;
    }

    modifier validTicketId(uint256 ticketId) {
        require(ticketId < ticketCounter, "Invalid ticket ID");
        _;
    }

    // function to create a new ticket and add to the tickets map
    function createTicket(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        uint256 ticketSectionNo,
        uint256 ticketSeatNo,
        uint256 price
    ) public onlyOwnerOrMarket returns (uint256) {
        ticket memory newTicket = ticket({
            ticketId: ticketCounter,
            concertId: concertId,
            concertName: concertName,
            concertVenue: concertVenue,
            concertDate: concertDate,
            ticketSectionNo: ticketSectionNo,
            ticketSeatNo: ticketSeatNo,
            ticketState: TicketState.Active,
            prevOwner: address(0),
            owner: msg.sender, // Assuming the owner creates the ticket
            price: price,
            resellPrice: 0
        });

        tickets[ticketCounter++] = newTicket;
        emit TicketCreated(ticketCounter - 1, msg.sender);
        return ticketCounter - 1; // Return the ID of the newly created ticket
    }

    // Modifier to ensure a function is callable only by its owner
    modifier ownerOnly(uint256 ticketId) {
        require(tickets[ticketId].owner == msg.sender);
        _;
    }

    // Modifier to ensure function can be called by presaleMarket as well
    modifier onlyOwnerOrMarket() {
        require(
            msg.sender == owner || msg.sender == presaleMarketAddress,
            "Unauthorized"
        );
        _;
    }

    function redeemTicket(uint256 _ticketId) public validTicketId(_ticketId) {
        ticket storage myTicket = tickets[_ticketId];

        // Ensure the ticket is active
        require(
            myTicket.ticketState == TicketState.Active,
            "Ticket is not active."
        );

        // Update the ticket state to Redeemed
        myTicket.ticketState = TicketState.Redeemed;
        emit TicketRedeemed(_ticketId);
    }

    function freezeTicket(
        uint256 _ticketId
    ) external atState(_ticketId, TicketState.Active) validTicketId(_ticketId) {
        tickets[_ticketId].ticketState = TicketState.Frozen;
        emit TicketFrozen(_ticketId);
    }

    function transfer(
        uint256 ticketId,
        address newOwner,
        uint256 resellPrice
    ) external validTicketId(ticketId) {
        require(
            tickets[ticketId].ticketState == TicketState.Active,
            "Ticket cannot be transferred in its current state"
        );

        tickets[ticketId].prevOwner = tickets[ticketId].owner;
        tickets[ticketId].owner = newOwner;
        tickets[ticketId].price = resellPrice;

        emit TicketBought(ticketId, newOwner, tickets[ticketId].price);
    }

    // Getter Functions for Ticket attributes
    function getTicketId(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].ticketId;
    }

    function getConcertId(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].concertId;
    }

    function getConcertName(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (string memory) {
        return tickets[ticketId].concertName;
    }

    function getConcertVenue(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (string memory) {
        return tickets[ticketId].concertVenue;
    }

    function getConcertDate(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].concertDate;
    }

    function getTicketSectionNo(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].ticketSectionNo;
    }

    function getTicketSeatNo(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].ticketSeatNo;
    }

    function getTicketState(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (TicketState) {
        return tickets[ticketId].ticketState;
    }

    function getOwner(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (address) {
        return tickets[ticketId].owner;
    }

    function getPrevOwner(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (address) {
        return tickets[ticketId].prevOwner;
    }

    function getPrice(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (uint256) {
        return tickets[ticketId].price;
    }
}
