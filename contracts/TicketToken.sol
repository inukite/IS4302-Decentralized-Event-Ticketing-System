pragma solidity ^0.8.0;

import "./ERC20.sol";

contract TicketToken {
    ERC20 erc20Contract;
    uint256 currentSupply;
    address owner;
    
    constructor() {
        ERC20 e = new ERC20();
        erc20Contract = e;
        owner = msg.sender;
    }

    function getCredit() public payable {
        uint256 amt = msg.value / 10000000000000000; // Get TTs eligible
        // erc20Contract.transferFrom(owner, msg.sender, amt);
        erc20Contract.mint(msg.sender, amt);
    }

    function checkCredit() public view returns(uint256) {
        return erc20Contract.balanceOf(msg.sender);
    }

}