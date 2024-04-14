// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriorityQueue.sol";
import "./Ticket.sol";
import "./LoyaltyPoints.sol";
import "./FutureConcertPoll.sol";
import "./Lottery.sol";

/**
 * @title A presale market for concert tickets with priority-based access and integrated loyalty and voting systems.
 **/
contract PresaleMarket {
    Ticket public ticketContract;
    address public organizer;
    PriorityQueue public priorityQueue;
    LoyaltyPoints public loyaltyPoints;
    uint256 public ticketCounter;
    FutureConcertPoll public futureConcertPoll;
    Lottery public lotteryContract;

    // Structure to store details about each event.
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

    // Track whether a user is eligible to vote based on ticket redemption
    mapping(address => bool) public isEligibleToVote;

    /**
     * @dev Constructor to initialize the market with necessary contract addresses.
     **/
    constructor(
        address _priorityQueueAddress,
        address _loyaltyPointsAddress,
        address _ticketContractAddress,
        address _futureConcertPollAddress,
        address _lotteryContractAddress
    ) {
        organizer = msg.sender;
        priorityQueue = PriorityQueue(_priorityQueueAddress);
        loyaltyPoints = LoyaltyPoints(_loyaltyPointsAddress);
        ticketContract = Ticket(_ticketContractAddress);
        futureConcertPoll = FutureConcertPoll(_futureConcertPollAddress);
        lotteryContract = Lottery(_lotteryContractAddress);
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

    /**
     * @notice Creates an event without immediately creating tickets.
     * @dev Stores event details and emits an event creation log.
     **/
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

    /**
     * @notice Creates a ticket and associates it with an event.
     * @dev Validates that the event exists before creating a ticket.
     **/
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

    /**
     * @notice Releases tickets for an event allowing them to be purchased.
     * @dev Checks that tickets have not been released and it is within the release period.
     **/
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

    /**
     * @notice Allows users with the highest priority to purchase tickets.
     * @dev Ensures only the highest priority buyer can purchase when tickets are released.
     **/
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

        priorityQueue.dequeue(); // Remove the buyer with the highest priority after the purchase

        // Lottery: Add the user to the list of participants for the lottery
        lotteryContract.addParticipant(msg.sender);
    }

    /**
     * @notice Redeems a ticket for an event and optionally allows the user to register and vote.
     * @dev Checks ownership and if the ticket has been redeemed before allowing redemption.
     **/
    function redeemInPresaleMarket(
        uint256 ticketId,
        bool wantToRegisterAndVote,
        uint256 concertOptionId,
        uint256 votePoints
    ) external {
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

        loyaltyPoints.addLoyaltyPoints(msg.sender, 10); // Awarding 10 loyalty points whenever the user redeems the ticket

        emit TicketRedeemed(ticketId, msg.sender);

        // Voting system below
        if (wantToRegisterAndVote) {
            // Ensure the user hasn't already registered to vote on this concert option
            require(
                !futureConcertPoll.userVoteRegistration(
                    msg.sender,
                    concertOptionId
                ),
                "Already registered to vote on this concert option"
            );

            uint256 userPoints = loyaltyPoints.getPoints(msg.sender);
            require(userPoints >= votePoints, "Not enough loyalty points");
            loyaltyPoints.subtractLoyaltyPoints(msg.sender, votePoints);

            // Register the user for voting on the concert option
            futureConcertPoll.registerToVote(concertOptionId);

            // Assuming the user is now eligible to vote, proceed with casting the vote
            futureConcertPoll.castVote(concertOptionId, votePoints);
        }
    }

    //Getter functions below

    /**
     * @notice Retrieves detailed information about an event.
     **/
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

    /**
     * @notice Retrieves the owner of the ticket for a concert.
     **/
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
