const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const Lottery = artifacts.require("Lottery");
const { expectRevert, time } = require('@openzeppelin/test-helpers');

contract("Lottery", (accounts) => {
    let ticketInstance;
    let lotteryInstance;
    let owner = accounts[0];
    let participant1 = accounts[1];
    let participant2 = accounts[2];

    beforeEach(async () => {
        ticketTokenInstance = await TicketToken.deployed({ from: owner });
        ticketInstance = await Ticket.deployed(ticketTokenInstance.address, { from: owner });
        lotteryInstance = await Lottery.deployed(ticketInstance.address, { from: owner });
    });

    it("lottery should be inactive by default", async () => {
        const isActive = await lotteryInstance.lotteryActive();
        assert.isFalse(isActive, "Lottery should not be active initially.");
    });

    it("should let the owner start the lottery", async () => {
        const duration = 3600; // 1 hour in seconds
        await lotteryInstance.startLottery(duration, { from: owner });
        const lotteryActive = await lotteryInstance.lotteryActive();
        assert(lotteryActive, "Lottery should be active.");
    });

    it("should not let a non-owner start the lottery", async () => {
        const duration = 3600;
        await expectRevert(
            lotteryInstance.startLottery(duration, { from: participant1 }),
            "Only the owner can call this function."
        );
    });

    it("should allow adding participants when the lottery is active", async () => {
        const duration = 3600; // 1 hour in seconds
        await lotteryInstance.addParticipant(participant1, { from: participant1 });
        const participants = await lotteryInstance.participants(0);
        assert.equal(participants, participant1, "Participant1 should be added to the lottery.");
    });

    it("should not allow adding participants when the lottery is not active", async () => {
        try {
            await lotteryInstance.addParticipant(participant1, { from: participant1 });
            assert.fail("Expected transaction to revert!");
        } catch (error) {
            assert.include(error.message, "revert", "Expected transaction to revert!");
        }
    });

    it("should end the lottery correctly and select a winner", async () => {
        const duration = 2;
        await lotteryInstance.addParticipant(participant1, { from: participant1 });
        await lotteryInstance.addParticipant(participant2, { from: participant2 });

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
            { from: owner }
        );

        // Create tickets available for the lottery
        await lotteryInstance.addAvailableTicketId(0, { from: owner });

        // Fast forward time to ensure lottery has ended
        await time.increase(duration + 5000);

        ticketInstance.setLotteryAddress(lotteryInstance.address);

        const receipt = await lotteryInstance.endLottery({ from: owner });
        const winnerAddress = receipt.logs[0].args.winner;
        const winningTicketId = receipt.logs[0].args.ticketId;
        const ticketOwner = await ticketInstance.getOwner(winningTicketId);

        // Assert that the winning address now owns the ticket
        assert.equal(ticketOwner, winnerAddress, "The winner should own the winning ticket.");
    });
});
