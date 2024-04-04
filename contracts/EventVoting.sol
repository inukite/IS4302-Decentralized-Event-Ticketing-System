// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ticket.sol";

contract EventVoting {
    // Structure to represent a poll option
    struct PollOption {
        uint256 optionId;
        string optionText;
        uint256 votes;
    }

    // Structure to represent a poll
    struct Poll {
        uint256 pollId;
        uint256 concertId; // Added concertId
        string question;
        mapping(uint256 => uint256) ticketVotes; // Mapping of ticketId to selected optionId
        PollOption[] options;
        uint256 totalVotes;
        bool isOpen;
    }

    mapping(uint256 => Poll) public polls;
    uint256 public pollCounter;
    Ticket public ticketContract;

    // Mapping to connect concertId to pollId
    mapping(uint256 => uint256) public concertToPoll;

    event PollCreated(
        uint256 indexed pollId,
        uint256 indexed concertId,
        string question
    );
    event Voted(
        uint256 indexed pollId,
        uint256 indexed ticketId,
        uint256 optionId
    );
    event PollClosed(uint256 indexed pollId);

    constructor(address _ticketContract) {
        ticketContract = Ticket(_ticketContract);
    }

    modifier isActiveTicketAndOpenPoll(uint256 _ticketId, uint256 _pollId) {
        require(
            ticketContract.getTicketState(_ticketId) ==
                Ticket.TicketState.Active,
            "Only active ticket holders can vote"
        );
        require(polls[_pollId].isOpen, "Poll is closed");
        _;
    }

    modifier isValidPoll(uint256 _pollId) {
        require(_pollId < pollCounter, "Poll ID is not valid");
        _;
    }

    // Function to create a new poll with multiple options
    function createPoll(
        uint256 _concertId,
        string memory _question,
        string[] memory _options
    ) public {
        polls[pollCounter].pollId = pollCounter;
        polls[pollCounter].concertId = _concertId; // Connect poll to concert
        polls[pollCounter].question = _question;
        for (uint256 i = 0; i < _options.length; i++) {
            polls[pollCounter].options.push(
                PollOption({optionId: i, optionText: _options[i], votes: 0})
            );
        }
        polls[pollCounter].isOpen = true;

        // Connect concertId to pollId
        concertToPoll[_concertId] = pollCounter;

        emit PollCreated(pollCounter, _concertId, _question);
        pollCounter++;
    }

    // Function for ticket holders to vote on a poll option
    function vote(
        uint256 _ticketId,
        uint256 _pollId,
        uint256 _optionId
    )
        public
        isValidPoll(_pollId)
        isActiveTicketAndOpenPoll(_ticketId, _pollId)
    {
        require(_optionId < polls[_pollId].options.length, "Invalid option ID");
        require(
            polls[_pollId].concertId == ticketContract.getConcertId(_ticketId),
            "Ticket should be of same Concert"
        );

        polls[_pollId].ticketVotes[_ticketId] = _optionId;
        polls[_pollId].options[_optionId].votes++;
        polls[_pollId].totalVotes++;
        emit Voted(_pollId, _ticketId, _optionId);
    }

    // Function to close a poll
    function closePoll(uint256 _pollId) public isValidPoll(_pollId) {
        polls[_pollId].isOpen = false;
        emit PollClosed(_pollId);
    }

    // Function to get the number of votes for a specific option in a poll
    function getVotesForOption(
        uint256 _pollId,
        uint256 _optionId
    ) public view returns (uint256) {
        return polls[_pollId].options[_optionId].votes;
    }

    // Function to check if a poll is open
    function isPollOpen(uint256 _pollId) public view returns (bool) {
        return polls[_pollId].isOpen;
    }

    // Function to retrieve poll details including options
    function getPollDetails(
        uint256 _pollId
    )
        public
        view
        returns (uint256, string memory, string[] memory, uint256[] memory)
    {
        uint256 concertId = polls[_pollId].concertId; // Retrieve concertId
        string memory question = polls[_pollId].question;
        uint256 optionsCount = polls[_pollId].options.length;
        string[] memory optionsText = new string[](optionsCount);
        uint256[] memory votes = new uint256[](optionsCount);

        for (uint256 i = 0; i < optionsCount; i++) {
            optionsText[i] = polls[_pollId].options[i].optionText;
            votes[i] = polls[_pollId].options[i].votes;
        }

        return (concertId, question, optionsText, votes);
    }
}
