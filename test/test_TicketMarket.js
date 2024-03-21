const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const TicketMarket = artifacts.require("TicketMarket");
const truffleAssert = require("truffle-assertions");
const BigNumber = require("bignumber.js");

contract("TicketMarket", function (accounts) {
    let ticketTokenInstance, ticketMarketInstance, ticketInstance;
    const owner = accounts[0];
    const buyer = accounts[1];

    beforeEach(async () => {
        ticketTokenInstance = await TicketToken.new();
        ticketInstance = await Ticket.new(ticketTokenInstance.address);
        // Deploy TicketMarket contract with commission fee and address of LoyaltyPoints
        ticketMarketInstance = await TicketMarket.new(ticketTokenInstance.address, web3.utils.toWei('0.01', 'ether'), accounts[0]);
    });


    it("should deploy the contracts correctly", async () => {
        assert(ticketMarketInstance.address, "TicketMarket contract was not deployed");
        assert(ticketTokenInstance.address, "TicketToken contract was not deployed");
        assert(ticketInstance.address, "Ticket contract was not deployed");
    });

    // Test that a ticket cannot be listed if the price is less than creation value + commission
    it("Ticket cannot be listed if the price is less than creation value + commission", async () => {
        // no ether
        await truffleAssert.fails(ticketMarketInstance.list(0, 0, { from: accounts[0] }));
    });

    // Tes that a ticket can be listed
    it("should allow a ticket owner to list a ticket for sale", async () => {
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
        const createTx = await ticketInstance.createTicket(
            concertId, concertName, concertVenue, concertDate,
            ticketCategory, ticketSectionNo, ticketSeatNo, price, { from: owner }
        );

        console.log("Ticket creation transaction:", createTx);


        // List the ticket for sale
        const listingPrice = web3.utils.toWei("0.15", "ether"); // Price higher than the cost to include commission
        await ticketMarketInstance.list(0, listingPrice, { from: owner });

        const isListed = await ticketMarketInstance.list(0, listingPrice);
        console.log("Is ticket listed:", isListed);


        // Verify listing
        const finalPrice = await ticketMarketInstance.getTicketPrice(0);
        assert.equal(finalPrice.toString(), listingPrice, "The ticket was not listed at the correct price");
    });

});    