import React, { Component } from 'react';
import Header from '../Header';
import axios from 'axios';
import { getWeb3Instance } from '../utils/utils';
import renderNotification from '../utils/notification-handler';

const web3 = getWeb3Instance();

class Customer extends Component {
  constructor() {
    super();
    this.state = {
      bankTable: [],
    }
  }

  async componentDidMount() {
    this.renderBank();
  }

  onVerifyClick = async (address) => {
    try {
      const response = await axios.get(`/upVoteBank?address=${address}`);
      renderNotification('success', 'Success', response.data.message);
      await this.renderBank();
    } catch (err) {
      console.log('console err', err);
      renderNotification('danger', 'Error', err.response.data.message);
    }
  }

  async renderBank() {
    const { data } = await axios.get('/bank');
    const renderData = data.map(bank => {
      const { name, address, rating, kycCount, regNumber } = bank;
      return (<tr key={address}>
        <td>{web3.utils.toAscii(name)}</td>
        <td>{address}</td>
        <td>{rating}</td>
        <td>{kycCount}</td>
        <td>{regNumber}</td>
        <td><button type="submit" className="custom-btn login-btn" onClick={this.onVerifyClick.bind(this, address)}>Verify</button></td>
      </tr>)
    });

    this.setState({ bankTable: renderData });
  }


  render() {
    return (
      <div>
        <Header heading="Bank" />
        {/* Bank table */}
        <div className="table">
          <h2>All Banks</h2>
          <table id='requests'>
            <tbody>
              <tr>
                <th key='name'>Name</th>
                <th key='address'>Address</th>
                <th key='rating'>Rating</th>
                <th key='kycCount'>KycCount</th>
                <th key='regNumber'>Registration Number</th>
                <th key='upVote'>Upvote Bank</th>
              </tr>
              {this.state.bankTable}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Customer;