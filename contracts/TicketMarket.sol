// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ticket.sol";
import "./TicketToken.sol";
import "./PriorityQueue.sol";
import "./LoyaltyPoints.sol";
import "./FutureConcertPoll.sol";
import "./Lottery.sol";

contract TicketMarket {
    address _owner = msg.sender;
    uint256 public commissionFee;
    Ticket public ticketContract;
    LoyaltyPoints public loyaltyPoints;
    FutureConcertPoll public futureConcertPoll;
    Lottery public lotteryContract;

    // Mapping from ticket ID to listing price
    mapping(uint256 => uint256) public listPrice;

    uint256[] private listedTickets; // To track listed ticket IDs

    // Event emitted when a ticket is listed for sale
    event TicketListed(uint256 ticketId, uint256 price);
    event TicketUnlisted(uint256 ticketId);
    event TicketSold(uint256 ticketId, address buyer, uint256 price);

    // Event emitted when a ticket is transferred
    event TicketTransferred(
        uint256 indexed id,
        address from,
        address to,
        uint256 price
    );

    // Event emitted when a ticket is redeemed
    event TicketRedeemed(uint256 indexed ticketId, address indexed redeemer);

    constructor(
        Ticket ticketAddress,
        LoyaltyPoints loyaltyPointsAddress,
        FutureConcertPoll futureConcertPollAddress,
        Lottery lotteryContractAddress,
        uint256 fee
    ) {
        ticketContract = ticketAddress;
        loyaltyPoints = loyaltyPointsAddress;
        futureConcertPoll = futureConcertPollAddress;
        lotteryContract = lotteryContractAddress;
        commissionFee = fee;
    }

    // List a ticket for sale. Price needs to be >= value + fee
    function list(uint256 ticketId, uint256 price) public {
        require(
            price >= (ticketContract.getPrice(ticketId) + commissionFee),
            "Price must be at least ticket price plus commission fee"
        );

        require(
            price <= ((ticketContract.getPrice(ticketId) * 6) / 5),
            "Price cannot be more than 20% extra of original price"
        );
        require(
            msg.sender == ticketContract.getOwner(ticketId),
            "Caller is not ticket owner"
        );
        emit TicketListed(ticketId, price);
        listPrice[ticketId] = price;
        listedTickets.push(ticketId); // Add ticket ID to the list of listed tickets
    }

    function unlist(uint256 ticketId) public {
        require(msg.sender == ticketContract.getOwner(ticketId));
        listPrice[ticketId] = 0;
        emit TicketUnlisted(ticketId); // Emit event for ticket unlisting

        // Find and remove the ticket ID from listedTickets array
        for (uint256 i = 0; i < listedTickets.length; i++) {
            if (listedTickets[i] == ticketId) {
                // Move the last element to the current index
                listedTickets[i] = listedTickets[listedTickets.length - 1];
                // Remove the last element
                listedTickets.pop();
                break; // Exit the loop once the ticket ID is removed
            }
        }
    }

    // Redeem a ticket for an event
    function redeemInTicketMarket(
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

        // Award loyalty points
        loyaltyPoints.addLoyaltyPoints(msg.sender, 10); // Awarding 10 loyalty points whenever the user redeems the ticket

        emit TicketRedeemed(ticketId, msg.sender);


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

    // Getter functions below

    // Get price of ticket
    function getTicketPrice(uint256 ticketId) public view returns (uint256) {
        return listPrice[ticketId];
    }

    // Get the commission fee
    function getCommission() public view returns (uint256) {
        return commissionFee;
    }

    // Buy the ticket at the requested price
    function buy(uint256 ticketId) public payable {
        require(listPrice[ticketId] != 0, "Ticket must be listed for sale");
        require(msg.value >= listPrice[ticketId], "Insufficient payment");
        require(
            msg.sender != ticketContract.getOwner(ticketId),
            "Buyer already owns the ticket"
        );

        address payable recipient = payable(ticketContract.getOwner(ticketId));

        uint256 resellPrice = listPrice[ticketId];
        uint256 amountToTransfer = resellPrice - commissionFee;
        recipient.transfer(amountToTransfer);

        ticketContract.transfer(ticketId, msg.sender, resellPrice);

        // Emit event for ticket purchase
        emit TicketSold(ticketId, msg.sender, resellPrice);

        // Remove the ticket from the listing after purchase
        listPrice[ticketId] = 0;

        // Lottery: Add the user to the list of participants for the lottery
        lotteryContract.addParticipant(msg.sender);
    }

    // get price of ticket
    function checkPrice(uint256 id) public view returns (uint256) {
        return listPrice[id];
    }
}
