const ERC20 = artifacts.require("ERC20");
const TicketToken = artifacts.require("TicketToken");
const TicketMarket = artifacts.require("TicketMarket");

module.exports = (deployer, network, accounts) => {
  deployer
    .deploy(TicketToken)
    .then(function () {
      return deployer.deploy(TicketMarket, TicketToken.address, 0);
    });
};
