// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ticket.sol";
import "./TicketToken.sol";
import "./PriorityQueue.sol";
import "./LoyaltyPoints.sol";
import "./FutureConcertPoll.sol";
import "./Lottery.sol";

/**
 * @title A marketplace for listing, buying, and redeeming tickets.
 **/
contract TicketMarket {
    address private _owner;
    uint256 public commissionFee;
    Ticket public ticketContract;
    LoyaltyPoints public loyaltyPoints;
    FutureConcertPoll public futureConcertPoll;
    Lottery public lotteryContract;

    mapping(uint256 => uint256) public listPrice; // Mapping of ticket IDs to their listing price
    uint256[] private listedTickets; // Array to keep track of all listed ticket IDs

    event TicketListed(uint256 ticketId, uint256 price);
    event TicketUnlisted(uint256 ticketId);
    event TicketSold(
        uint256 indexed ticketId,
        address indexed buyer,
        uint256 price,
        uint256 timestamp
    );
    event TicketRedeemed(
        uint256 indexed ticketId,
        address indexed redeemer,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    /**
     * @notice Initializes a new TicketMarket contract with necessary references and commission fee
     * @param ticketAddress Address of the Ticket contract
     * @param loyaltyPointsAddress Address of the LoyaltyPoints contract
     * @param futureConcertPollAddress Address of the FutureConcertPoll contract
     * @param lotteryContractAddress Address of the Lottery contract
     * @param fee Initial commission fee for ticket sales
     **/
    constructor(
        Ticket ticketAddress,
        LoyaltyPoints loyaltyPointsAddress,
        FutureConcertPoll futureConcertPollAddress,
        Lottery lotteryContractAddress,
        uint256 fee
    ) {
        _owner = msg.sender;
        ticketContract = ticketAddress;
        loyaltyPoints = loyaltyPointsAddress;
        futureConcertPoll = futureConcertPollAddress;
        lotteryContract = lotteryContractAddress;
        commissionFee = fee;
    }

    /**
     * @notice Lists a ticket for sale at a specified price
     * @param ticketId The ID of the ticket to list
     * @param price The price at which to list the ticket
     **/
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

        listPrice[ticketId] = price;
        listedTickets.push(ticketId);

        emit TicketListed(ticketId, price);
    }

    /**
     * @notice Removes a ticket from the list of tickets available for sale
     * @param ticketId The ID of the ticket to unlist
     **/
    function unlist(uint256 ticketId) public {
        require(
            msg.sender == ticketContract.getOwner(ticketId),
            "Caller is not ticket owner"
        );

        listPrice[ticketId] = 0;

        for (uint256 i = 0; i < listedTickets.length; i++) {
            if (listedTickets[i] == ticketId) {
                listedTickets[i] = listedTickets[listedTickets.length - 1];
                listedTickets.pop();
                break;
            }
        }

        emit TicketUnlisted(ticketId);
    }

    /**
     * @notice Redeems a ticket and optionally registers and votes for an upcoming concert
     * @param ticketId The ID of the ticket to redeem
     * @param wantToRegisterAndVote Flag to indicate if the redeemer wants to register and vote
     * @param concertOptionId The ID of the concert option to vote for
     * @param votePoints The number of points to use for voting
     **/
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
        require(
            !ticketContract.isRedeemed(ticketId),
            "Ticket has already been redeemed"
        );

        uint256 concertDate = ticketContract.getConcertDate(ticketId);
        require(
            block.timestamp >= concertDate &&
                block.timestamp < concertDate + 1 days,
            "This ticket can't be redeemed today"
        );

        ticketContract.redeemTicket(ticketId);
        loyaltyPoints.addLoyaltyPoints(msg.sender, 10); // Awarding loyalty points for redemption

        emit TicketRedeemed(ticketId, msg.sender, block.timestamp);

        if (wantToRegisterAndVote) {
            uint256 userPoints = loyaltyPoints.getPoints(msg.sender);
            require(userPoints >= votePoints, "Not enough loyalty points");
            loyaltyPoints.subtractLoyaltyPoints(msg.sender, votePoints);

            futureConcertPoll.registerToVote(concertOptionId);
            futureConcertPoll.castVote(concertOptionId, votePoints);
        }
    }

    /**
     * @notice Allows a user to buy a ticket that is listed for sale. Price needs to be >= value + commission fee
     * @param ticketId The ID of the ticket to buy
     **/
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

        ticketContract.transfer(ticketId, msg.sender, resellPrice); // Transferring the ownership of the ticket

        emit TicketSold(ticketId, msg.sender, resellPrice, block.timestamp);
        listPrice[ticketId] = 0;

        lotteryContract.addParticipant(msg.sender); // Adding the buyer to the lottery participants
    }

    // Getter functions below

    /**
     * @notice Retrieves the sale price of a ticket
     * @param ticketId The ID of the ticket
     **/
    function getTicketPrice(uint256 ticketId) public view returns (uint256) {
        return listPrice[ticketId];
    }

    /**
     * @notice Retrieves the current commission fee
     **/
    function getCommissionFee() public view returns (uint256) {
        return commissionFee;
    }

    /**
     * @notice Retrieves a list of all tickets currently listed for sale
     **/
    function getListedTickets() public view returns (uint256[] memory) {
        return listedTickets;
    }

    /**
     * @notice Provides details of a ticket including its price, owner, and listing status
     * @param ticketId The ID of the ticket
     **/
    function getTicketDetails(
        uint256 ticketId
    ) public view returns (uint256 price, address owner, bool isListed) {
        price = listPrice[ticketId];
        owner = ticketContract.getOwner(ticketId);
        isListed = (price > 0);
        return (price, owner, isListed);
    }
}
