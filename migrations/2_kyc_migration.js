var KycContract = artifacts.require("Kyc");

module.exports = function (deployer) {
    deployer.deploy(KycContract);
};