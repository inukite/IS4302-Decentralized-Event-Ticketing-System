const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const PriorityQueue = artifacts.require("PriorityQueue");
const TicketMarket = artifacts.require("TicketMarket");
const Ticket = artifacts.require("Ticket");
const BN = require('bignumber.js');

contract("PriorityQueue", function (accounts) {
    const [admin, buyer1, buyer2, buyer3] = accounts;

    beforeEach(async function () {
        // Deploy the Ticket contract correctly and reference its address
        this.ticket = await Ticket.new({ from: admin });
    
        // Deploy the LoyaltyPoints contract and reference its address
        this.loyaltyPoints = await LoyaltyPoints.new({ from: admin });
    
        // Deploy the TicketMarket with correct references to the Ticket and LoyaltyPoints contract addresses
        this.ticketMarket = await TicketMarket.new(this.ticket.address, 0, this.loyaltyPoints.address, { from: admin });
    
    });

    describe("Priority Queue Ticket Purchase Requests", function () {

        it("should allow the highest priority buyer to purchase a ticket first", async function () {
            // Request to purchase tickets
            await this.ticketMarket.requestTicketPurchase(buyer1, { from: buyer1 });
            await this.ticketMarket.requestTicketPurchase(buyer2, { from: buyer2 });
            await this.ticketMarket.requestTicketPurchase(buyer3, { from: buyer3 });
        
            // Process ticket purchases
            await this.ticketMarket.processTicketPurchases({ from: admin });
        
            // Assuming Ticket contract has a balanceOf function to check ticket ownership
            const ticketCount = await this.ticket.balanceOf(buyer2);
            assert(ticketCount.toNumber() > 0, "Buyer 2 should have a ticket.");
        });
    });
});