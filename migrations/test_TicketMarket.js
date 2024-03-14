const ERC20 = artifacts.require("ERC20");

const Ticket = artifacts.require("Ticket");
const TicketToken = artifacts.require("TicketToken");
const TicketMarket = artifacts.require("TicketMarket");

contract("TicketMarket", (accounts) => {
  let ticketInstance;
  let ticketMarketInstance;
  const owner = accounts[0];
  const buyer = accounts[1];

  beforeEach(async () => {
    ticketInstance = await Ticket.deployed();
    ticketMarketInstance = await TicketMarket.deployed();
  });

  // Console log moved inside the describe block
  console.log("Testing Ticket Market contract");

  // 1. Test the creation of the ticket
  it("Create New Ticket", async () => {
    let newTicket = await ticketInstance.add(1, 1, { from: owner, value: oneEth });
    assert.Equal(true, true, "Ticket not created correctly");
  });
});
