const PriorityQueue = artifacts.require("PriorityQueue");
const LoyaltyPoints = artifacts.require("LoyaltyPoints");

contract("PriorityQueue", (accounts) => {
  let priorityQueue;
  let loyaltyPoints;

  before(async () => {
    loyaltyPoints = await LoyaltyPoints.new();
    priorityQueue = await PriorityQueue.new(loyaltyPoints.address);
  });

  it("should correctly enqueue and update the size of the queue", async () => {
    await loyaltyPoints.setPoints(accounts[1], 100); // Setting loyalty points
    await priorityQueue.enqueue(accounts[1]);

    const size = await priorityQueue.size();
    assert.equal(size.toNumber(), 1, "The size of the queue should be 1 after enqueueing one element.");
  });

  it("should dequeue the highest priority element", async () => {
    await loyaltyPoints.setPoints(accounts[2], 200); // Setting loyalty points
    await priorityQueue.enqueue(accounts[2]); // Size of the queue becomes 2 now afer enqueing another account

    const txResult = await priorityQueue.popHighestPriorityBuyer();
    //Should dequeue accounts[2] because it has higher loyalty points
    const highestPriorityAddressEvent = txResult.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    assert.equal(highestPriorityAddressEvent, accounts[2], "Dequeued address should be the one with the highest priority.");

    const newSize = await priorityQueue.size();
    assert.equal(newSize.toNumber(), 1, "The size of the queue should decrease after dequeueing.");
  });

  it("should return correct boolean for isInQueue", async () => {
    // Setup
    await priorityQueue.enqueue(accounts[1]);
    // Test isInQueue
    const isInQueueResult = await priorityQueue.isInQueue(accounts[1]);
    assert.isTrue(isInQueueResult, "The address should be in the queue.");

    const isNotInQueueResult = await priorityQueue.isInQueue(accounts[3]);
    assert.isFalse(isNotInQueueResult, "The address should not be in the queue.");
  });

  it("should correctly update priorities and maintain queue order", async () => {
    // Set initial points and enqueue several addresses
    await loyaltyPoints.setPoints(accounts[4], 250);
    await priorityQueue.enqueue(accounts[4]);
    await loyaltyPoints.setPoints(accounts[5], 300);
    await priorityQueue.enqueue(accounts[5]);
    await loyaltyPoints.setPoints(accounts[6], 275);
    await priorityQueue.enqueue(accounts[6]);

    // Increase loyalty points for accounts[4], making it the highest priority
    await loyaltyPoints.setPoints(accounts[4], 350);
    await priorityQueue.updatePriority(accounts[4]);

    // Dequeue all elements to check order
    const firstDequeued = await priorityQueue.dequeue();
    const firstDequeuedAddressEvent = firstDequeued.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    assert.equal(firstDequeuedAddressEvent, accounts[4], "accounts[4] should have the highest priority and be dequeued first.");

    const secondDequeued = await priorityQueue.dequeue();
    const secondDequeuedAddressEvent = secondDequeued.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    assert(secondDequeuedAddressEvent === accounts[5] || secondDequeuedAddressEvent === accounts[6], "accounts[5] or accounts[6] should be dequeued second based on updated priorities.");

    const thirdDequeued = await priorityQueue.dequeue();
    const thirdDequeuedAddressEvent = thirdDequeued.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    assert(thirdDequeuedAddressEvent === accounts[5] || thirdDequeuedAddressEvent === accounts[6], "accounts[5] or accounts[6] should be dequeued last based on updated priorities.");
  });

  // Test for multiple priority 
  it("should maintain correct order after multiple priority updates", async () => {
    // Enqueue multiple addresses
    await loyaltyPoints.setPoints(accounts[7], 500); // Account 7 has 500 loyalty points initially
    await priorityQueue.enqueue(accounts[7]);
    await loyaltyPoints.setPoints(accounts[7], 2500); // Account 8 has 2500 loyalty points initially
    await priorityQueue.enqueue(accounts[8]);
    await loyaltyPoints.setPoints(accounts[9], 3500); // Account 9 has 3500 loyalty points initially
    await priorityQueue.enqueue(accounts[9]);

    // Set initial loyalty points
    await loyaltyPoints.setPoints(accounts[7], 5000);
    await loyaltyPoints.setPoints(accounts[8], 2500);
    await loyaltyPoints.setPoints(accounts[9], 1500);

    // Update priorities in a way that inverts the initial order
    await priorityQueue.updatePriority(accounts[7]); // Points updated to higher than others
    await priorityQueue.updatePriority(accounts[8]);
    await priorityQueue.updatePriority(accounts[9]); // Points lowered 

    // Dequeue all to check order
    const highest = await priorityQueue.popHighestPriorityBuyer();
    const highestAddressEvent = highest.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    const middle = await priorityQueue.popHighestPriorityBuyer();
    const middleAddressEvent = middle.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    const lowest = await priorityQueue.popHighestPriorityBuyer();
    const lowAddressEvent = lowest.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;

    assert.equal(highestAddressEvent, accounts[7], "accounts[7] should be dequeued first after priority increase.");
    assert.equal(middleAddressEvent, accounts[8], "accounts[8] should be dequeued second.");
    assert.equal(lowAddressEvent, accounts[9], "accounts[9] should be dequeued last after priority decrease.");
  });

  // Test for Queue Stability with Equal Priorities
  it("should maintain insertion order for elements with equal priorities", async () => {
    // Assuming all addresses are set to the same loyalty points
    const commonPoints = 6000;
    await loyaltyPoints.setPoints(accounts[1], commonPoints);
    await priorityQueue.enqueue(accounts[2]);
    await loyaltyPoints.setPoints(accounts[3], commonPoints);
    await priorityQueue.enqueue(accounts[1]);
    await loyaltyPoints.setPoints(accounts[2], commonPoints);
    await priorityQueue.enqueue(accounts[3]);

    const firstOut = await priorityQueue.popHighestPriorityBuyer();
    firstOutAddressEvent = firstOut.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    const secondOut = await priorityQueue.popHighestPriorityBuyer();
    secondOutAddressEvent = secondOut.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;
    const thirdOut = await priorityQueue.popHighestPriorityBuyer();
    thirdOutAddressEvent = thirdOut.logs.find(log => log.event === "ElementDequeued").args.dequeuedAddress;

    assert.equal(firstOutAddressEvent, accounts[1], "accounts[1] should be dequeued first (insertion order).");
    assert.equal(secondOutAddressEvent, accounts[2], "accounts[2] should be dequeued second (insertion order).");
    assert.equal(thirdOutAddressEvent, accounts[3], "accounts[3] should be dequeued last (insertion order).");
  });

  // Additional tests to be implemented for other functionalities 

});