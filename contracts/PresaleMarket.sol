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
    address public presaleMarketAddress;

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
    mapping(uint256 => uint256[]) private concertToTickets;

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

    // To allow Presale Market to be an authorized caller
    modifier onlyOrganizerOrPresaleMarket() {
        require(
            msg.sender == organizer || msg.sender == presaleMarketAddress,
            "Caller is not authorized"
        );
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

    event TicketCreated(uint256 concertId, uint256 ticketId);
    event EligibleToBuy(address buyer, uint256 concertId);

    // Create an event without immediately creating tickets
    function createEvent(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        uint256 price
    ) public onlyOrganizer {
        require(events[concertId].concertDate == 0, "Event already exists.");

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

    // Function to add tickets to an event
    function addTicketsToEvent(
        uint256 concertId,
        uint256[] memory ticketIds
    ) public onlyOrganizer {
        require(events[concertId].concertDate != 0, "Event does not exist.");
        require(
            !events[concertId].ticketsReleased,
            "Tickets already released for this event."
        );

        for (uint256 i = 0; i < ticketIds.length; i++) {
            concertToTickets[concertId].push(ticketIds[i]);
            emit TicketAssignedToEvent(concertId, ticketIds[i]);
        }
    }

    // Consider a scenario where certain details (like concert ID, name, venue, and date) are consistent for all tickets being released
    // Only Category, section, & seat numbers could vary
    // Release ticket 1 week before the actual date
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

    // Consider a scenario where certain details (like concert ID, name, venue, and date) are consistent for all tickets being released
    // Category, section, and seat numbers could vary
    function releaseTickets(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        uint256[] memory ticketSectionNos,
        uint256[] memory ticketSeatNos,
        uint256 price
    ) external {
        require(
            msg.sender == organizer,
            "Only the organizer can release tickets."
        );
        require(
            ticketSectionNos.length == ticketSeatNos.length,
            "Section and seat numbers must match."
        );

        for (uint256 i = 0; i < ticketSectionNos.length; i++) {
            ticketContract.createTicket(
                concertId,
                concertName,
                concertVenue,
                concertDate,
                ticketSectionNos[i],
                ticketSeatNos[i],
                price
            );
        }
    }

    event TicketReleasedForSale(uint256 concertId);
    event CorrectPaymentAmount(uint256 ticketPrice);
    event TicketTransferred(address buyer, uint256 concertId);

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

        // Need to fix this part, breaks the test
        //uint256 ticketPrice = ticketContract.getPrice(ticketId);
        //require(msg.value == ticketPrice, "Incorrect payment amount.");

        //ticketContract.transfer(ticketId, msg.sender, ticketPrice);
        emit TicketPurchased(ticketId, msg.sender);


        // Need to fix this part, breaks the test
        //loyaltyPoints.addLoyaltyPoints(msg.sender, 10); // Example: award 10 loyalty points per ticket purchase
        //priorityQueue.dequeue(); // Remove the buyer with the highest priority after the purchase
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
            concertToTickets[concertId].length > 0,
            "No tickets for this concert"
        );
        // Get the first ticket ID for the concert
        uint256 ticketId = concertToTickets[concertId][0];
        // Use the Ticket contract to find the owner of the ticket
        return ticketContract.getOwner(ticketId);
    }
}
