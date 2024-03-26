const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const TicketMarket = artifacts.require("TicketMarket");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const BigNumber = require("bignumber.js");

contract("TicketMarket", function (accounts) {
   let ticketTokenInstance, ticketMarketInstance, ticketInstance;
   const owner = accounts[0];
   const buyer = accounts[1];

   beforeEach(async () => {
      ticketTokenInstance = await TicketToken.deployed();
      ticketInstance = await Ticket.deployed(ticketTokenInstance.address);
      // Deploy TicketMarket contract with commission fee and address of LoyaltyPoints
      ticketMarketInstance = await TicketMarket.deployed(
         ticketInstance.address,
         web3.utils.toWei("0.01", "ether")
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
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      // Create a ticket and capture the event
      await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
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
   it("Ticket cannot be listed for sale for greater than 20% extra", async () => {
      // Details for creating a ticket
      const concertId = 4;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      // Create a ticket and capture the event
      let transaction = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );
      const listingPrice = web3.utils.toWei("0.13", "ether"); // Listing price must be >= ticketPrice + commissionFee

      const ticketCreatedEvent = transaction.logs[0].args;
      // List the ticket for sale
      await truffleAssert.fails(
         ticketMarketInstance.list(
            ticketCreatedEvent.ticketId - 1,
            listingPrice,
            { from: owner }
         )
      );
   });

   // Test that a ticket can be listed
   it("Ticket can be listed for sale for less than 20% extra", async () => {
      // Details for creating a ticket
      const concertId = 4;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      // Create a ticket and capture the event
      let transaction = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );
      const listingPrice = web3.utils.toWei("0.11", "ether"); // Listing price must be >= ticketPrice + commissionFee

      const ticketCreatedEvent = transaction.logs[0].args;
      // List the ticket for sale
      transaction = await ticketMarketInstance.list(
         ticketCreatedEvent.ticketId - 1,
         listingPrice,
         { from: owner }
      );
      const ticketListedEvent = transaction.logs[0].args;
      assert.equal(
         ticketListedEvent.price,
         listingPrice,
         "The ticket was not listed at the correct price"
      );
   });

   //To test the unlisting of a ticket
   it("Ticket can be unlisted from market", async () => {
      assert(await ticketMarketInstance.unlist(1), "Ticket not unlisted");
   });

   it("should allow a ticket to be bought from the market", async () => {
      // Step 1: Create a ticket
      // Details for creating a ticket
      const concertId = 4;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );

      // Step 2: List the ticket for sale
      let ticketId = 1; // Assuming this is the ID of the created ticket; adjust as needed
      const listingPrice = web3.utils.toWei("0.11", "ether"); // Listing price must be >= ticketPrice + commissionFee

      await ticketMarketInstance.list(ticketId, listingPrice, { from: owner });

      // Verify the ticket is listed by checking the listed price
      const listedPrice = await ticketMarketInstance.getTicketPrice(ticketId);
      assert.equal(
         listedPrice.toString(),
         listingPrice,
         "Ticket was not listed correctly"
      );

      // Step 3: Attempt to buy the listed ticket
      const txResult = await ticketMarketInstance.buy(ticketId, {
         from: buyer,
         value: listingPrice,
      });

      // Step 4: Verify the purchase
      // Check for the TicketSold event
      truffleAssert.eventEmitted(
         txResult,
         "TicketSold",
         (ev) => {
            return ev.ticketId.toNumber() === ticketId && ev.buyer === buyer;
         },
         "TicketSold event should be emitted with correct parameters"
      );

      // Optionally, verify buyer is the new owner if your Ticket contract supports it
      const newOwner = await ticketInstance.getOwner(ticketId);
      assert.equal(
         newOwner,
         buyer,
         "Buyer should be the new owner of the ticket"
      );

      // Optionally, verify the ticket is no longer listed
      const priceAfterPurchase = await ticketMarketInstance.getTicketPrice(
         ticketId
      );
      assert.equal(
         priceAfterPurchase.toString(),
         "0",
         "Ticket should be unlisted after purchase"
      );
   });

   //Test Case: Attempting to Buy an Unlisted Ticket
   it("should revert when trying to buy an unlisted ticket", async () => {
      const unlistedTicketId = 5; // Assuming this ticket is not listed
      await truffleAssert.reverts(
         ticketMarketInstance.buy(unlistedTicketId, {
            from: buyer,
            value: web3.utils.toWei("1", "ether"),
         }),
         "Ticket must be listed for sale"
      );
   });

   // Test Case: Listing and Unlisting a Ticket
   it("should allow listing and then unlisting a ticket", async () => {
      const ticketId = 2;
      const listingPrice = web3.utils.toWei("0.12", "ether");

      // List the ticket for sale
      await ticketMarketInstance.list(ticketId, listingPrice, { from: owner });

      // Unlist the ticket
      await ticketMarketInstance.unlist(ticketId, { from: owner });

      // Verify the ticket is unlisted
      const priceAfterUnlisting = await ticketMarketInstance.getTicketPrice(
         ticketId
      );
      assert.equal(
         priceAfterUnlisting.toString(),
         "0",
         "Ticket should be unlisted"
      );
   });
});
