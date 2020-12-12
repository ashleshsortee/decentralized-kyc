'use strict';

var LRU = require("lru-cache");
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const jsonwebtoken = require('jsonwebtoken');
const Provider = require('../proxies/Provider');
const { adminAddress, jwtSecret, userList } = require('../constant');

const provider = new Provider();
const web3 = provider.web3;

const cache = new LRU({
  max: 500,
  length: function (n, key) { return n.length },
  maxAge: 1000 * 60 * 60 * 10000,
});

class Login {
  static generateNonce = async (req, res) => {
    try {
      const { publicAddress } = req.query;
      const accounts = await web3.eth.getAccounts();

      if (!accounts.includes(web3.utils.toChecksumAddress(publicAddress))) {
        return res.status(401).send({ message: 'Account not registered' });
      }

      // Generate nonce
      // Store the publicKey --> nonce pair in LRU cache
      // Send back the nonce to sign the transaction
      const nonce = Math.floor(Math.random() * 1000000);
      cache.set(publicAddress, nonce);

      return res.status(200).send({ nonce });
    } catch (err) {
      return res.status(401).send({ message: 'Failed to generate nonce' });
    }
  }

  static authenticateUser = async (req, res) => {
    try {
      const { publicAddress, signature } = req.body;
      const nonce = cache.get(publicAddress);
      const msg = `I am signing my one-time nonce: ${nonce}`;
      const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
      const address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
      });

      if (address.toLowerCase() !== publicAddress.toLowerCase() && !userList.includes(publicAddress)) {
        res.status(401).send({ error: 'Signature verification failed' });
        return null;
      }

      // Update the nonce
      const newNonce = Math.floor(Math.random() * 1000000);
      cache.set(publicAddress, newNonce);

      // Generate the userToken
      const userToken = await jsonwebtoken.sign({
        payload: {
          publicAddress,
          role: publicAddress === adminAddress.toLowerCase() ? 'admin' : 'bank'
        },
      }, jwtSecret, {});

      res.cookie('userToken', userToken, { maxAge: 36000000 }); // 10 hrs

      return res.status(200).json({ userToken });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

module.exports = Login;