const ERC20 = artifacts.require("ERC20");
const Ticket = artifacts.require("Ticket");
const TicketToken = artifacts.require("TicketToken");
const TicketMarket = artifacts.require("TicketMarket");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const PriorityQueue = artifacts.require("PriorityQueue");
const PresaleMarket = artifacts.require("PresaleMarket");
// const ConcertDetailsPoll = artifacts.require("ConcertDetailsPoll");
const FutureConcertPoll = artifacts.require("FutureConcertPoll");
const ConcertDetailsPoll = artifacts.require("ConcertDetailsPoll");
const Lottery = artifacts.require("Lottery");

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

   // Deploy PriorityQueue first as PresaleMarket depends on it
   const priorityQueueInstance = await deployer.deploy(
      PriorityQueue,
      loyaltyPointsInstance.address
   );

   // Deploy FutureConcertPoll
   const futureConcertPollInstance = await deployer.deploy(
      FutureConcertPoll,
      loyaltyPointsInstance.address
   );

   // Deploy Lottery
   const lotteryInstance = await deployer.deploy(
      Lottery,
      ticketInstance.address
   );

   // Deploy TicketMarket
   await deployer.deploy(
      TicketMarket,
      ticketInstance.address,
      loyaltyPointsInstance.address,
      futureConcertPollInstance.address,
      lotteryInstance.address,
      commissionFee
   );

   // Deploy PresaleMarket
   await deployer.deploy(
      PresaleMarket,
      priorityQueueInstance.address,
      loyaltyPointsInstance.address,
      ticketInstance.address,
      futureConcertPollInstance.address,
      lotteryInstance.address
   );
   await deployer.deploy(ConcertDetailsPoll, ticketInstance.address);
};
