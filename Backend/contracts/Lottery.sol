// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ticket.sol";

/**
 * @title A lottery system for awarding free tickets to participants
 **/
contract Lottery {
    Ticket public ticketContract; // Reference to the Ticket contract
    address private owner; // Owner of the contract
    address[] public participants; // Array of participant addresses
    bool public lotteryActive; // Status of the lottery
    uint256 public lotteryStartTime; // Start time of the current lottery
    uint256 public lotteryEndTime; // End time of the current lottery
    uint256[] public availableTicketIds; // Array of ticket IDs available in the lottery

    event LotteryStarted(uint256 startTime, uint256 endTime);
    event TicketPurchased(address indexed buyer, uint256 amount);
    event WinnerSelected(address winner, uint256 ticketId);
    event TicketAddedToLottery(address owner, uint256 ticketId);

    mapping(address => bool) public isParticipantAdded; // Tracks whether a participant has been added to the lottery

    /**
     * @notice Initializes the contract with the Ticket contract's address
     * @param _ticketContractAddress Address of the Ticket contract
     **/
    constructor(address _ticketContractAddress) {
        owner = msg.sender;
        ticketContract = Ticket(_ticketContractAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    modifier isLotteryActive() {
        require(lotteryActive, "Lottery is not active.");
        _;
    }

    /**
     * @notice Creates a ticket and adds it to the lottery's available tickets
     * @param concertId ID of the concert for the ticket
     * @param concertName Name of the concert
     * @param concertVenue Venue of the concert
     * @param concertDate Date of the concert
     * @param ticketSectionNo Section number of the ticket
     * @param ticketSeatNo Seat number of the ticket
     * @param price Price of the ticket
     **/
    function createAndAddTicket(
        uint256 concertId,
        string memory concertName,
        string memory concertVenue,
        uint256 concertDate,
        uint256 ticketSectionNo,
        uint256 ticketSeatNo,
        uint256 price
    ) public onlyOwner {
        uint256 newTicketId = ticketContract.createTicket(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            ticketSectionNo,
            ticketSeatNo,
            price
        );

        availableTicketIds.push(newTicketId);
        emit TicketAddedToLottery(msg.sender, newTicketId);
    }

    /**
     * @notice Starts a new lottery round with a specified duration
     * @param duration Duration of the lottery round in seconds
     **/
    function startLottery(uint256 duration) public onlyOwner {
        require(!lotteryActive, "Lottery is already active.");
        require(duration > 0, "Duration must be greater than zero.");

        lotteryActive = true;
        lotteryStartTime = block.timestamp;
        lotteryEndTime = block.timestamp + duration;
        delete participants; // Clear participants for a new round

        emit LotteryStarted(lotteryStartTime, lotteryEndTime);
    }

    /**
     * @notice Ends the current lottery round and selects a winner
     */
    function endLottery() public onlyOwner {
        require(lotteryActive, "Lottery already ended.");
        require(
            block.timestamp > lotteryEndTime,
            "Lottery time has not expired yet."
        );

        lotteryActive = false;
        if (participants.length > 0) {
            uint256 winnerIndex = random() % participants.length;
            address winner = participants[winnerIndex];
            uint256 winningTicketId = selectWinningTicket();

            ticketContract.transfer(winningTicketId, winner, 0); // Resell price = 0

            emit WinnerSelected(winner, winningTicketId);
        }
        delete participants;
        delete availableTicketIds;
    }

    /**
     * @notice Selects a random ticket from the available tickets as the winning ticket
     **/
    function selectWinningTicket() private view returns (uint256) {
        require(
            availableTicketIds.length > 0,
            "No tickets available for lottery"
        );
        uint256 ticketIndex = random() % availableTicketIds.length;
        return availableTicketIds[ticketIndex];
    }

    /**
     * @notice Adds a ticket ID to the available tickets for the lottery
     * @param ticketId The ticket ID to add
     **/
    function addAvailableTicketId(uint256 ticketId) public onlyOwner {
        availableTicketIds.push(ticketId);
    }

    /**
     * @notice Adds a new participant to the lottery
     * @param participant The address of the participant to add
     **/
    function addParticipant(address participant) external isLotteryActive {
        require(!isParticipantAdded[participant], "Participant already added.");
        participants.push(participant);
        isParticipantAdded[participant] = true;
    }

    /**
     * @notice Resets the participant list for a new lottery round
     **/
    function resetParticipants() external {
        for (uint i = 0; i < participants.length; i++) {
            isParticipantAdded[participants[i]] = false;
        }
        delete participants;
    }

    /**
     * @notice Generates a pseudo-random number based on some known variables
     * @return uint256 Pseudo-random number
     **/
    function random() private view returns (uint256) {
        bytes memory encodedData = abi.encodePacked(
            block.coinbase, // Miner's address
            block.difficulty, // Current block difficulty
            block.gaslimit, // Current block gas limit
            block.number, // Current block number
            block.timestamp, // Current block timestamp
            participants.length // Number of participants
        );
        return uint256(keccak256(encodedData));
    }
}
