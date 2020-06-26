# decentralized-kyc

## Note 

```
bytes32 are used instead of string. Reasons for that are operations with bytes32 are less expensive than string data type and web3.js has utility function to convert string to bytes32 from the front-end side incurring no gas cost.
```

## Pre-requesite

1. Truffle should be installed.
2. For gui experience Ganache needs to be installed.

## Deploy Smart Contract on Private Ethereum Blockchain Network 

1. Create private chain data using the genesis.json file
    > geth --datadir ./datadir init ./genesis.json
2. Create the blockchain netwrok with the following command which will also get you to the network console
    > geth --datadir ./datadir --networkid 2020 --rpc --rpcport 8545 --allow-insecure-unlock console 2>> Eth.log
3. Add the 3 bank accounts and 1 customer account and 1 admin account.
    > personal.newAccount('<password> ')
4. Unlock admin account to deploy smart contract
    > personal.unlockAccount('<Account address>', '<password>', 0)
5. Start mining process
    >  miner.start()
6. Open new window in terminal and cd into same folder.
7. Compile the kyc and migration smart contract present in the folder via truffle
    > truffle compile
8. Migrate smart contract to the network
    > truffle migrate 
9. In the same folder of truffle, run the truffle console
    > truffle console
10. Create the instance of kyc smart contract
    > let kyc = await Kyc.deployed()
11. Voila!! Now all the functions for the Kyc smart contract can be accessible.

## Following is the main flow to test out smart contract in Remix or over the private Ethereum network

1. Deploy smart contract with Admin’s address.
2. With Admin’s address add 3 banks (BankA, BankB, BankC) 
    > addBank(bytes32 bankName, address bankAddress, bytes32 regNumber)
3. BankA add CustomerA’s KYC request 
    > addKycRequest(bytes32 customerName, bytes32 customerDataHash)
4. BankB upVotes BankA
    a)upVoteBank(address bankAddress)
5. BankC upVotes BankA
    > upVoteBank(address bankAddress)
6. Now rating of BankA will be >50%. Now bank and all of its KYC requests are eligible to add customers.
7. BankA adds customerA to the customer list.
    > addCustomer(bytes32 customerName, bytes32 customerDataHash)
8. View customerA with password as “0” (convert to bytes32)
    > viewCustomer(bytes32 customerName, bytes32 password)
9. BankA adds password to customerA
    > setPassword (bytes32 customerName, bytes32 password)
10. View CustomerA with the password set in previous step
    > viewCustomer(bytes32 customerName, bytes32 password)
11. BankB upVotes CustomerA. As, BankA have validated and added CustomerA’ request, BankA’s vote has already been counted.
    > upVoteCustomer(bytes32 customerName)   
12. Now the rating of CustomerA will be >50%
13. Click on finalCustomer button to validate whether CustomerA has been added to finalCustomer list.
14. This was the main flow. Similarly all the other requests can be validated as per the usage.