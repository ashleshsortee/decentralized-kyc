const express = require('express');
var LRU = require("lru-cache");
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const { jwtSecret } = require('./constant');
const { generateNonce, authenticateUser } = require('./controller/Login');

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
  }).unless({ path: ['/', '/auth', '/generate-nonce'] })
);

app.get('/', (req, res) => res.send('Healthy!'));
app.get('/generate-nonce', generateNonce);
app.post('/auth', authenticateUser);

// TODO
// app.post('/addBank', addBank);
// app.post('/removeBank', removeBank);

app.listen(port, () => console.log(`KYC DAPP listening on port ${port}!`));
