import React, { Component } from 'react';
import renderNotification from '../utils/notification-handler';

const Web3 = require('web3');
let web3;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      login: false,
    };
  }

  handleSignMessage = (publicAddress, nonce) => {
    return new Promise((resolve, reject) =>
      window.web3.personal.sign(
        window.web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) {
            renderNotification('danger', 'Error', 'Failed to sign one-time nonce');
            return reject(err);
          }
          return resolve({ publicAddress, signature });
        }
      )
    );
  };

  handleAuthenticate = (publicAddress, signature) =>
    fetch(`/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });


  handleLogin = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      renderNotification('warning', 'Alert', 'Please install MetaMask first.');
      return;
    }

    if (!web3) {
      try {
        // Request account access if required
        await window.ethereum.enable();
        web3 = new Web3(window.ethereum);
      } catch (error) {
        renderNotification('warning', 'Alert', 'You need to allow MetaMask.');
        return;
      }
    }

    const publicAddress = await web3.eth.getCoinbase();
    if (!publicAddress) {
      renderNotification('warning', 'Alert', 'Please activate MetaMask first.');
      return;
    }

    try {
      const response = await fetch(`/generate-nonce?publicAddress=${publicAddress}`);

      if (response.status !== 200) {
        const { message } = await response.json();
        renderNotification('danger', 'Login Failed', message);
        throw Error(message);
      }

      const { nonce } = await response.json();
      const { signature } = await this.handleSignMessage(publicAddress, nonce);
      const result = await this.handleAuthenticate(publicAddress, signature);
      const { status, role } = result;

      if (status !== 200) {
        renderNotification('danger', 'Login Failed', 'MetaMask login failed.');
        throw Error({ message: 'MetaMask login failed' });
      } else {
        renderNotification('success', 'Login Successful', 'MetaMask login successful');
        this.props.history.push('/bank');
        this.setState({ loading: true });
        window.location.reload();
      }
    } catch (err) {
      console.log('console err',);
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div class="container center">
        <div class="row">
          <div class="container left"></div>
          <h4 style={{ padding: "100px 0px 50px 0px" }}>Login Using Metamask</h4>
          <input class="test" type="button" value={loading ? 'Loading...' : 'MetaMask Login'} onClick={this.handleLogin} disabled={loading} />
        </div>
      </div>
    );
  }

}

export default Login;