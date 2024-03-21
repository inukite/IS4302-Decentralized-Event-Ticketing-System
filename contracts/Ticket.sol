// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./TicketToken.sol";

contract Ticket {
    enum TicketState {
        Active,
        Redeemed,
        Frozen
    }

    struct TicketDetail {
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
        uint256 price;
    }

    TicketDetail[] public tickets;
    mapping(uint256 => address) public ticketToOwner;
    mapping(address => uint256) ownerTicketCount;

    event TicketCreated(uint256 ticketId, address owner);
    event TicketRedeemed(uint256 ticketId);
    event TicketFrozen(uint256 ticketId);
    event TicketBought(uint256 ticketId, address newOwner, uint256 price);

    TicketToken public ticketToken;
    uint256 public ticketCounter = 0;
    address public organizer;

    constructor(address _ticketToken) {
        organizer = msg.sender;
        ticketToken = TicketToken(_ticketToken);
    }

    modifier onlyOrganizer() {
        require(
            msg.sender == organizer,
            "Only the concert organizer can call this function"
        );
        _;
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

    function createTicket(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        string memory ticketCategory,
        uint256 ticketSectionNo,
        uint256 ticketSeatNo,
        uint256 price
    ) external onlyOrganizer {
        tickets.push(
            TicketDetail({
                ticketId: ticketCounter,
                concertId: concertId,
                concertName: concertName,
                concertVenue: concertVenue,
                concertDate: concertDate,
                ticketCategory: ticketCategory,
                ticketSectionNo: ticketSectionNo,
                ticketSeatNo: ticketSeatNo,
                ticketState: TicketState.Active,
                owner: organizer,
                prevOwner: address(0),
                price: price
            })
        );
        emit TicketCreated(ticketCounter, organizer);
        ticketCounter++;
    }

    function redeemTicket(uint256 _ticketId) public {
        require(_ticketId < tickets.length, "Ticket does not exist.");
        TicketDetail storage ticket = tickets[_ticketId];

        // Ensure the ticket is active
        require(
            ticket.ticketState == TicketState.Active,
            "Ticket is not active."
        );

        // Update the ticket state to Redeemed
        ticket.ticketState = TicketState.Redeemed;

        // Emit the redemption event
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
        address newOwner
    ) external validTicketId(ticketId) {
        require(
            msg.sender == tickets[ticketId].owner,
            "Only the ticket owner can transfer"
        );
        require(
            tickets[ticketId].ticketState == TicketState.Active,
            "Ticket cannot be transferred in its current state"
        );

        tickets[ticketId].prevOwner = tickets[ticketId].owner;
        tickets[ticketId].owner = newOwner;

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

    function getTicketCategory(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (string memory) {
        return tickets[ticketId].ticketCategory;
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
