// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ticket.sol";

contract Lottery {
    Ticket public ticketContract;
    address public owner;
    address[] public participants;
    bool public lotteryActive;
    uint256 public lotteryStartTime;
    uint256 public lotteryEndTime;
    uint256[] public availableTicketIds;

    event LotteryStarted(uint256 startTime, uint256 endTime);
    event TicketPurchased(address indexed buyer, uint256 amount);
    event WinnerSelected(address winner, uint256 ticketId);
    event TicketAddedToLottery(address owner, uint256 ticketId);

    // Mapping to keep track of added participants
    mapping(address => bool) public isParticipantAdded;

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

        // Automatically add the new ticket ID to the available tickets
        availableTicketIds.push(newTicketId);
        emit TicketAddedToLottery(msg.sender, newTicketId);
    }

    function startLottery(uint256 duration) public onlyOwner {
        require(!lotteryActive, "Lottery is already active.");
        require(duration > 0, "Duration must be greater than zero.");

        lotteryActive = true;
        lotteryStartTime = block.timestamp;
        lotteryEndTime = block.timestamp + duration;
        delete participants; // clear participants for a new round

        emit LotteryStarted(lotteryStartTime, lotteryEndTime);
    }

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

            //transfer ticket to the winner
            ticketContract.transfer(winningTicketId, winner, 0); // resell price = 0

            emit WinnerSelected(winner, winningTicketId);
        }
        // Reset the lottery for the next round
        delete participants;
        delete availableTicketIds;
    }

    function selectWinningTicket() private view returns (uint256) {
        require(
            availableTicketIds.length > 0,
            "No tickets available for lottery"
        );
        uint256 ticketIndex = random() % availableTicketIds.length;
        return availableTicketIds[ticketIndex];
    }

    function addAvailableTicketId(uint256 ticketId) public onlyOwner {
        availableTicketIds.push(ticketId);
    }

    function addParticipant(address participant) external isLotteryActive {
        require(!isParticipantAdded[participant], "Participant already added.");
        participants.push(participant);
        isParticipantAdded[participant] = true;
    }

    // Reset for a new lottery round if necessary
    function resetParticipants() external {
        for (uint i = 0; i < participants.length; i++) {
            isParticipantAdded[participants[i]] = false;
        }
        delete participants;
    }

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
