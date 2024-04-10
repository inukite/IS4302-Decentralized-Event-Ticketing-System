const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const EventVoting = artifacts.require("EventVoting");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const BigNumber = require("bignumber.js");

contract("EventVoting", (accounts) => {
   let ticketInstance, ticketTokenInstance, eventVoting;
   const owner = accounts[0];
   const ticketHolder1 = accounts[1];
   const ticketHolder2 = accounts[2];

   before(async () => {
      ticketTokenInstance = await TicketToken.deployed();
      ticketInstance = await Ticket.deployed(ticketTokenInstance.address);
      eventVoting = await EventVoting.deployed(ticketInstance.address);
   });

   it("should create a poll", async () => {
      const question = "Which is your favorite color?";
      const options = ["Red", "Green", "Blue"];

      const txResult = await eventVoting.createPoll(0, question, options);

      assert.equal(
         txResult.logs[0].args.question,
         question,
         "Poll question should match"
      );
   });

   it("should vote on a poll", async () => {
      const pollId = 0; // Assuming we're voting on the first poll created
      const optionId = 1; // Assuming we're selecting the first option

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
      const txResult = await eventVoting.vote(ticketId, pollId, optionId);

      const event = txResult.logs.find((log) => log.event === "Voted");
      // Assert that the event was emitted with the correct values
      assert.equal(
         event.args.ticketId.toNumber(),
         ticketId.toNumber(),
         "Ticket ID should match"
      );
   });

   it("should only allow valid tickets to vote", async () => {
      const pollId = 0; // Assuming we're voting on the first poll created
      const optionId = 1; // Assuming we're selecting the first option

      // Create a ticket holder who doesn't have a ticket
      const nonTicketId = 3;

      // Ensure that non-ticket holders cannot vote
      await truffleAssert.fails(eventVoting.vote(3, pollId, optionId));
   });

   it("should allow retracting of votes", async () => {
      const pollId = 0; // Assuming we're voting on the first poll created
      const optionId = 1; // Assuming we're selecting the first option

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
         price,
         { from: owner }
      );

      const ticketId = transaction.logs[0].args.ticketId;

      // Vote on the poll
      await eventVoting.vote(ticketId, pollId, optionId);

      // Retract the vote
      const initialVotes = await eventVoting.getVotesForOption(
         pollId,
         optionId
      );
      await eventVoting.retractVote(ticketId, pollId);
      const finalVotes = await eventVoting.getVotesForOption(pollId, optionId);

      // Ensure that the vote count decreases by 1 after retraction
      assert.equal(
         finalVotes.toNumber(),
         initialVotes.toNumber() - 1,
         "Vote count should decrease by 1 after retraction"
      );
   });

   it("should only allow tickets of same concert to vote", async () => {
      const pollId = 0; // Assuming we're voting on the first poll created
      const optionId = 1; // Assuming we're selecting the first option

      const concertId = 3;
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
         price,
         { from: owner }
      );

      const ticketId = transaction.logs[0].args.ticketId;
      // Ensure that tickets of different concerts cannot vote
      await truffleAssert.reverts(
         eventVoting.vote(ticketId, pollId, optionId),
         "Ticket should be of same Concert"
      );
   });

   it("should close a poll", async () => {
      const pollId = 0; // Assuming we're closing the first poll created

      const txResult = await eventVoting.closePoll(pollId);
      assert.equal(
         txResult.logs[0].args.pollId.toNumber(),
         pollId,
         "Poll is not closed"
      );
   });
});
