const FutureConcertPoll = artifacts.require("FutureConcertPoll");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");

// needs to be integrated in ticketMarket and presaleTicketMarket 
// users are allowed to vote after they have purchased the ticket 

contract("FutureConcertPoll", async (accounts) => {
    let loyaltyPointsInstance;
    let futureConcertPollInstance;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    beforeEach(async () => {
        // Deploy LoyaltyPoints and FutureConcertPoll contracts
        loyaltyPointsInstance = await LoyaltyPoints.deployed({ from: owner });
        futureConcertPollInstance = await FutureConcertPoll.deployed(loyaltyPointsInstance.address, { from: owner });

        // Allow futureConcertPoll to be authorized caller in the loyaltyPoints contract
        await loyaltyPointsInstance.setFutureConcertPollAddress(futureConcertPollInstance.address, { from: owner });
    });

    it("should ensure users have sufficient loyalty points for voting", async () => {
        // Assign loyalty points to voter1 and voter2
        await loyaltyPointsInstance.addLoyaltyPoints(voter1, 100, { from: owner });
        await loyaltyPointsInstance.addLoyaltyPoints(voter2, 150, { from: owner });

        // Check the balances
        const balanceVoter1 = await loyaltyPointsInstance.getPoints(voter1);
        const balanceVoter2 = await loyaltyPointsInstance.getPoints(voter2);

        assert.equal(balanceVoter1.toNumber(), 100, "voter1 should have 100 loyalty points");
        assert.equal(balanceVoter2.toNumber(), 150, "voter2 should have 150 loyalty points");
    });

    it("should allow casting votes with loyalty points", async () => {
        const concertOptionId = 1;

        // Voter1 casts a vote
        await futureConcertPollInstance.castVote(concertOptionId, 50, { from: voter1 });

        // Verify vote count for concertOptionId
        const totalVotes = await futureConcertPollInstance.getTotalVotes(concertOptionId);
        assert.equal(totalVotes.toNumber(), 50, "The concert option should have 50 votes");

        // Verify voter1's loyalty points are deducted
        const balanceVoter1After = await loyaltyPointsInstance.getPoints(voter1);
        assert.equal(balanceVoter1After.toNumber(), 50, "voter1 should have 50 loyalty points after voting");
    });


    it("should not allow voting with more loyalty points than the user has", async () => {
        const concertOptionId = 2;

        try {
            await futureConcertPoll.castVote(concertOptionId, 200, { from: voter2 }); // voter2 has less than 200 points
            assert.fail("The transaction should have failed");
        } catch (error) {
            assert.ok(error.message, "revert", "The transaction should revert due to insufficient loyalty points");
        }
    });
});