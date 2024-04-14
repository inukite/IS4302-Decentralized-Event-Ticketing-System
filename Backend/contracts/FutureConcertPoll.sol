// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LoyaltyPoints.sol";

/**
 * @title A contract for managing and casting votes for future concert options
 **/
contract FutureConcertPoll {
    LoyaltyPoints public loyaltyPointsContract; // Reference to the LoyaltyPoints contract for managing vote points
    uint256 public maxVotePointsPerUser = 100; // Maximum points a user can spend on voting
    uint256 private nextConcertOptionId = 1; // Incremental ID to ensure uniqueness among concert options
    address private organizer; // Organizer's address to control privileged actions

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

    /**
     * @notice Constructor to initialize the FutureConcertPoll with a loyalty points contract
     * @param _loyaltyPointsContract Address of the LoyaltyPoints contract
     **/
    constructor(LoyaltyPoints _loyaltyPointsContract) {
        organizer = msg.sender;
        loyaltyPointsContract = _loyaltyPointsContract;
    }

    modifier onlyOrganizer() {
        require(
            msg.sender == organizer,
            "Only the organizer can perform this action"
        );
        _;
    }

    /**
     * @notice Allows the organizer to add a new concert option for voting
     * @param name Name of the concert
     * @param venue Venue of the concert
     * @param date Date of the concert
     **/
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

    /**
     * @notice Registers a user to vote on a specific concert option
     * @param concertOptionId ID of the concert option to register for
     **/
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

    /**
     * @notice Allows a user to retract their vote registration and recover their loyalty points
     * @param concertOptionId ID of the concert option to withdraw from
     * @param points Points initially used to vote, which will be returned
     **/
    function withdrawVoteRegistration(
        uint256 concertOptionId,
        uint256 points
    ) external {
        require(
            userVoteRegistration[msg.sender][concertOptionId],
            "User is not registered to vote on this concert option"
        );

        // Withdraw the registration
        userVoteRegistration[msg.sender][concertOptionId] = false;

        // Return users the loyalty points they initially used to vote with
        loyaltyPointsContract.addLoyaltyPoints(msg.sender, points);

        emit UserWithdrawedToVote(msg.sender, concertOptionId);
    }

    /**
     * @notice Casts votes for a concert option using loyalty points
     * @param concertOptionId ID of the concert option to vote for
     * @param points Number of points to cast as votes
     **/
    function castVote(uint256 concertOptionId, uint256 points) external {
        require(
            userVoteRegistration[msg.sender][concertOptionId],
            "User has not registered to vote on this concert option"
        );
        //Require more than 0 points to cast a vote
        require(points > 0, "Points must be greater than 0");
        require(
            userTotalVotes[msg.sender] + points <= maxVotePointsPerUser,
            "Vote points limit exceeded"
        );
        userVotes[msg.sender][concertOptionId] += points;
        concertVotes[concertOptionId] += points;
        userTotalVotes[msg.sender] += points;

        emit VoteCasted(msg.sender, concertOptionId, points);
    }

    /**
     * @notice Retrieves the total votes cast for a specific concert option
     * @param concertOptionId ID of the concert option
     * @return Total number of votes cast for the option
     **/
    function getTotalVotes(
        uint256 concertOptionId
    ) public view returns (uint256) {
        return concertVotes[concertOptionId];
    }

    /**
     * @notice Retrieves the number of votes cast by a specific user for a concert option
     * @param user Address of the user
     * @param concertOptionId ID of the concert option
     * @return Number of votes cast by the user
     **/
    function getUserVotes(
        address user,
        uint256 concertOptionId
    ) public view returns (uint256) {
        return userVotes[user][concertOptionId];
    }
}
