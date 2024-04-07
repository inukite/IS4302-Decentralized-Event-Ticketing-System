const Lottery = artifacts.require("Lottery");
const { expectRevert, time } = require('@openzeppelin/test-helpers');

contract("Lottery", (accounts) => {
    let lotteryInstance;
    let owner = accounts[0];
    let participant1 = accounts[1];
    let participant2 = accounts[2];

    beforeEach(async () => {
        lotteryInstance = await Lottery.deployed({ from: owner });
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

        // Fast forward time to ensure lottery has ended
        await time.increase(duration + 5000);

        const initialBalance = new web3.utils.BN(await web3.eth.getBalance(participant1));

        const receipt = await lotteryInstance.endLottery({ from: owner });
        assert.equal(receipt.logs.length, 1, "endLottery should emit one event.");
        assert.equal(receipt.logs[0].event, "WinnerSelected", "Event should be WinnerSelected.");

        // Verify winner received the prize
        const winnerAddress = receipt.logs[0].args.winner;
        const newBalance = new web3.utils.BN(await web3.eth.getBalance(winnerAddress));
        const prizeAmount = new web3.utils.BN(receipt.logs[0].args.amount);
        assert(newBalance.sub(initialBalance).eq(prizeAmount), "Winner should receive the prize amount.");
    });
});
