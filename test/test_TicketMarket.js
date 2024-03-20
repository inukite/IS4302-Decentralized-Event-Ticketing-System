const _deploy_contracts = require("../migrations/2_deploy_contracts");
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
        ticketMarketInstance = await TicketMarket.new(ticketTokenInstance.address);
    });

    console.log("Testing Ticket Market contract");

    it("Buy Ticket Token", async () => {
        await ticketMarketInstance.buy({ from: accounts[1], value: oneEth });
        assert.strictEqual((await ticketTokenInstance.checkCredit(accounts[1])).toString(), "1", "Wrong amount of Ticket Tokens obtained");
    });

    it("Sell Ticket Token", async () => {
        // First, buy a ticket token
        await ticketMarketInstance.buy({ from: accounts[1], value: oneEth });
        let initialBalance = new BigNumber(await web3.eth.getBalance(accounts[1]));
    
        // Then, sell the ticket token
        let tx = await ticketMarketInstance.sell(1, { from: accounts[1] }); // Assuming '1' is the token ID
        let finalBalance = new BigNumber(await web3.eth.getBalance(accounts[1]));
        let txFee = new BigNumber(tx.receipt.gasUsed).multipliedBy(new BigNumber(await web3.eth.getGasPrice()));
    
        assert(finalBalance.plus(txFee).minus(initialBalance).isEqualTo(oneEth), "Balance after selling the ticket token should increase by the price of one ticket.");
    });
    
});



