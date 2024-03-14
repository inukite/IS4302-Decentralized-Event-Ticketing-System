// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "./Ticket.sol";
contract TicketMarket {

    Ticket ticketContract;
    uint256 public commissionFee;
    address _owner = msg.sender;
    mapping(uint256 => uint256) listPrice;
     constructor(Ticket ticketAddress, uint256 fee) public {
        ticketContract = ticketAddress;
        commissionFee = fee;
    }

    //list a ticket for sale. Price needs to be >= value + fee
    function list(uint256 id, uint256 price) public {
       require(price >= (ticketContract.getPrice(id) + commissionFee));
       require(msg.sender == ticketContract.getPrevOwner(id));
       listPrice[id] = price;
    }

    function unlist(uint256 id) public {
       require(msg.sender == ticketContract.getPrevOwner(id));
       listPrice[id] = 0;
  }

    // get price of ticket
    function checkPrice(uint256 id) public view returns (uint256) {
       return listPrice[id];
 }

    // Buy the ticket at the requested price
    function buy(uint256 id) public payable {
       require(listPrice[id] != 0); //is listed
       require(msg.value >= listPrice[id]);
       address payable recipient = payable(ticketContract.getPrevOwner(id));
       recipient.transfer(msg.value - commissionFee);    //transfer (price-commissionFee) to real owner
       ticketContract.transfer(id, msg.sender, msg.value);
    }

    function getContractOwner() public view returns(address) {
       return _owner;
    }

    function withDraw() public {
        if(msg.sender == _owner)
            payable(msg.sender).transfer(address(this).balance);
    }
}
