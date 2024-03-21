const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const TicketMarket = artifacts.require("TicketMarket");
const truffleAssert = require("truffle-assertions");
const BigNumber = require("bignumber.js");

contract("TicketMarket", function (accounts) {
    let ticketTokenInstance, ticketMarketInstance, ticketInstance;
    const organizer = accounts[0];
    const buyer = accounts[1];


    beforeEach(async () => {
        ticketTokenInstance = await TicketToken.new();
        ticketInstance = await Ticket.new(ticketTokenInstance.address);
        // Deploy TicketMarket contract with commission fee and address of LoyaltyPoints
        ticketMarketInstance = await TicketMarket.new(ticketTokenInstance.address, web3.utils.toWei('0.01', 'ether'), organizer);
    });


    it("should deploy the contracts correctly", async () => {
        assert(ticketMarketInstance.address, "TicketMarket contract was not deployed");
        assert(ticketTokenInstance.address, "TicketToken contract was not deployed");
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
            concertId, concertName, concertVenue, concertDate,
            ticketCategory, ticketSectionNo, ticketSeatNo, price, { from: organizer }
        );
    
        const ticketId = await ticketInstance.getTicketId(0); 
        const ownerAddress = await ticketInstance.getOwner(ticketId);
    
        // Corrected assertion: Check if the returned owner address matches the organizer's address
        assert.equal(ownerAddress, organizer, "Organizer must be the owner of the ticket");
    });
    
    // Test that a ticket cannot be listed if the price is less than creation value + commission
    it("Ticket cannot be listed if the price is less than creation value + commission", async () => {
        // no ether
        await truffleAssert.fails(ticketMarketInstance.list(0, 0, { from: organizer }));
    });

    // Test that a ticket can be listed
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
        await ticketInstance.createTicket(
            concertId, concertName, concertVenue, concertDate,
            ticketCategory, ticketSectionNo, ticketSeatNo, price, { from: organizer }
        );

        //console.log("Ticket creation transaction:", createTx);

        // List the ticket for sale
        const listingPrice = web3.utils.toWei("0.11", "ether"); // commission fee was 0.01 ether
        await ticketMarketInstance.list(0, listingPrice, { from: accounts[0] });

        //const isListed = await ticketMarketInstance.list(0, listingPrice);
        //console.log("Is ticket listed:", isListed);

        // Verify listing
        const finalPrice = await ticketMarketInstance.getTicketPrice(0);

        // Calculate expected final price considering commission
        const commission = await ticketMarketInstance.getCommission();
        const expectedFinalPrice = web3.utils.toBN(price).add(web3.utils.toBN(commission));

        truffleAssert.strictEqual(finalPrice.toString(), expectedFinalPrice.toString(), "The ticket was not listed at the correct price");

    });
});    