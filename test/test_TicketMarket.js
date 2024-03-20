const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const TicketMarket = artifacts.require("TicketMarket");
const truffleAssert = require("truffle-assertions");
const BigNumber = require("bignumber.js");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("TicketMarket", function (accounts) {
    let ticketTokenInstance, ticketMarketInstance, ticketInstance;

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

    // Test that Ticket can be listed
    it("Ticket can be listed", async () => {
        // Calculate the price including commission fee
        let value = await ticketInstance.getPrice(0);
        let commissionFee = await ticketMarketInstance.commissionFee();
        let price = value.add(commissionFee);
        await ticketInstance.listTicketForSale(0, price, { from: owner });
        let listedPrice = await ticketMarketInstance.checkPrice(0);

        // if listed, listedPrice will be non-zero
        assert.notStrictEqual(listedPrice.toString(), "0", "Ticket not listed");
    });

    it("should allow buying a ticket with enough TicketToken", async () => {
        let ticketId = 1;
        let ticketPrice = new BigNumber(await ticketMarketInstance.getTicketPrice(ticketId));

        // First, list the ticket for sale
        await ticketMarketInstance.list(ticketId, ticketPrice); // List the ticket for sale

        // Now proceed with buying the ticket
        await ticketTokenInstance.getCredit({ value: ticketPrice, from: accounts[1] }); // Get TicketToken credits
        await ticketMarketInstance.buy(ticketId, { from: accounts[1] }); // Buy the ticket

        let ticketCount = await ticketTokenInstance.balanceOf(accounts[1]);
        assert.equal(ticketCount.toString(), "1", "Account should have exactly 1 ticket after purchase");
    });

    it("should not allow buying a ticket without enough TicketToken", async () => {
        let ticketId = 1;
        let ticketPrice = new BigNumber(await ticketMarketInstance.getTicketPrice(ticketId));

        // First, list the ticket for sale
        await ticketMarketInstance.list(ticketId, ticketPrice); // List the ticket for sale

        // Now attempt to buy the ticket without enough TicketToken
        let insufficientAmount = ticketPrice.minus(1);
        await expectRevert(
            ticketMarketInstance.buy(ticketId, { from: accounts[1] }),
            "Insufficient TicketToken balance"
        );
    });

    it("should allow selling a ticket", async () => {
        let ticketId = 1;
        let ticketPrice = new BigNumber(await ticketMarketInstance.getTicketPrice(ticketId));

        // First, list the ticket for sale
        await ticketMarketInstance.list(ticketId, ticketPrice); // List the ticket for sale

        // Buy the ticket to prepare for selling
        await ticketTokenInstance.getCredit({ value: ticketPrice, from: accounts[1] }); // Get TicketToken credits
        await ticketMarketInstance.buy(ticketId, { from: accounts[1] }); // Buy the ticket

        // Now proceed with selling the ticket
        await ticketMarketInstance.sell(ticketId, { from: accounts[1] }); // Sell the ticket

        let ticketCount = await ticketTokenInstance.balanceOf(accounts[1]);
        assert.equal(ticketCount.toString(), "0", "Account should have 0 tickets after selling");
    });
});    