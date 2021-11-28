var TokenGeneration = artifacts.require("TokenGeneration")
var TokenSale = artifacts.require("TokenSale")

module.exports = function(deployer) {
    // deployer.deploy(TokenGeneration)
    deployer.deploy(TokenSale, 1000000, 10, 1000000)
}
