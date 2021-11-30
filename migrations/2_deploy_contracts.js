var PauToken = artifacts.require("PauToken")

module.exports = function(deployer) {
    deployer.deploy(PauToken, 1000000)
}
