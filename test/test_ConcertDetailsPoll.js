const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const ConcertDetailsPoll = artifacts.require("ConcertDetailsPoll");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const BigNumber = require("bignumber.js");

contract("ConcertDetailsPoll", (accounts) => {
   let ticketInstance, ticketTokenInstance, concertDetailsPollInstance;
   const owner = accounts[0];
   const ticketHolder1 = accounts[1];
   const ticketHolder2 = accounts[2];

   before(async () => {
      ticketTokenInstance = await TicketToken.deployed();
      ticketInstance = await Ticket.deployed(ticketTokenInstance.address);
      concertDetailsPollInstance = await ConcertDetailsPoll.deployed(ticketInstance.address);
   });

   it("should create a poll", async () => {
      const question = "Which is your favorite color?";
      const options = ["Red", "Green", "Blue"];

      const txResult = await concertDetailsPollInstance.createPoll(0, question, options);

      assert.equal(
         txResult.logs[0].args.question,
         question,
         "Poll question should match"
      );
   });

   it("should vote on a poll", async () => {
      const pollId = 0; // Assuming we're voting on the first poll created
      const optionId = 0; // Assuming we're selecting the first option

      const concertId = 0;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      // Create a ticket and capture the event
      let transaction = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price
      );

      const ticketId = transaction.logs[0].args.ticketId;
      const txResult = await concertDetailsPollInstance.vote(ticketId, pollId, optionId);

      const event = txResult.logs.find((log) => log.event === "Voted");
      // Assert that the event was emitted with the correct values
      assert.equal(
         event.args.ticketId.toNumber(),
         ticketId.toNumber(),
         "Ticket ID should match"
      );
   });

   it("should close a poll", async () => {
      const pollId = 0; // Assuming we're closing the first poll created

      const txResult = await concertDetailsPollInstance.closePoll(pollId);
      assert.equal(
         txResult.logs[0].args.pollId.toNumber(),
         pollId,
         "Poll is not closed"
      );
   });
});
