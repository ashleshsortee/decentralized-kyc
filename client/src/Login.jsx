import React, { Component } from 'react';

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
          if (err) return reject(err);
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
      window.alert('Please install MetaMask first.');
      return;
    }

    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable();
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert('You need to allow MetaMask.');
        return;
      }
    }

    const publicAddress = await web3.eth.getCoinbase();
    if (!publicAddress) {
      window.alert('Please activate MetaMask first.');
      return;
    }
    console.log('console public address', publicAddress);

    try {
      const response = await fetch(`/generate-nonce?publicAddress=${publicAddress}`);
      const { nonce } = await response.json();
      console.log('nonce', nonce);
      const { signature } = await this.handleSignMessage(publicAddress, nonce);
      console.log('console handle signature', signature);

      const result = await this.handleAuthenticate(publicAddress, signature);
      console.log('console result', result);
      const { status, role } = result;
      const userToken = await result.json();

      console.log('console auth', userToken, status);

      if (status !== 200) {
        throw Error('MetaMask login failed');
      } else {
        this.setState({ loading: true });
      }
    } catch (err) {
      console.log('console err', err);

    }

    if (this.state.loading) {
      this.props.history.push('/bank');
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        Login<br /><br />
        <input type="button" value={loading ? 'Loading...' : 'MetaMask Login'} onClick={this.handleLogin} disabled={loading} /><br />
      </div>
    );
  }

}

export default Login;