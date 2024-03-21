const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const TicketMarket = artifacts.require("TicketMarket");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const BigNumber = require("bignumber.js");

contract("TicketMarket", function (accounts) {
   let ticketTokenInstance,
      ticketMarketInstance,
      ticketInstance,
      loyaltyPointsInstance;
   const owner = accounts[0];
   const buyer = accounts[1];

   beforeEach(async () => {
      ticketTokenInstance = await TicketToken.deployed();
      ticketInstance = await Ticket.deployed(ticketTokenInstance.address);
      loyaltyPointsInstance = await LoyaltyPoints.deployed();
      // Deploy TicketMarket contract with commission fee and address of LoyaltyPoints
      ticketMarketInstance = await TicketMarket.deployed(
         ticketInstance,
         web3.utils.toWei("0.01", "ether"),
         loyaltyPointsInstance
      );
   });

   it("should deploy the contracts correctly", async () => {
      assert(
         ticketMarketInstance.address,
         "TicketMarket contract was not deployed"
      );
      assert(
         ticketTokenInstance.address,
         "TicketToken contract was not deployed"
      );
      assert(ticketInstance.address, "Ticket contract was not deployed");
   });

   it("Verify ownership of ticket", async () => {
      // Details for creating a ticket
      const concertId = 4;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketCategory = "CAT1";
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      // Create a ticket and capture the event
      await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketCategory,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );

      const ticketId = await ticketInstance.getTicketId(0);
      const ownerAddress = await ticketInstance.getOwner(ticketId);

      // Corrected assertion: Check if the returned owner address matches the owner's address
      assert.equal(
         ownerAddress,
         owner,
         "Organizer must be the owner of the ticket"
      );
   });

   // Test that a ticket cannot be listed if the price is less than creation value + commission
   it("Ticket cannot be listed if the price is less than creation value + commission", async () => {
      // no ether
      await truffleAssert.fails(
         ticketMarketInstance.list(0, 0, { from: owner })
      );
   });

   // Test that a ticket can be listed
   it("Ticket can be listed for sale", async () => {
      // Details for creating a ticket
      const concertId = 4;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketCategory = "CAT1";
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      // Create a ticket and capture the event
      let transaction = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketCategory,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );
      const listingPrice = web3.utils.toWei("0.5", "ether"); // Listing price must be >= ticketPrice + commissionFee

      // List the ticket for sale
      await ticketMarketInstance.list(1, listingPrice, { from: owner });

      // Verify listing
      const finalPrice = await ticketMarketInstance.getTicketPrice(1);

      assert.equal(
         finalPrice,
         listingPrice,
         "The ticket was not listed at the correct price"
      );
   });

   //To test the unlisting of a ticket
   it("Ticket can be unlisted from market", async () => {
      assert(await ticketMarketInstance.unlist(1), "Ticket not unlisted");
   });
});
