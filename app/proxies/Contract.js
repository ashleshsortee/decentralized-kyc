const Provider = require('./Provider');
const { contractAddress, abi } = require('../constant');

const provider = new Provider();

class Contract {
  constructor() {
    this.web3 = provider.web3;
  }
  // create contract instance
  initContract() {
    const instance = new this.web3.eth.Contract(abi, contractAddress);
    return instance;
  }
}

module.exports = Contract;