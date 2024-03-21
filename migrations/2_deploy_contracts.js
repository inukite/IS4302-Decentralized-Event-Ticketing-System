// const ERC20 = artifacts.require("ERC20");
// const TicketToken = artifacts.require("TicketToken");
// const TicketMarket = artifacts.require("TicketMarket");
// const LoyaltyPoints = artifacts.require("LoyaltyPoints");

// module.exports = function(deployer, network, accounts) {
//   // Define the commission fee for the TicketMarket
//   const commissionFee = web3.utils.toWei('0.01', 'ether'); // Example fee: 0.01 ETH

//   deployer.deploy(TicketToken).then(function(ticketTokenInstance) {
//     return deployer.deploy(TicketMarket, ticketTokenInstance.address, commissionFee);
//   });
// };

const ERC20 = artifacts.require('ERC20');
const Ticket = artifacts.require('Ticket')
const TicketToken = artifacts.require('TicketToken');
const TicketMarket = artifacts.require('TicketMarket');
const LoyaltyPoints = artifacts.require('LoyaltyPoints');
const PriorityQueue = artifacts.require('PriorityQueue');

module.exports = function (deployer, network, accounts) {
  // Define the commission fee for the TicketMarket
  const commissionFee = web3.utils.toWei('0.01', 'ether'); // Example fee: 0.01 ETH

  deployer.deploy(ERC20).then(() => {
    return deployer.deploy(TicketToken).then((ticketTokenInstance) => {
      return deployer.deploy(PriorityQueue).then(() => {
        return deployer.deploy(LoyaltyPoints).then((loyaltyPointsInstance) => {
          return deployer.deploy(Ticket, ticketTokenInstance.address).then(() => {
            return deployer.deploy(TicketMarket, Ticket.address, commissionFee, loyaltyPointsInstance.address);
          });
        });
      });
    });
  });
};
