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
    const voter3 = accounts[3];

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

    it("only allows the organizer to add new concert options", async () => {
        const concertName = "New Concert";
        const concertVenue = "New Venue";
        const concertDate = Math.floor(Date.now() / 1000) + 86400;

        // Attempt to add a concert option by a non-organizer account
        await truffleAssert.reverts(
            futureConcertPollInstance.addConcertOption(concertName, concertVenue, concertDate, { from: voter1 }),
            "Only the organizer can perform this action"
        );
    });

    it("should ensure users have sufficient loyalty points for voting", async () => {
        // Assign loyalty points to voter1 and voter2
        await loyaltyPointsInstance.addLoyaltyPoints(voter1, 100, { from: organizer });
        await loyaltyPointsInstance.addLoyaltyPoints(voter2, 150, { from: organizer });
        await loyaltyPointsInstance.addLoyaltyPoints(voter3, 200, { from: organizer });

        // Check the balances
        const balanceVoter1 = await loyaltyPointsInstance.getPoints(voter1);
        const balanceVoter2 = await loyaltyPointsInstance.getPoints(voter2);
        const balanceVoter3 = await loyaltyPointsInstance.getPoints(voter3);

        assert.equal(balanceVoter1.toNumber(), 100, "voter1 should have 100 loyalty points");
        assert.equal(balanceVoter2.toNumber(), 150, "voter2 should have 150 loyalty points");
        assert.equal(balanceVoter3.toNumber(), 200, "voter3 should have 200 loyalty points");
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

    //Test that users can withdraw from their vote registration
    it("should allow users to withdraw from their vote registration", async () => {
        // Organizer creates a concert option
        const concertName = "Future Star Performance";
        const concertVenue = "Downtown Arena";
        let concertDate = (await time.latest()).add(time.duration.days(30)); // 30 days from now
        concertDate = concertDate.toNumber();

        // Add a concert option
        await futureConcertPollInstance.addConcertOption(concertName, concertVenue, concertDate, { from: organizer });

        // First concert option added has concertOptionId = 1
        const concertOptionId = 1;
        const votePoints = 50;

        await futureConcertPollInstance.registerToVote(concertOptionId, { from: voter1 });

        // Verify registration status before withdrawal
        let isRegisteredBefore = await futureConcertPollInstance.userVoteRegistration(voter1, concertOptionId);
        assert.equal(isRegisteredBefore, true, "Voter1 should be registered before withdrawal");

        await loyaltyPointsInstance.setFutureConcertPollAddress(futureConcertPollInstance.address, { from: organizer });

        // Voter1 withdraws their registration
        await futureConcertPollInstance.withdrawVoteRegistration(concertOptionId, votePoints, { from: voter1 });

        // Verify registration status after withdrawal
        let isRegisteredAfter = await futureConcertPollInstance.userVoteRegistration(voter1, concertOptionId);
        assert.equal(isRegisteredAfter, false, "Voter1 should not be registered after withdrawal");
    });

    //Test that users get back their loyalty points after withdrawing their vote 
    it("should allow users to get back their loyalty points after withdrawing their vote", async () => {
        // Organizer creates a concert option
        const concertName = "Future Star Performance";
        const concertVenue = "Downtown Arena";
        let concertDate = (await time.latest()).add(time.duration.days(30)); // 30 days from now
        concertDate = concertDate.toNumber();

        // Add a concert option
        await futureConcertPollInstance.addConcertOption(concertName, concertVenue, concertDate, { from: organizer });

        const concertOptionId = 2;
        const votePoints = 50;

        await futureConcertPollInstance.registerToVote(concertOptionId, { from: voter3 });
        await futureConcertPollInstance.castVote(concertOptionId, votePoints, { from: voter3 });

        let initialBalance = await loyaltyPointsInstance.getPoints(voter3);

        // Verify registration status before withdrawal
        let isRegisteredBefore = await futureConcertPollInstance.userVoteRegistration(voter3, concertOptionId);
        assert.equal(isRegisteredBefore, true, "Voter3 should be registered before withdrawal");

        await loyaltyPointsInstance.setFutureConcertPollAddress(futureConcertPollInstance.address, { from: organizer });

        // Voter3 withdraws their registration
        await futureConcertPollInstance.withdrawVoteRegistration(concertOptionId, votePoints, { from: voter3 });

        let finalBalance = await loyaltyPointsInstance.getPoints(voter3);

        // Verify registration status after withdrawal
        assert.equal(finalBalance.toNumber(), initialBalance.toNumber() + votePoints, "Loyalty points were not returned correctly after withdrawing vote registration.");
    });

    //Test Case: Vote points limit enforcement
    it("enforces vote points limits per user", async () => {
        // maxVotePointsPerUser is 100
        const maxVotePoints = 100;
        const concertOptionId = 1;

        // Register voter1 and attempt to cast votes exceeding the limit
        await futureConcertPollInstance.registerToVote(concertOptionId, { from: voter1 });
        await truffleAssert.reverts(
            futureConcertPollInstance.castVote(concertOptionId, maxVotePoints + 1, { from: voter1 }),
            "Vote points limit exceeded"
        );
    });

    // Test Case: Invalid Concert Option Voting
    it("reverts when voting for an invalid concert option", async () => {
        const invalidConcertOptionId = 999;
        await truffleAssert.reverts(
            futureConcertPollInstance.registerToVote(invalidConcertOptionId, { from: voter1 }),
            "Concert option does not exist."
        );
    });

    // Test Case: Multiple users voting on the same concert option
    it("correctly counts votes from multiple users for the same concert option", async () => {
        const concertOptionId = 1;
        const votesFromVoter1 = 10;
        const votesFromVoter2 = 20;

        // Register voters
        await futureConcertPollInstance.registerToVote(concertOptionId, { from: voter1 });
        await futureConcertPollInstance.registerToVote(concertOptionId, { from: voter2 });

        // Voters cast their votes
        await futureConcertPollInstance.castVote(concertOptionId, votesFromVoter1, { from: voter1 });
        await futureConcertPollInstance.castVote(concertOptionId, votesFromVoter2, { from: voter2 });

        // Verify total votes for concertOptionId
        const totalVotes = await futureConcertPollInstance.getTotalVotes(concertOptionId);
        //+50 because a voter voted 50points as well
        assert.equal(totalVotes.toNumber(), votesFromVoter1 + votesFromVoter2 + 50, "Incorrect total votes counted");
    });
    
});