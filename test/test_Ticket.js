const Ticket = artifacts.require("Ticket");
const TicketToken = artifacts.require("TicketToken");

contract("Ticket", function (accounts) {
   let ticketTokenInstance, ticketInstance;

   beforeEach(async () => {
      ticketTokenInstance = await TicketToken.new();
      ticketInstance = await Ticket.new(ticketTokenInstance.address);
   });

   const owner = accounts[0];
   const attendee1 = accounts[1];
   const attendee2 = accounts[2];

   it("should deploy the contracts correctly", async () => {
      assert(ticketInstance.address, "Ticket contract was not deployed");
   });

   //Test that the organizer is correctly set for the ticket
   it("deploys successfully and sets the owner", async () => {
      const ownerAddress = await ticketInstance.owner();
      assert.equal(ownerAddress, owner, "The owner is not set correctly.");
   });

   //Check that the ticket was corrected correctly
   it("creates a ticket and assigns it to an owner", async () => {
      const concertId = 1;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      const result = await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );
      const ticketCreatedEvent = result.logs[0].args;
      assert.equal(
         ticketCreatedEvent.ticketId.toNumber(),
         0,
         "Ticket ID is not correct."
      );
      assert.equal(
         ticketCreatedEvent.owner,
         owner,
         "Owner is not set correctly."
      );
   });

   //Test that the redeem ticket function works
   it("redeems a ticket", async () => {
      const concertId = 2;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );

      await ticketInstance.redeemTicket(0, { from: owner });
      const ticketState = await ticketInstance.getTicketState(0);
      assert.equal(ticketState.toNumber(), 1, "Ticket state is not Redeemed.");
   });

   //Test that the freeze ticket function works
   it("freezes a ticket after the event", async () => {
      const concertId = 3;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = web3.utils.toWei("0.1", "ether");

      await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: owner }
      );

      await ticketInstance.freezeTicket(0, { from: owner });
      const ticketState = await ticketInstance.getTicketState(0);
      assert.equal(ticketState.toNumber(), 2, "Ticket state is not Frozen.");
   });

   //Test that the transfer ownership function works
   it("transfers ticket ownership", async () => {
      const concertId = 4;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = 20;

      await ticketInstance.createTicket(
         concertId,
         concertName,
         concertVenue,
         concertDate,
         ticketSectionNo,
         ticketSeatNo,
         price,
         { from: accounts[0] }
      );

      await ticketInstance.transfer(0, attendee1, price, { from: accounts[0] });
      const owner = await ticketInstance.getOwner(0);
      assert.equal(
         owner,
         attendee1,
         "Ownership was not transferred correctly."
      );
   });

   it("prevents unauthorized ticket creation", async () => {
      const concertId = 4;
      const concertName = "Taylor Swift";
      const concertVenue = "Singapore Indoor Sports Hall";
      const concertDate = 1;
      const ticketSectionNo = 2;
      const ticketSeatNo = 300;
      const price = 200;
      try {
         await ticketInstance.createTicket(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            ticketSectionNo,
            ticketSeatNo,
            price,
            { from: accounts[2] }
         );
         assert.fail("The transaction should have thrown an error.");
      } catch (err) {
         assert.include(
            err.message,
            "revert",
            'The error message should contain "revert".'
         );
      }
   });
});
