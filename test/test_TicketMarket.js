const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const TicketMarket = artifacts.require("TicketMarket");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const FutureConcertPoll = artifacts.require("FutureConcertPoll");
const Lottery = artifacts.require("Lottery");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const BigNumber = require("bignumber.js");
const { time } = require('@openzeppelin/test-helpers');


contract("TicketMarket", function (accounts) {
   let ticketTokenInstance;
   let ticketMarketInstance;
   let ticketInstance;
   let loyaltyPointsInstance;
   let futureConcertPollInstance;
   let lotteryInstance;
   const owner = accounts[0];
   const buyer = accounts[1];
   const buyer2 = accounts[2];
   const buyer3 = accounts[3];

   beforeEach(async () => {
      ticketTokenInstance = await TicketToken.deployed();
      ticketInstance = await Ticket.deployed(ticketTokenInstance.address);
      // Deploy TicketMarket contract with commission fee and address of LoyaltyPoints
      ticketMarketInstance = await TicketMarket.deployed(
         ticketInstance.address,
         web3.utils.toWei("0.01", "ether")
      );
      loyaltyPointsInstance = await LoyaltyPoints.deployed({ from: owner });
      futureConcertPollInstance = await FutureConcertPoll.deployed(loyaltyPointsInstance.address, { from: owner });
      lotteryInstance = await Lottery.deployed({ from: owner });
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

      // Check if the returned owner address matches the owner's address
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

   //Test the unlisting of a ticket
   it("Ticket can be unlisted from market", async () => {
      assert(await ticketMarketInstance.unlist(1), "Ticket not unlisted");
   });

   //Test that a ticket can be bought from the market
   it("should allow a ticket to be bought from the market", async () => {
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

      // List the ticket for sale
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

      // Start the lottery
      const lotteryDuration = 604800; // set as 7 days in seconds
      await lotteryInstance.startLottery(lotteryDuration, { from: owner });

      // Attempt to buy the listed ticket
      const txResult = await ticketMarketInstance.buy(ticketId, {
         from: buyer,
         value: listingPrice,
      });

      // Verify the purchase
      // Check for the TicketSold event
      truffleAssert.eventEmitted(
         txResult,
         "TicketSold",
         (ev) => {
            return ev.ticketId.toNumber() === ticketId && ev.buyer === buyer;
         },
         "TicketSold event should be emitted with correct parameters"
      );

      const newOwner = await ticketInstance.getOwner(ticketId);
      assert.equal(
         newOwner,
         buyer,
         "Buyer should be the new owner of the ticket"
      );

      // Verify the ticket is no longer listed
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

   // Test Case: Allowing a ticket to be redeemed and award loyalty points
   it("should allow a ticket to be redeemed and award loyalty points", async () => {

      // Details for creating a ticket
      const concertId = 5;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = await time.latest();
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      let ticketCreationTx = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate.toNumber(),
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );

      const listingPrice = web3.utils.toWei("0.12", "ether"); // Listing price must be >= ticketPrice + commissionFee

      const ticketId = ticketCreationTx.logs[0].args.ticketId.toNumber();

      // List the ticket for sale
      await ticketMarketInstance.list(ticketId, listingPrice, { from: owner });

      // Buy the ticket
      await ticketMarketInstance.buy(ticketId, {
         from: buyer2, value: listingPrice
      });

      // Allow ticketMarket to be authorized callers in the loyaltyPoints contract
      await loyaltyPointsInstance.setTicketMarketAddress(ticketMarketInstance.address, { from: owner });

      // Redeem the ticket on the day of the event (with no voting)
      await ticketMarketInstance.redeemInTicketMarket(ticketId, false, 0, 0, { from: buyer2 });

      // Verify the ticket is marked as redeemed
      const ticketState = await ticketInstance.getTicketState(ticketId);
      assert.equal(ticketState.toNumber(), 1, "Ticket should be marked as redeemed (state 1)");

      // Verify loyalty points were awarded
      const loyaltyPoints = await loyaltyPointsInstance.getPoints(buyer2);
      expect(loyaltyPoints.toNumber()).to.equal(10, "Buyer should be awarded 10 loyalty points for redeeming a ticket");
   });

   // Test Case: Not Allowing a ticket to be redeemed again
   it("should not allow a ticket to be redeemed again if it has already been redeemed", async () => {
      // Same setup from the previous test where a ticket is created, listed, and bought
      const concertId = 5;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = await time.latest();
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      let ticketCreationTx = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate.toNumber(),
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );

      const listingPrice = web3.utils.toWei("0.12", "ether"); // Listing price must be >= ticketPrice + commissionFee

      const ticketId = ticketCreationTx.logs[0].args.ticketId.toNumber();

      await ticketMarketInstance.list(ticketId, listingPrice, { from: owner });

      await lotteryInstance.resetParticipants();
      
      await ticketMarketInstance.buy(ticketId, {
         from: buyer2, value: listingPrice
      });

      await loyaltyPointsInstance.setTicketMarketAddress(ticketMarketInstance.address, { from: owner });

      // Redeem the ticket for the first time (with no voting)
      await ticketMarketInstance.redeemInTicketMarket(ticketId, false, 0, 0, { from: buyer2 });

      // Attempt to redeem the ticket again (with no voting)
      try {
         await ticketMarketInstance.redeemInTicketMarket(ticketId, false, 0, 0, { from: buyer2 });
         assert.fail("Should have thrown an error but did not");
      } catch (error) {
         // Check the error message to ensure it failed for the correct reason
         assert.ok(error.message.includes("already been redeemed"), "Error should be for already redeemed ticket");
      }
   });

   // Test Case: Allowing ticket redeemers to register and vote for upcoming concert
   it("allows ticket redeemers to register and vote on a concert option", async () => {

      // Details for creating a ticket
      const concertId = 5;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = await time.latest();
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      let ticketCreationTx = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate.toNumber(),
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );

      const listingPrice = web3.utils.toWei("0.12", "ether"); // Listing price must be >= ticketPrice + commissionFee

      const ticketId = ticketCreationTx.logs[0].args.ticketId.toNumber();

      // List the ticket for sale
      await ticketMarketInstance.list(ticketId, listingPrice, { from: owner });

      // Buy the ticket
      await ticketMarketInstance.buy(ticketId, {
         from: buyer3, value: listingPrice
      });

      // Organizer creates an upcoming concert option
      const concertNameUpcoming = "The Big Concert";
      const concertVenueUpcoming = "Big Arena";
      const concertDateUpcoming = await time.latest();

      await futureConcertPollInstance.addConcertOption(concertNameUpcoming, concertVenueUpcoming, concertDateUpcoming, { from: owner });

      // Allow ticketMarket to be authorized callers in the loyaltyPoints contract
      await loyaltyPointsInstance.setTicketMarketAddress(ticketMarketInstance.address, { from: owner });

      // Redeem the ticket on the day of the event (with voting)
      // When the user redeems the ticket -> earns 10 loyaltyPoints
      // Afterwards, uses up all 10 loyaltyPoints to vote
      await ticketMarketInstance.redeemInTicketMarket(ticketId, true, 1, 10, { from: buyer3 });

      // Verify the vote has been cast
      const totalVotes = await futureConcertPollInstance.getTotalVotes(1);
      assert.equal(totalVotes.toNumber(), 10, "The vote was not registered correctly");

      // Verify the user's loyalty points have been deducted
      const remainingPoints = await loyaltyPointsInstance.getPoints(buyer3);
      assert.equal(remainingPoints.toNumber(), 0, "Loyalty points were not deducted correctly");
   });

});