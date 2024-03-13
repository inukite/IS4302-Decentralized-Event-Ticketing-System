const ERC20 = artifacts.require("ERC20");
const ConcertTicketToken = artifacts.require("ConcertTicketToken");
const TicketMarketPlace = artifacts.require("TicketMarketPlace");


module.exports = (deployer, network, accounts) => {
  deployer
    .deploy(ConcertTicketToken)
    .then(function () {
      return deployer.deploy(TicketMarketPlace, ConcertTicketToken.address);
    });
};
