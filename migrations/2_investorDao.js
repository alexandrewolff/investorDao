const InvestorDao = artifacts.require("InvestorDao");

module.exports = function(deployer) {
  deployer.deploy(InvestorDao, 30, 20);
};
