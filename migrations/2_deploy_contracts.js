// This one tell truffle how to move contract on blockchain
// The order for the file is important: 1, 2 for order of contract on truffle
const MyGameToken = artifacts.require("MyGameToken");

module.exports = function(deployer) {
  // Code goes here...
  deployer.deploy(MyGameToken);
};