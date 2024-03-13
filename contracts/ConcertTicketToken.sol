// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ownable.sol";

contract TicketToken is ERC20, Ownable {
    struct ConcertTicket {
        uint256 ticketId;
        uint256 concertId;
        string concertName;
        string concertVenue;
        uint256 concertDate;
        string ticketCategory;
        uint256 ticketSectionNo;
        uint256 ticketSeatNo;
        string ticketState;
        uint256 purchaseDateTime;
    }

    mapping(uint256 => ConcertTicket) public concertTickets;
    uint256 public totalTickets;
    uint256 public constant MAX_TICKETS = 1000; // Maximum number of tickets allowed

    constructor() ERC20("ConcertTicketToken", "CTT") {}

    function mintTicket(
        uint256 _concertId,
        string memory _concertName,
        string memory _concertVenue,
        uint256 _concertDate,
        string memory _ticketCategory,
        uint256 _ticketSectionNo,
        uint256 _ticketSeatNo
    ) external onlyOwner {
        require(totalTickets < MAX_TICKETS, "Maximum tickets reached");
        totalTickets++;
        uint256 newTicketId = totalTickets;

        concertTickets[newTicketId] = ConcertTicket({
            ticketId: newTicketId,
            concertId: _concertId,
            concertName: _concertName,
            concertVenue: _concertVenue,
            concertDate: _concertDate,
            ticketCategory: _ticketCategory,
            ticketSectionNo: _ticketSectionNo,
            ticketSeatNo: _ticketSeatNo,
            ticketState: "New",
            purchaseDateTime: block.timestamp
        });

        _mint(msg.sender, 1 ether); // Mint 1 CTT token for each ticket
    }

    function setTicketState(uint256 _ticketId, string memory _newState) external onlyOwner {
        require(bytes(concertTickets[_ticketId].ticketState).length != 0, "Ticket does not exist");
        concertTickets[_ticketId].ticketState = _newState;
    }
}
