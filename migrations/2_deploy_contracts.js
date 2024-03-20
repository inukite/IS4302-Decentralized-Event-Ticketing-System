const ERC20 = artifacts.require("ERC20");
const TicketToken = artifacts.require("TicketToken");
const TicketMarket = artifacts.require("TicketMarket");

module.exports = function(deployer, network, accounts) {
  // Define the commission fee for the TicketMarket
  const commissionFee = web3.utils.toWei('0.01', 'ether'); // Example fee: 0.01 ETH
  
  deployer.deploy(TicketToken).then(function(ticketTokenInstance) {
    return deployer.deploy(TicketMarket, ticketTokenInstance.address, commissionFee);
  });
};
