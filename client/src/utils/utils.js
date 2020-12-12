const Web3 = require('web3');
const jwt_decode = require("jwt-decode");

let web3;

const getWeb3Instance = () => web3 ? web3 : new Web3(window.ethereum);

const decodeJwt = (token) => jwt_decode(token);

const Role = {
  Admin: 'admin',
  Bank: 'bank'
}

export { getWeb3Instance, decodeJwt, Role };