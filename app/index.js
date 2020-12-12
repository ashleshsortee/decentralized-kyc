const express = require('express');
var LRU = require("lru-cache");
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const { jwtSecret } = require('./constant');
const { generateNonce, authenticateUser } = require('./controller/Login');
const { addBank, removeBank } = require('./controller/Admin');
const { addKycRequest, getBankRequests, verifyCustomer, getVerificationRequests, getVerifiedCustomers, upVoteCustomer, getBanks, upVoteBank } = require('./controller/Bank');

const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'KYC App');
app.use(cookieParser());
app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.userToken,
    algorithms: ['HS256'],
  }).unless({ path: ['/', '/auth', '/generate-nonce', ''] })
);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message });
    console.log(err);
    return;
  }
  next();
});

app.get('/', (req, res) => res.send('Healthy!'));
app.get('/generate-nonce', generateNonce);
app.post('/auth', authenticateUser);

app.post('/addBank', addBank);
app.post('/removeBank', removeBank);
app.get('/bank', getBanks);

app.post('/addKycRequest', addKycRequest);

app.get('/bankRequests', getBankRequests);
app.get('/verifyCustomer', verifyCustomer);
app.get('/verificationRequests', getVerificationRequests);
app.get('/verifiedCustomers', getVerifiedCustomers);
app.get('/upVoteCustomer', upVoteCustomer);
app.get('/upVoteBank', upVoteBank);

app.listen(port, () => console.log(`KYC DAPP listening on port ${port}!`));
