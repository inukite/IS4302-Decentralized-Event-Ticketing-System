const TicketToken = artifacts.require("TicketToken");
const TicketMarket = artifacts.require("TicketMarket");
const truffleAssert = require("truffle-assertions");
const BigNumber = require("bignumber.js");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("TicketMarket", function (accounts) {
    let ticketTokenInstance, ticketMarketInstance;

    beforeEach(async () => {
        ticketTokenInstance = await TicketToken.new();
        ticketMarketInstance = await TicketMarket.new(ticketTokenInstance.address, 0); // let the commission fee be 0
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