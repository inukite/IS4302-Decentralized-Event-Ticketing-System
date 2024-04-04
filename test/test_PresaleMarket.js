const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const PresaleMarket = artifacts.require("PresaleMarket");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const PriorityQueue = artifacts.require("PriorityQueue");
const FutureConcertPoll = artifacts.require("FutureConcertPoll");
const truffleAssert = require('truffle-assertions');
const assert = require("assert");
const BigNumber = require("bignumber.js");
const { expect } = require('chai');
const { time } = require('@openzeppelin/test-helpers');

contract("PresaleMarket", async (accounts) => {
    let presaleMarketInstance;
    let priorityQueueInstance;
    let loyaltyPointsInstance;
    let ticketInstance;
    let futureConcertPollInstance;
    const organizer = accounts[0];
    const buyer1 = accounts[1];
    const buyer2 = accounts[2];
    const buyer3 = accounts[3];
    const buyer4 = accounts[4];
    const ticketPrice = web3.utils.toWei("0.1", "ether");

    beforeEach(async () => {
        // Deploy TicketToken first since it's a dependency for the Ticket contract
        ticketTokenInstance = await TicketToken.deployed({ from: organizer });

        // Deploy the rest of the contracts with their respective dependencies
        ticketInstance = await Ticket.deployed(ticketTokenInstance.address, { from: organizer });

        loyaltyPointsInstance = await LoyaltyPoints.deployed({ from: organizer });
        priorityQueueInstance = await PriorityQueue.deployed(loyaltyPointsInstance.address, { from: organizer });
        presaleMarketInstance = await PresaleMarket.deployed(
            priorityQueueInstance.address,
            loyaltyPointsInstance.address,
            ticketInstance.address,
            { from: organizer }
        );
        futureConcertPollInstance = await FutureConcertPoll.deployed(loyaltyPointsInstance.address, { from: organizer });
    });

    it("should set the correct organizer", async () => {
        const actualOrganizer = await presaleMarketInstance.organizer();
        assert.equal(actualOrganizer, organizer, "Organizer is not correctly set");
    });

    // Test event creation
    it("should allow the organizer to create an event", async () => {

        // Call the createEvent function and capture the transaction receipt
        let tx = await presaleMarketInstance.createEvent(
            1, // concertId
            "Example Concert", // concertName
            "Example Venue", // concertVenue
            Math.floor(Date.now() / 1000) + 86400, // concertDate, assuming it's tomorrow
            web3.utils.toWei("0.1", "ether"), // price
            { from: organizer }
        );

        // Assert that the EventCreatedWithTickets event was emitted
        truffleAssert.eventEmitted(tx, 'EventCreated', (ev) => {
            return ev.concertId.toNumber() === 1
        }, "EventCreatedWithTickets event should be emitted with correct parameters");

    });

    //Test that tickets can only be released 1 week before the event
    it("allows the organizer to release tickets 1 week before an event", async () => {
        // Set the PresaleMarket address in the Ticket contract so that a ticket can be created 
        await ticketInstance.setPresaleMarketAddress(presaleMarketInstance.address, { from: organizer });

        const oneWeekInSeconds = 604800; // Number of seconds in one week
        let oneWeekFromNow = (await web3.eth.getBlock('latest')).timestamp + oneWeekInSeconds;

        await presaleMarketInstance.createEvent(
            1, // concertId
            "Example Concert", // concertName
            "Example Venue", // concertVenue
            oneWeekFromNow,
            web3.utils.toWei("0.1", "ether"), // price
            { from: organizer }
        );

        // Advance the blockchain time to be within 1 week before the event
        await time.increaseTo(oneWeekFromNow - (2 * 24 * 60 * 60)); // 2 days before the event

        await presaleMarketInstance.releaseTicket(1, { from: organizer }); // Assuming 1 is the concertId

        // Verify tickets are marked as released
        const eventDetails = await presaleMarketInstance.getEventDetails(1);
        assert.equal(eventDetails.ticketsReleased, true, "Tickets should be marked as released.");
    });


    it("reverts when a non-organizer tries to release tickets", async () => {
        await presaleMarketInstance.createEvent(
            1, // concertId
            "Example Concert", // concertName
            "Example Venue", // concertVenue
            Math.floor(Date.now() / 1000) + 86400, // concertDate, assuming it's tomorrow
            web3.utils.toWei("0.1", "ether"), // price
            { from: organizer }
        );

        try {
            await presaleMarketInstance.releaseTicket(1, { from: buyer1 });
            expect.fail("Expected an error but did not get one");
        } catch (error) {
            expect(error.message).to.include("revert", "Expected 'revert' but got '" + error.message + "' instead");
        }
    });

    it("should be able to create a new ticket and tag it to the event created", async () => {
        let eventTx = await presaleMarketInstance.createEvent(
            2, // Using a different concertId to avoid collision
            "Test Concert",
            "Test Venue",
            Math.floor(Date.now() / 1000) + 86400, // Future date
            web3.utils.toWei("0.1", "ether"),
            { from: organizer }
        );

        truffleAssert.eventEmitted(eventTx, 'EventCreated', (ev) => {
            return ev.concertId.toNumber() === 2;
        }, "Event should be created successfully");

        // Create a ticket and associate it with the event
        let ticketTx = await presaleMarketInstance.createTicketAndAddToEvent(
            2, // concertId must match the created event
            "Test Concert",
            "Test Venue",
            Math.floor(Date.now() / 1000) + 86400, // Make sure this matches the event
            1, // ticketSectionNo
            1, // ticketSeatNo
            web3.utils.toWei("0.1", "ether"),
            { from: organizer }
        );

        // Instead of asserting ticketTx > 0, check for event emission
        truffleAssert.eventEmitted(ticketTx, 'TicketAssignedToEvent', (ev) => {
            return ev.concertId.toNumber() === 2; // Ensure the ticket is tagged to the correct event
        }, "Ticket should be tagged to the event successfully");
    });

    // Test buying tickets
    it("should allow a buyer with highest priority to purchase a ticket", async () => {
        const oneWeekInSeconds = 604800; // One week in seconds
        let currentTime = await time.latest();
        let oneWeekFromNow = currentTime.add(time.duration.seconds(oneWeekInSeconds));

        // Allow presaleMarket to be authorized callers in the ticket & loyaltyPoints contract
        await ticketInstance.setPresaleMarketAddress(presaleMarketInstance.address, { from: organizer });
        await loyaltyPointsInstance.setPresaleMarketAddress(presaleMarketInstance.address, { from: organizer });
        await priorityQueueInstance.setPresaleMarketAddress(presaleMarketInstance.address, { from: organizer });

        // Create an event with concert ID 1 
        await presaleMarketInstance.createEvent(1, "Example Concert", "Example Venue", oneWeekFromNow, ticketPrice, { from: organizer });

        // Details for creating a ticket
        const concertId = 1;
        const concertName = "Example Concert";
        const concertVenue = "Example Venue";
        const concertDate = oneWeekFromNow;
        const ticketSectionNo = 2;
        const ticketSeatNo = 300;
        const price = ticketPrice;

        // Advance time to just before the release window
        await time.increaseTo(oneWeekFromNow.sub(time.duration.days(2)));

        // Create a ticket and capture the event
        await presaleMarketInstance.createTicketAndAddToEvent(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            ticketSectionNo,
            ticketSeatNo,
            price,
            { from: organizer }
        );

        // Release the tickets
        await presaleMarketInstance.releaseTicket(1, { from: organizer });

        await loyaltyPointsInstance.addLoyaltyPoints(buyer1, 10, { from: organizer });
        await priorityQueueInstance.enqueue(buyer1, { from: organizer });

        // Buy a ticket
        let txResult = await presaleMarketInstance.buyTicket(1, 0, { from: buyer1, value: ticketPrice });

        // Listen for the TicketPurchased event and assert
        truffleAssert.eventEmitted(txResult, "TicketPurchased", (ev) => {
            return ev.ticketId.toNumber() === 0 && ev.buyer === buyer1;
        }, "Ticket purchase should emit TicketPurchased event with correct parameters.");
    });


    // Test redeeming a ticket
    it("should allow a ticket to be redeemed on the day of the event and award loyalty points", async () => {
        // Create an event and a ticket for today
        const concertId = 3;
        const concertDate = await time.latest();

        await presaleMarketInstance.createEvent(
            concertId,
            "Live Concert Today",
            "Virtual Venue",
            concertDate.toNumber(),
            ticketPrice,
            { from: organizer }
        );

        // Create a ticket for this event
        let ticketTx = await presaleMarketInstance.createTicketAndAddToEvent(
            concertId,
            "Live Concert Today",
            "Virtual Venue",
            concertDate.toNumber(),
            1, // ticketSectionNo
            1, // ticketSeatNo
            ticketPrice,
            { from: organizer }
        );
        const ticketId = ticketTx.logs[0].args.ticketId.toNumber();

        await ticketInstance.transfer(ticketId, buyer2, ticketPrice, { from: organizer });

        // Redeem the ticket on the day of the event (user does not want to vote)
        await presaleMarketInstance.redeemInPresaleMarket(ticketId, false, 0, 0, { from: buyer2 });

        // Verify the ticket is marked as redeemed
        const ticketState = await ticketInstance.getTicketState(ticketId);
        assert.equal(ticketState.toNumber(), 1, "Ticket should be marked as redeemed (state 1)");

        // Verify loyalty points were awarded
        const loyaltyPoints = await loyaltyPointsInstance.getPoints(buyer2);
        expect(loyaltyPoints.toNumber()).to.equal(10, "Buyer should be awarded 10 loyalty points for redeeming a ticket");
    });

    it("should not allow a ticket to be redeemed again if it has already been redeemed", async () => {

        const concertId = 4;
        const concertName = "Second Live Concert";
        const concertVenue = "Virtual Venue Again";
        const ticketPrice = web3.utils.toWei("0.1", "ether");
        const now = await time.latest();
        const concertDate = now.toNumber(); // Using 'now' for simplicity

        await presaleMarketInstance.createEvent(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            ticketPrice,
            { from: organizer }
        );

        let ticketTx = await presaleMarketInstance.createTicketAndAddToEvent(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            1, // Assuming section number
            1, // Assuming seat number
            ticketPrice,
            { from: organizer }
        );

        // Organizer creates an upcoming concert option
        const concertNameUpcoming = "The Big Concert";
        const concertVenueUpcoming = "Big Arena";
        const concertDateUpcoming = await time.latest();

        await futureConcertPollInstance.addConcertOption(concertNameUpcoming, concertVenueUpcoming, concertDateUpcoming, { from: organizer });

        const ticketId = ticketTx.logs[0].args.ticketId.toNumber();

        // Transfer the ticket to buyer3
        await ticketInstance.transfer(ticketId, buyer3, ticketPrice, { from: organizer });

        //Add loyaltyPoints to buyer3 for voting
        await loyaltyPointsInstance.addLoyaltyPoints(buyer3, 100, { from: organizer });

        // Redeem the ticket on the day of the event (user does not want to vote)
        await presaleMarketInstance.redeemInPresaleMarket(ticketId, false, 0, 0, { from: buyer3 });

        // Attempt to redeem the ticket again (user does not want to vote)
        await truffleAssert.reverts(
            presaleMarketInstance.redeemInPresaleMarket(ticketId, false, 0, 0, { from: buyer3 }),
            null,
            "Should revert because the ticket has already been redeemed"
        );
    });

    it("allows ticket redeemers to register and vote on a concert option", async () => {
        // Create an event and a ticket for today
        const concertId = 3;
        const concertDate = await time.latest();

        await presaleMarketInstance.createEvent(
            concertId,
            "Live Concert Today",
            "Virtual Venue",
            concertDate.toNumber(),
            ticketPrice,
            { from: organizer }
        );

        // Create a ticket for this event
        let ticketTx = await presaleMarketInstance.createTicketAndAddToEvent(
            concertId,
            "Live Concert Today",
            "Virtual Venue",
            concertDate.toNumber(),
            1, // ticketSectionNo
            1, // ticketSeatNo
            ticketPrice,
            { from: organizer }
        );
        const ticketId = ticketTx.logs[0].args.ticketId.toNumber();

        await ticketInstance.transfer(ticketId, buyer4, ticketPrice, { from: organizer });

        await loyaltyPointsInstance.setPresaleMarketAddress(presaleMarketInstance.address, { from: organizer });

        // Simulate ticket redemption and voting
        // When the user redeems the ticket -> earns 10 loyaltyPoints
        // Afterwards, uses up all 10 loyaltyPoints to vote
        await presaleMarketInstance.redeemInPresaleMarket(ticketId, true, 1, 10, { from: buyer4 });

        // Verify the vote has been cast
        const totalVotes = await futureConcertPollInstance.getTotalVotes(1);
        assert.equal(totalVotes.toNumber(), 10, "The vote was not registered correctly");

        // Verify the user's loyalty points have been deducted
        const remainingPoints = await loyaltyPointsInstance.getPoints(buyer4);
        assert.equal(remainingPoints.toNumber(), 0, "Loyalty points were not deducted correctly");
    });
});
