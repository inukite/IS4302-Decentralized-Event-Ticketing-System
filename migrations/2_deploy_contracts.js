const ERC20 = artifacts.require("ERC20");
const Ticket = artifacts.require("Ticket");
const TicketToken = artifacts.require("TicketToken");
const TicketMarket = artifacts.require("TicketMarket");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const PriorityQueue = artifacts.require("PriorityQueue");

module.exports = async function (deployer, network, accounts) {
   const commissionFee = web3.utils.toWei("0.01", "ether"); // Example fee: 0.01 ETH

   await deployer.deploy(ERC20);
   const ticketTokenInstance = await deployer.deploy(TicketToken);

   // Deploy LoyaltyPoints first as PriorityQueue depends on it
   const loyaltyPointsInstance = await deployer.deploy(LoyaltyPoints);

   // Deploy PriorityQueue with the address of the deployed LoyaltyPoints
   await deployer.deploy(PriorityQueue, loyaltyPointsInstance.address);

   // Deploy Ticket with the address of the deployed TicketToken
   const ticketInstance = await deployer.deploy(
      Ticket,
      ticketTokenInstance.address
   );

   // Deploy TicketMarket with the necessary addresses and commission fee
   await deployer.deploy(TicketMarket, ticketInstance.address, commissionFee);
};
