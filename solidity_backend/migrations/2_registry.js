/* global artifacts */

const Registry = artifacts.require('./Registry.sol');
const EIP20 = artifacts.require('./EIP20.sol');

module.exports = deployer => deployer.deploy(EIP20, 1000000, "PiedPiperCoin", 18, "PPI").then(function(){
    return deployer.deploy(Registry, EIP20.address);
});

