const Dao = artifacts.require("Dao");

module.exports = function(deployer) {
  deployer.deploy(Dao, 30);
};
