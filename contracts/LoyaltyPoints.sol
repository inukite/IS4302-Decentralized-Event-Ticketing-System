// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title A contract for managing loyalty points associated with different market activities
 **/
contract LoyaltyPoints {
    mapping(address => uint256) public lpBalances; // Mapping of user addresses to their loyalty points balance

    address private owner; // Owner of the contract, typically who deploys it
    address public presaleMarketAddress; // Address of the PresaleMarket authorized to interact with this contract
    address public ticketMarketAddress; // Address of the TicketMarket authorized to interact with this contract
    address public futureConcertPollAddress; // Address of the FutureConcertPoll authorized to interact with this contract

    event LoyaltyPointsAdded(address indexed user, uint256 points);
    event LoyaltyPointsSubtracted(address indexed user, uint256 points);
    event LoyaltyPointsSet(address indexed user, uint256 points);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this.");
        _;
    }

    modifier onlyAuthorisedCallers() {
        require(
            msg.sender == owner ||
                msg.sender == presaleMarketAddress ||
                msg.sender == ticketMarketAddress ||
                msg.sender == futureConcertPollAddress,
            "Unauthorized"
        );
        _;
    }

    /**
     * @notice Initializes the contract setting the deployer as the owner
     **/
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Sets the address of the PresaleMarket contract
     * @param _presaleMarketAddress The address to be set
     **/
    function setPresaleMarketAddress(
        address _presaleMarketAddress
    ) external onlyOwner {
        presaleMarketAddress = _presaleMarketAddress;
    }

    /**
     * @notice Sets the address of the TicketMarket contract
     * @param _ticketMarketAddress The address to be set
     **/
    function setTicketMarketAddress(
        address _ticketMarketAddress
    ) external onlyOwner {
        ticketMarketAddress = _ticketMarketAddress;
    }

    /**
     * @notice Sets the address of the FutureConcertPoll contract
     * @param _futureConcertPollAddress The address to be set
     **/
    function setFutureConcertPollAddress(
        address _futureConcertPollAddress
    ) external onlyOwner {
        futureConcertPollAddress = _futureConcertPollAddress;
    }

    /**
     * @notice Adds loyalty points to a user's balance
     * @param user The address of the user to receive the points
     * @param points The amount of points to add
     **/
    function addLoyaltyPoints(
        address user,
        uint256 points
    ) public onlyAuthorisedCallers {
        lpBalances[user] += points;
        emit LoyaltyPointsAdded(user, points);
    }

    /**
     * @notice Subtracts loyalty points from a user's balance
     * @param user The address of the user from whose balance points are to be deducted
     * @param points The amount of points to subtract
     **/
    function subtractLoyaltyPoints(
        address user,
        uint256 points
    ) public onlyAuthorisedCallers {
        require(lpBalances[user] >= points, "Insufficient balance.");
        lpBalances[user] -= points;
        emit LoyaltyPointsSubtracted(user, points);
    }

    /**
     * @notice Sets the loyalty points balance of a user
     * @param user The address of the user whose balance is to be set
     * @param points The balance to set
     **/
    function setPoints(address user, uint256 points) public onlyOwner {
        lpBalances[user] = points;
        emit LoyaltyPointsSet(user, points);
    }

    /**
     * @notice Retrieves the loyalty points balance of a user
     * @param user The address of the user whose balance is being queried
     * @return The number of loyalty points the user has
     **/
    function getPoints(address user) public view returns (uint256) {
        return lpBalances[user];
    }
}
