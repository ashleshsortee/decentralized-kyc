const contractAddress = '0xD14236cCB2C9F5e159d981Aa360af55d219bEA7e';
// Move it to environment variables or maintain a seperate DB for user and it's role
const adminAddress = "0x3e83a215973CfA9C248e420fA155829db7548Ee5";
const jwtSecret = 'sssshhhh';

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "bankAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "alreadyVoted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "bankList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "banks",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "name",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "bank",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "rating",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "kycCount",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "regNumber",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "customers",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "userName",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "rating",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "upVotes",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "bank",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "finalCustomers",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "kycRequests",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "userName",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "bank",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      },
      {
        "internalType": "bool",
        "name": "isAllowed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "customerDataHash",
        "type": "bytes32"
      }
    ],
    "name": "addKycRequest",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "customerDataHash",
        "type": "bytes32"
      }
    ],
    "name": "addCustomer",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "customerDataHash",
        "type": "bytes32"
      }
    ],
    "name": "removeKycRequest",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      }
    ],
    "name": "removeCustomer",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "password",
        "type": "bytes32"
      }
    ],
    "name": "viewCustomer",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      }
    ],
    "name": "upVoteCustomer",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "password",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "modifyCustomerData",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bankAddress",
        "type": "address"
      }
    ],
    "name": "getBankRequests",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bankAddress",
        "type": "address"
      }
    ],
    "name": "upVoteBank",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      }
    ],
    "name": "getCustomerRating",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bankAddress",
        "type": "address"
      }
    ],
    "name": "getBankRating",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      }
    ],
    "name": "lastUpdatedBy",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "customerName",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "password",
        "type": "bytes32"
      }
    ],
    "name": "setPassword",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bankAddress",
        "type": "address"
      }
    ],
    "name": "getBankDetails",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "bankName",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "bankAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "regNumber",
        "type": "bytes32"
      }
    ],
    "name": "addBank",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bankAddress",
        "type": "address"
      }
    ],
    "name": "removeBank",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

module.exports = { contractAddress, abi, adminAddress, jwtSecret };