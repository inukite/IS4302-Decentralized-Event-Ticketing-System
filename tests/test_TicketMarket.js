const _deploy_contracts = require("../migrations/deploy_contracts");
const truffleAssert = require("truffle-assertions"); // npm truffle-assertions
const BigNumber = require("bignumber.js"); // npm install bignumber.js
const { time, expectRevert } = require('@openzeppelin/test-helpers'); // npm install @openzeppelin/test-helpers
const Web3 = require('web3'); // npm install web3
var assert = require("assert");


var TicketToken = artifacts.require("../contracts/TicketToken.sol");
var TicketMarket = artifacts.require("../contracts/TicketMarket.sol");

const oneEth = new BigNumber(1000000000000000000); // 1 eth

contract("TicketMarket", function (accounts) {
    let ticketTokenInstance, ticketMarketInstance;

    beforeEach(async () => {
        // resets the contracts after each test case
        ticketTokenInstance = await TicketToken.new();
        ticketMarketInstance = await TicketMarket.new(ticketMarketInstance.address);
    });

    console.log("Testing Ticket Market contract");

    it("Buy Ticket Token", async () => {
        await ticketTokenInstance.buy({ from: accounts[1], value: oneEth });
        assert.strictEqual((await ticketTokenInstance.checkCredit(accounts[1])).toString(), "1", "Wrong amount of Ticket Tokens obtained");
    });

});



