// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LoyaltyPoints.sol";

contract FutureConcertPoll {
    LoyaltyPoints public loyaltyPointsContract;
    uint256 public maxVotesPerUser = 100; // Maximum points a user can spend on voting
    uint256 private nextConcertOptionId = 1; // Keep track of the next ID to ensure uniqueness
    address organizer;

    struct ConcertOption {
        uint256 concertOptionId;
        string concertName;
        string concertVenue;
        uint256 concertDate;
    }

    // Mapping of concert option IDs to their respective vote counts
    mapping(uint256 => uint256) public concertVotes;

    // Mapping of user address to their respective total vote counts
    mapping(address => uint256) public userTotalVotes;

    // Mapping of user votes (user address => (concert option ID => points spent))
    mapping(address => mapping(uint256 => uint256)) public userVotes;

    // Mapping from concert option IDs to their details
    mapping(uint256 => ConcertOption) public concertOptions;

    // Mapping to track user registration for voting (user address => (concert option ID => has registered))
    mapping(address => mapping(uint256 => bool)) public userVoteRegistration;

    // Event emitted when a new concert option is added
    event ConcertOptionAdded(
        uint256 concertOptionId,
        string name,
        string venue,
        uint256 date
    );

    // Event emitted when a user registers to vote
    event UserRegisteredToVote(address voter, uint256 concertOptionId);

    // Event emitted when a user registers to vote
    event UserWithdrawedToVote(address voter, uint256 concertOptionId);

    // Event emmitted when a vote is casted
    event VoteCasted(address voter, uint256 concertOptionId, uint256 points);

    constructor(LoyaltyPoints _loyaltyPointsContract) {
        loyaltyPointsContract = _loyaltyPointsContract;
        organizer = msg.sender;
    }

    modifier onlyOrganizer() {
        require(
            msg.sender == organizer,
            "Only the organizer can perform this action"
        );
        _;
    }

    // Function for the organizer to add a concert option
    function addConcertOption(
        string memory name,
        string memory venue,
        uint256 date
    ) public onlyOrganizer {
        concertOptions[nextConcertOptionId] = ConcertOption(
            nextConcertOptionId,
            name,
            venue,
            date
        );
        emit ConcertOptionAdded(nextConcertOptionId, name, venue, date);
        nextConcertOptionId++;
    }

    // Function for users to register to vote on a concert option
    function registerToVote(uint256 concertOptionId) external {
        // Ensure the concert option exists
        require(
            concertOptions[concertOptionId].concertOptionId != 0,
            "Concert option does not exist"
        );

        // Register the user
        userVoteRegistration[msg.sender][concertOptionId] = true;

        emit UserRegisteredToVote(msg.sender, concertOptionId);
    }

    // Function for users to withdraw their registration to vote on a concert option
    function withdrawVoteRegistration(uint256 concertOptionId) external {
        require(
            userVoteRegistration[msg.sender][concertOptionId],
            "User is not registered to vote on this concert option"
        );

        // Withdraw the registration
        userVoteRegistration[msg.sender][concertOptionId] = false;

        emit UserWithdrawedToVote(msg.sender, concertOptionId);
    }

    // Function for users to cast votes
    function castVote(uint256 concertOptionId, uint256 points) external {
        require(
            userVoteRegistration[msg.sender][concertOptionId],
            "User has not registered to vote on this concert option"
        );
        //Require more than 0 points to cast a vote
        require(points > 0, "Points must be greater than 0");
        require(
            userTotalVotes[msg.sender] + points <= maxVotesPerUser,
            "Vote limit exceeded"
        );
        userVotes[msg.sender][concertOptionId] += points;
        concertVotes[concertOptionId] += points;
        userTotalVotes[msg.sender] += points;

        emit VoteCasted(msg.sender, concertOptionId, points);
    }

    // Function to check the total votes for a concert option
    function getTotalVotes(
        uint256 concertOptionId
    ) public view returns (uint256) {
        return concertVotes[concertOptionId];
    }

    // Function to check the votes casted by a user for a concert option
    function getUserVotes(
        address user,
        uint256 concertOptionId
    ) public view returns (uint256) {
        return userVotes[user][concertOptionId];
    }
}
