// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./TicketToken.sol";
import "./PresaleMarket.sol";
import "./Lottery.sol";

/**
 * @title A contract for managing event tickets and their lifecycle states
 **/
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
    TicketToken public ticketToken;
    uint256 public ticketCounter = 0;
    address public owner;
    address public presaleMarketAddress;
    address public lotteryAddress;

    event TicketCreated(uint256 indexed ticketId, address owner);
    event TicketRedeemed(uint256 ticketId);
    event TicketFrozen(uint256 ticketId);
    event TicketBought(uint256 ticketId, address newOwner, uint256 price);

    /**
     * @notice Modifier to ensure only the ticket owner can call certain functions
     **/
    modifier ownerOnly(uint256 ticketId) {
        require(tickets[ticketId].owner == msg.sender);
        _;
    }

    /**
     * @notice Modifier to ensure only the ticket owner, presale market, or lottery can call certain functions
     **/
    modifier onlyOwnerOrMarketorLottery() {
        require(
            msg.sender == owner ||
                msg.sender == presaleMarketAddress ||
                msg.sender == lotteryAddress,
            "Unauthorized"
        );
        _;
    }

    /**
     * @notice Sets the presale market address authorized to manage tickets
     * @param _presaleMarketAddress The address to be set as the presale market
     **/
    function setPresaleMarketAddress(address _presaleMarketAddress) public {
        presaleMarketAddress = _presaleMarketAddress;
    }

    /**
     * @notice Sets the lottery address authorized to manage tickets
     * @param _lotteryAddress The address to be set as the lottery
     **/
    function setLotteryAddress(address _lotteryAddress) public {
        lotteryAddress = _lotteryAddress;
    }

    /**
     * @notice Constructor sets the ticket token contract address
     * @param _ticketToken The address of the TicketToken contract
     **/
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

    /**
     * @notice Creates a new ticket and stores it in the mapping
     * @param concertId ID of the concert
     * @param concertName Name of the concert
     * @param concertVenue Venue of the concert
     * @param concertDate Date of the concert
     * @param ticketSectionNo Section number of the seat
     * @param ticketSeatNo Seat number
     * @param price Initial price of the ticket
     * @return The ID of the newly created ticket
     **/
    function createTicket(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        uint256 ticketSectionNo,
        uint256 ticketSeatNo,
        uint256 price
    ) public onlyOwnerOrMarketorLottery returns (uint256) {
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

    /**
     * @notice Redeems a ticket, changing its state to Redeemed
     * @param _ticketId The ID of the ticket to redeem
     **/
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

    /**
     * @notice Freezes a ticket, changing its state to Frozen
     * @param _ticketId The ID of the ticket to freeze
     **/
    function freezeTicket(
        uint256 _ticketId
    ) external atState(_ticketId, TicketState.Active) validTicketId(_ticketId) {
        tickets[_ticketId].ticketState = TicketState.Frozen;
        emit TicketFrozen(_ticketId);
    }

    /**
     * @notice Transfers ownership of a ticket to a new owner
     * @param ticketId The ID of the ticket to transfer
     * @param newOwner The address of the new owner
     * @param resellPrice The resale price of the ticket
     **/
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

    /**
     * @notice Checks if a ticket has been redeemed
     * @param ticketId The ID of the ticket to check
     * @return True if the ticket has been redeemed, false otherwise
     **/
    function isRedeemed(
        uint256 ticketId
    ) public view validTicketId(ticketId) returns (bool) {
        return tickets[ticketId].ticketState == TicketState.Redeemed;
    }

    // Getter Functions for Ticket attributes below

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
