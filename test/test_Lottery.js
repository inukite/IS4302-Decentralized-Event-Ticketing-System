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

        const duration = 3600; // Duration in seconds

        const concertId = 4;
        const concertName = "Taylor Swift";
        const concertVenue = "Singapore Indoor Sports Hall";
        const concertDate = (await web3.eth.getBlock('latest')).timestamp + duration * 2; // Future concert date
        const ticketSectionNo = 2;
        const ticketSeatNo = 300;
        const price = web3.utils.toWei('0.1', 'ether');

        await ticketInstance.setLotteryAddress(lotteryInstance.address);

        // Create and add a ticket to the available tickets of the lottery
        await lotteryInstance.createAndAddTicket(
            concertId,
            concertName,
            concertVenue,
            concertDate,
            ticketSectionNo,
            ticketSeatNo,
            price,
            { from: owner }
        );

        await lotteryInstance.resetParticipants();

        // Add participants to the lottery
        await lotteryInstance.addParticipant(participant1, { from: participant1 });
        await lotteryInstance.addParticipant(participant2, { from: participant2 });

        // Fast forward time to ensure the lottery has ended
        await time.increase(duration + 5000);

        // End the lottery and select a winner
        const receipt = await lotteryInstance.endLottery({ from: owner });
        const winnerAddress = receipt.logs[0].args.winner;
        const winningTicketId = receipt.logs[0].args.ticketId;
        const ticketOwner = await ticketInstance.getOwner(winningTicketId);

        assert.equal(ticketOwner, winnerAddress, "The winner should own the winning ticket.");
    });

    it("should not allow the lottery to end before the duration has elapsed", async () => {
        const duration = 3600; // 1 hour in seconds
        await lotteryInstance.startLottery(duration, { from: owner });
        // Wait for some time but not the full duration
        await time.increase(1800); // Increase time by half an hour

        // Attempting to end the lottery prematurely should fail
        await expectRevert(
            lotteryInstance.endLottery({ from: owner }),
            "Lottery time has not expired yet."
        );
    });

    it("should not allow the same address to participate multiple times", async () => {
        //Participant1 is already in the lottery, try adding again
        await expectRevert(
            lotteryInstance.addParticipant(participant1, { from: participant1 }),
            "Participant already added."
        );
    });

});
