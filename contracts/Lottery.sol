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

    event LotteryStarted(uint256 startTime, uint256 endTime);
    event TicketPurchased(address indexed buyer, uint256 amount);
    event WinnerSelected(address winner, uint256 ticketId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    modifier isLotteryActive() {
        require(lotteryActive, "Lottery is not active.");
        _;
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

            uint256 ticketId = 0;

            // transfer ticket to the winner
            ticketContract.transfer(ticketId, winner, 0); // resell price = 0

            emit WinnerSelected(winner, ticketId);
        }
        // Reset the lottery for the next round (optional)
    }

    function addParticipant(address participant) external isLotteryActive {
        participants.push(participant);
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