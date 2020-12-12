const Web3 = require('web3');

let web3;

const getWeb3Instance = () => web3 ? web3 : new Web3(window.ethereum);

export { getWeb3Instance };