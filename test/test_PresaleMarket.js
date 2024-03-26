const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const PresaleMarket = artifacts.require("PresaleMarket");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const PriorityQueue = artifacts.require("PriorityQueue");
const truffleAssert = require('truffle-assertions');
const assert = require("assert");
const BigNumber = require("bignumber.js");
const { expect } = require('chai');
const { time } = require('@openzeppelin/test-helpers');

contract("PresaleMarket", (accounts) => {
    let presaleMarketInstance;
    let priorityQueueInstance;
    let loyaltyPointsInstance;
    let ticketInstance;
    const organizer = accounts[0];
    const buyer1 = accounts[1];
    const buyer2 = accounts[2];
    const ticketPrice = web3.utils.toWei("0.1", "ether");

    beforeEach(async () => {
        // Deploy TicketToken first since it's a dependency for the Ticket contract
        ticketTokenInstance = await TicketToken.new({ from: organizer });

        // Deploy the rest of the contracts with their respective dependencies
        ticketInstance = await Ticket.new(ticketTokenInstance.address, { from: organizer });

        loyaltyPointsInstance = await LoyaltyPoints.new({ from: organizer });
        priorityQueueInstance = await PriorityQueue.new(loyaltyPointsInstance.address, { from: organizer });
        presaleMarketInstance = await PresaleMarket.new(
            priorityQueueInstance.address,
            ticketInstance.address,
            loyaltyPointsInstance.address,
            { from: organizer }
        );
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

    // Test buying tickets
    it("should allow a buyer with highest priority to purchase a ticket", async () => {
        const oneWeekInSeconds = 604800; // One week in seconds
        let currentTime = await time.latest();
        let oneWeekFromNow = currentTime.add(time.duration.seconds(oneWeekInSeconds));

        await presaleMarketInstance.createEvent(1, "Example Concert", "Example Venue", oneWeekFromNow, ticketPrice, { from: organizer });

        // Advance time to just before the release window
        await time.increaseTo(oneWeekFromNow.sub(time.duration.days(2)));

        // Release the tickets
        await presaleMarketInstance.releaseTicket(1, { from: organizer });

        // Assume setup for loyalty points and priority queue has been done elsewhere in the test script
        await loyaltyPointsInstance.addLoyaltyPoints(buyer1, 1000, { from: organizer });
        await priorityQueueInstance.enqueue(buyer1, { from: organizer });

        // Buy a ticket
        let txResult = await presaleMarketInstance.buyTicket(1, 1, { from: buyer1, value: ticketPrice });

        // Listen for the TicketPurchased event and assert
        truffleAssert.eventEmitted(txResult, "TicketPurchased", (ev) => {
            return ev.ticketId.toNumber() === 1 && ev.buyer === buyer1;
        }, "Ticket purchase should emit TicketPurchased event with correct parameters.");
    });
});