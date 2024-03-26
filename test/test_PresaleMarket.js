const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const PresaleMarket = artifacts.require("PresaleMarket");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const PriorityQueue = artifacts.require("PriorityQueue");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const BigNumber = require("bignumber.js");

contract("PresaleMarket", (accounts) => {
    let presaleMarketInstance;
    let ticketInstance;
    let priorityQueueInstance;
    let loyaltyPointsInstance;
    let ticketTokenInstance;
    const organizer = accounts[0];
    const buyer1 = accounts[1];
    const buyer2 = accounts[2];

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

});