// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriorityQueue.sol";
import "./Ticket.sol";
import "./LoyaltyPoints.sol";

contract PresaleMarket {
    address public organizer;
    PriorityQueue public priorityQueue;
    Ticket public ticketContract;
    LoyaltyPoints public loyaltyPointsContract;

    constructor(
        address _priorityQueue,
        address _ticketContract,
        address _loyaltyPointsContract
    ) {
        organizer = msg.sender;
        priorityQueue = PriorityQueue(_priorityQueue);
        ticketContract = Ticket(_ticketContract);
        loyaltyPointsContract = LoyaltyPoints(_loyaltyPointsContract);
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Caller is not the organizer");
        _;
    }

    event TicketPurchased(address buyer);
    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriorityQueue.sol";
import "./Ticket.sol";
import "./LoyaltyPoints.sol";

contract PresaleMarket {
    address public organizer;
    PriorityQueue public priorityQueue;
    Ticket public ticketContract;
    LoyaltyPoints public loyaltyPointsContract;

    constructor(
        address _priorityQueue,
        address _ticketContract,
        address _loyaltyPointsContract
    ) {
        organizer = msg.sender;
        priorityQueue = PriorityQueue(_priorityQueue);
        ticketContract = Ticket(_ticketContract);
        loyaltyPointsContract = LoyaltyPoints(_loyaltyPointsContract);
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Caller is not the organizer");
        _;
    }

    event TicketPurchased(address buyer);
    event PurchaseLogged(address buyer, uint256 ticketId);

    //emit this after the buyer has selected which ticket they want to buy
    event TicketSelected(address buyer, uint selectedTicketId);

    // Consider a scenario where certain details (like concert ID, name, venue, and date) are consistent for all tickets being released
    // Only Category, section, and seat numbers could vary
    function releaseTickets(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        string memory ticketCategory,
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
                ticketCategory,
                ticketSectionNos[i],
                ticketSeatNos[i],
                price
            );
        }
    }

    function buyTicket() external {
        require(
            priorityQueue.size() > 0,
            "No more tickets available or sale not started."
        );

        // Check if the caller is the highest priority buyer
        (address highestPriorityBuyer, ) = priorityQueue.peekHighestPriority();
        require(
            msg.sender == highestPriorityBuyer,
            "It's not your turn to buy a ticket yet."
        );

        // Dequeue the buyer from the priority queue
        priorityQueue.popHighestPriorityBuyer();

        // Assume a simplified purchase process
        // Realistically, you'd also handle ticket selection, payment, and ticket assignment here
        emit TicketPurchased(msg.sender);

        // Interact with the Ticket contract to mark the ticket as purchased
        ticketContract.purchaseTicket(ticketId, msg.sender);

        // Log the purchase (replace with your purchase logic)
        emit PurchaseLogged(msg.sender, ticketId);

        // Simplified ticket selection process
        uint256 ticketId = selectAvailableTicket(); // A mock function to get an available ticket ID
        
        // Update loyalty points (implementation needed)
        updateLoyaltyPoints(msg.sender);
            }

    function selectAvailableTicket() private returns (uint256) {
        // Logic to select and return an available ticket ID
        // Placeholder return value; replace with actual ticket selection logic
        return 1;
    }

    // Additional functions related to priority queue management, loyalty points check, etc.
}


    // Consider a scenario where certain details (like concert ID, name, venue, and date) are consistent for all tickets being released
    // Category, section, and seat numbers could vary
    function releaseTickets(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        string memory ticketCategory,
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
                ticketCategory,
                ticketSectionNos[i],
                ticketSeatNos[i],
                price
            );
        }
    }

    function buyTicket() external {
        require(
            priorityQueue.size() > 0,
            "No more tickets available or sale not started."
        );

        // Check if the caller is the highest priority buyer
        (address highestPriorityBuyer, ) = priorityQueue.peekHighestPriority();
        require(
            msg.sender == highestPriorityBuyer,
            "It's not your turn to buy a ticket yet."
        );

        // Dequeue the buyer from the priority queue
        priorityQueue.popHighestPriorityBuyer();

        // Assume a simplified purchase process
        // Realistically, you'd also handle ticket selection, payment, and ticket assignment here

        emit TicketPurchased(msg.sender);

        // Interact with the Ticket contract to mark the ticket as purchased
        ticketContract.purchaseTicket(ticketId, msg.sender);

        // Log the purchase (replace with your purchase logic)
        emit PurchaseLogged(msg.sender, ticketId);

        // Simplified ticket selection process
        uint256 ticketId = selectAvailableTicket(); // A mock function to get an available ticket ID

        // Optionally update buyer's loyalty points and re-enqueue them if they can buy more tickets
        // This step depends on your specific requirements for the presale market
    }

    function selectAvailableTicket() private returns (uint256 selectedTicketId) {
        if (ticketContract.ticketId == selectedTicketId) {
            emit TicketSelected(msg.sender, selectedTicketId)

        
        }
        return 1;
    }

    // Additional functions related to priority queue management, loyalty points check, etc.
}
