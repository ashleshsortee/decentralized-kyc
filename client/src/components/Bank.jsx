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
        <td><button type="submit" className="custom-btn login-btn" onClick={this.onVerifyClick.bind(this, address)}>Upvote</button></td>
      </tr>)
    });

    this.setState({ bankTable: renderData });
  }


  render() {
    return (
      <div class="container center">
        <div class="row">
          <div class="container left">
            <h4 style={{ padding: "30px 0px 50px 300px" }}>Bank Details</h4>
            <table id='requests' class="bordered highlight centered" >
              <thead>
                <tr>
                  <th key='name'>Name</th>
                  <th key='address'>Address</th>
                  <th key='rating'>Rating</th>
                  <th key='kycCount'>KycCount</th>
                  <th key='regNumber'>Registration Number</th>
                  <th key='upVote'>Upvote</th>
                </tr>
              </thead>
              <tbody class="striped">
                {this.state.bankTable}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Customer;