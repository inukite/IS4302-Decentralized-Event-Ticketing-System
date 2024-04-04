const FutureConcertPoll = artifacts.require("FutureConcertPoll");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");
const TicketToken = artifacts.require("TicketToken");
const Ticket = artifacts.require("Ticket");
const PriorityQueue = artifacts.require("PriorityQueue");
const PresaleMarket = artifacts.require("PresaleMarket");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const { time } = require('@openzeppelin/test-helpers');

contract("FutureConcertPoll", async (accounts) => {
    let loyaltyPointsInstance;
    let futureConcertPollInstance;
    let presaleMarketInstance;

    const organizer = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    beforeEach(async () => {
        ticketTokenInstance = await TicketToken.deployed({ from: organizer });
        ticketInstance = await Ticket.deployed(ticketTokenInstance.address, { from: organizer });
        loyaltyPointsInstance = await LoyaltyPoints.deployed({ from: organizer });
        futureConcertPollInstance = await FutureConcertPoll.deployed(loyaltyPointsInstance.address, { from: organizer });
        priorityQueueInstance = await PriorityQueue.deployed(loyaltyPointsInstance.address, { from: organizer });
        presaleMarketInstance = await PresaleMarket.deployed(
            priorityQueueInstance.address,
            loyaltyPointsInstance.address,
            ticketInstance.address,
            { from: organizer }
        );
    });

    it("should ensure users have sufficient loyalty points for voting", async () => {
        // Assign loyalty points to voter1 and voter2
        await loyaltyPointsInstance.addLoyaltyPoints(voter1, 100, { from: organizer });
        await loyaltyPointsInstance.addLoyaltyPoints(voter2, 150, { from: organizer });

        // Check the balances
        const balanceVoter1 = await loyaltyPointsInstance.getPoints(voter1);
        const balanceVoter2 = await loyaltyPointsInstance.getPoints(voter2);

        assert.equal(balanceVoter1.toNumber(), 100, "voter1 should have 100 loyalty points");
        assert.equal(balanceVoter2.toNumber(), 150, "voter2 should have 150 loyalty points");
    });

    it("should allow casting votes with loyalty points", async () => {
        // Organizer creates a concert option
        const concertName = "The Big Concert";
        const concertVenue = "Big Arena";
        let concertDate = (await time.latest()).add(time.duration.days(30)); // 30 days from now
        concertDate = concertDate.toNumber(); 
        
        // Add a concert option
        await futureConcertPollInstance.addConcertOption(concertName, concertVenue, concertDate, { from: organizer });

        // First concert created has concertOptionId = 1
        const concertOptionId = 1;

        // Voter1 registers to vote on concertOptionId
        await futureConcertPollInstance.registerToVote(concertOptionId, { from: voter1 });

        // Voter1 casts a vote
        await futureConcertPollInstance.castVote(concertOptionId, 50, { from: voter1 });

        // Verify vote count for concertOptionId
        const totalVotes = await futureConcertPollInstance.getTotalVotes(concertOptionId);
        assert.equal(totalVotes.toNumber(), 50, "The vote was not registered correctly");
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