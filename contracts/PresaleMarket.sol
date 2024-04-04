// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriorityQueue.sol";
import "./Ticket.sol";
import "./LoyaltyPoints.sol";

contract PresaleMarket {
    Ticket public ticketContract;
    address public organizer;
    PriorityQueue public priorityQueue;
    LoyaltyPoints public loyaltyPoints;
    uint256 public ticketCounter;

    struct EventDetails {
        uint256 concertId;
        string concertName;
        string concertVenue;
        uint256 concertDate;
        uint256 price;
        bool ticketsReleased;
    }

    // Mapping from concert ID to event details.
    mapping(uint256 => EventDetails) public events;

    // Mapping from concert ID to list of ticket IDs.
    mapping(uint256 => uint256[]) public concertToTicketIds;

    constructor(
        address _priorityQueueAddress,
        address _loyaltyPointsAddress,
        address _ticketContractAddress
    ) {
        organizer = msg.sender;
        priorityQueue = PriorityQueue(_priorityQueueAddress);
        loyaltyPoints = LoyaltyPoints(_loyaltyPointsAddress);
        ticketContract = Ticket(_ticketContractAddress);
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Caller is not the organizer");
        _;
    }

    event EventCreated(
        uint256 indexed concertId,
        string concertName,
        string concertVenue,
        uint256 concertDate,
        uint256 price
    );

    event TicketAssignedToEvent(
        uint256 indexed concertId,
        uint256 indexed ticketId
    );

    event TicketPurchased(uint256 indexed ticketId, address indexed buyer);
    event CorrectPaymentAmount(uint256 ticketPrice);
    event TicketTransferred(address buyer, uint256 concertId);
    event TicketRedeemed(uint256 indexed ticketId, address indexed redeemer);

    // Create an event without immediately creating tickets
    function createEvent(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        uint256 price
    ) public onlyOrganizer {
        EventDetails memory newEvent = EventDetails({
            concertId: concertId,
            concertName: concertName,
            concertVenue: concertVenue,
            concertDate: concertDate,
            price: price,
            ticketsReleased: false
        });

        events[concertId] = newEvent;
        emit EventCreated(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            price
        );
    }

    // Create ticket and automatically associate tickets with their event
    function createTicketAndAddToEvent(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        uint256 ticketSectionNo,
        uint256 ticketSeatNo,
        uint256 price
    ) public onlyOrganizer returns (uint256) {
        // Ensure the event exists
        require(events[concertId].concertDate != 0, "Event does not exist.");

        uint256 newTicketId = ticketContract.createTicket(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            ticketSectionNo,
            ticketSeatNo,
            price
        );

        concertToTicketIds[concertId].push(newTicketId);
        emit TicketAssignedToEvent(concertId, newTicketId);
        return newTicketId;
    }

    function releaseTicket(uint256 concertId) public onlyOrganizer {
        require(
            block.timestamp >= events[concertId].concertDate - 1 weeks,
            "Tickets can only be released 1 week before the event."
        );
        require(
            !events[concertId].ticketsReleased,
            "Tickets for this event have already been released."
        );

        require(events[concertId].concertDate != 0, "Event does not exist.");

        EventDetails storage eventDetail = events[concertId];
        eventDetail.ticketsReleased = true;
    }

    // The buyTicket function allowing users with the highest priority to purchase tickets
    function buyTicket(uint256 concertId, uint256 ticketId) external payable {
        require(
            events[concertId].ticketsReleased,
            "Tickets not yet released for this event."
        );

        (address highestPriorityBuyer, ) = priorityQueue.peekHighestPriority();
        require(
            msg.sender == highestPriorityBuyer,
            "You do not have the highest priority to buy a ticket."
        );

        uint256 ticketPrice = ticketContract.getPrice(ticketId);
        require(msg.value == ticketPrice, "Incorrect payment amount.");

        ticketContract.transfer(ticketId, msg.sender, ticketPrice);
        emit TicketPurchased(ticketId, msg.sender);

        loyaltyPoints.addLoyaltyPoints(msg.sender, 10); //  Award 10 loyalty points per ticket purchase

        // Include voting system here

        priorityQueue.dequeue(); // Remove the buyer with the highest priority after the purchase
    }

    // Redeem a ticket for an event
    function redeemInPresaleMarket(uint256 ticketId) external {
        require(
            ticketContract.getOwner(ticketId) == msg.sender,
            "You do not own this ticket"
        );

        // Retrieve ticket details for verification
        uint256 concertDate = ticketContract.getConcertDate(ticketId);

        // Ensure the event is happening today
        require(
            block.timestamp >= concertDate &&
                block.timestamp < concertDate + 1 days,
            "This ticket can't be redeemed today"
        );

        // Check if the ticket has already been redeemed
        require(
            !ticketContract.isRedeemed(ticketId),
            "Ticket has already been redeemed"
        );

        ticketContract.redeemTicket(ticketId);

        // Award loyalty points
        loyaltyPoints.addLoyaltyPoints(msg.sender, 10); // Awarding 10 loyalty points whenever the user redeems the ticket

        emit TicketRedeemed(ticketId, msg.sender);
    }

    //Getters
    function getEventDetails(
        uint256 _concertId
    )
        public
        view
        returns (
            uint256 concertId,
            string memory concertName,
            string memory concertVenue,
            uint256 concertDate,
            uint256 price,
            bool ticketsReleased
        )
    {
        EventDetails storage eventDetail = events[_concertId];
        return (
            eventDetail.concertId,
            eventDetail.concertName,
            eventDetail.concertVenue,
            eventDetail.concertDate,
            eventDetail.price,
            eventDetail.ticketsReleased
        );
    }

    function getTicketOwner(uint256 concertId) public view returns (address) {
        require(
            concertToTicketIds[concertId].length > 0,
            "No tickets for this concert"
        );
        // Get the first ticket ID for the concert
        uint256 ticketId = concertToTicketIds[concertId][0];
        // Use the Ticket contract to find the owner of the ticket
        return ticketContract.getOwner(ticketId);
    }
}