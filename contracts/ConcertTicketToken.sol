pragma solidity ^0.8.0;

import "./ERC20.sol";

contract ConcertTicketToken is ERC20 {
    enum TicketState { New, Redeemed, Frozen }

    struct Ticket {
        uint256 ticketId;
        uint256 concertId;
        string concertName;
        string concertVenue;
        uint256 concertDate;
        string ticketCategory;
        uint256 ticketSectionNo;
        uint256 ticketSeatNo;
        TicketState ticketState;
        address owner;
        uint256 price; // New field to store ticket price
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(address => mapping(uint256 => bool)) public ownedTickets;

    uint256 public ticketCounter;
    address public organizer;
    ERC20 public detToken;

    event TicketPurchased(address indexed buyer, uint256 indexed ticketId, uint256 price);
    event TicketListedForSale(uint256 indexed ticketId, uint256 price);
    event TicketBought(uint256 indexed ticketId, address indexed buyer, uint256 price);
    event TicketRedeemed(uint256 indexed ticketId, address indexed redeemer);

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can call this function");
        _;
    }

    constructor(address _detToken) {
        organizer = msg.sender;
        detToken = ERC20(_detToken);
    }

    function purchaseTicket(uint256 _concertId, string memory _concertName, string memory _concertVenue, uint256 _concertDate, string memory _ticketCategory, uint256 _ticketSectionNo, uint256 _ticketSeatNo, uint256 _price) external {
        ticketCounter++;
        tickets[ticketCounter] = Ticket({
            ticketId: ticketCounter,
            concertId: _concertId,
            concertName: _concertName,
            concertVenue: _concertVenue,
            concertDate: _concertDate,
            ticketCategory: _ticketCategory,
            ticketSectionNo: _ticketSectionNo,
            ticketSeatNo: _ticketSeatNo,
            ticketState: TicketState.New,
            owner: msg.sender,
            price: _price
        });
        ownedTickets[msg.sender][ticketCounter] = true;
        emit TicketPurchased(msg.sender, ticketCounter, _price);
    }

    function listTicketForSale(uint256 _ticketId, uint256 _price) external {
        require(ownedTickets[msg.sender][_ticketId], "You don't own this ticket");
        require(tickets[_ticketId].ticketState == TicketState.New, "Ticket is not eligible for resale");
        tickets[_ticketId].price = _price;
        emit TicketListedForSale(_ticketId, _price);
    }

    function buyTicket(uint256 _ticketId) external payable {
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.ticketState == TicketState.New, "Ticket is not available for purchase");
        require(msg.value >= ticket.price, "Insufficient funds");
        require(ticket.owner != msg.sender, "You already own this ticket");
        ticket.owner.transfer(ticket.price); // Transfer funds to seller
        ticket.owner = msg.sender;
        ticket.ticketState = TicketState.Redeemed;
        ownedTickets[msg.sender][_ticketId] = true;
        emit TicketBought(_ticketId, msg.sender, ticket.price);
    }

    function redeemTicket(uint256 _ticketId) external {
        require(ownedTickets[msg.sender][_ticketId], "You don't own this ticket");
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.ticketState == TicketState.New, "Ticket is not eligible for redemption");
        ticket.ticketState = TicketState.Redeemed;
        detToken.transfer(msg.sender, calculateDETSReward(ticket.ticketCategory));
        emit TicketRedeemed(_ticketId, msg.sender);
    }

   function calculateDETSReward(string memory _ticketCategory) internal view returns (uint256) {
        // You can implement your logic for calculating DETS reward based on ticket category here
        // For demonstration purposes, let's assume a fixed reward for simplicity
        uint256 reward = 100; // Arbitrary value, you should adjust it according to your requirement
        return reward;
    }
}