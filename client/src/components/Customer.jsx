import React, { Component } from 'react';
import Header from '../Header';
import axios from 'axios';
import renderNotification from '../utils/notification-handler';
import { getWeb3Instance } from '../utils/utils';

const web3 = getWeb3Instance();

class Customer extends Component {
  constructor() {
    super();
    this.state = {
      customerId: null,
      customerDataHash: null,
      bankRequests: [],
      allRequests: [],
      requestTable: [],
      verificationTable: [],
      verifiedTable: [],
    }
  }

  async componentDidMount() {
    await this.updateRequestRecords();
    await this.updateVerificationTable();
    await this.updateVerifiedCustomers();
  }

  async updateRequestRecords() {
    const { data: requests } = await axios.get('/bankRequests');
    this.setState({ bankRequests: requests });
    const records = this.state.bankRequests.map((customer) => {
      const { customerId, dataHash, bankName } = customer;
      return (
        <tr key={customerId}>
          <td>{customerId}</td>
          <td>{web3.utils.toAscii(bankName)}</td>
          <td>{dataHash}</td>
          <td><button type="submit" className="custom-btn login-btn" onClick={this.onVerifyClick.bind(this, customerId, dataHash)}>Verify</button></td>
        </tr>
      )
    });
    this.setState({ requestTable: records });
  }

  async onUpVoteClick(customerId) {
    try {
      const response = await axios.get(`/upVoteCustomer?customerId=${customerId}`);
      await this.updateVerificationTable();
      renderNotification('success', 'Success', response.data.message);
    } catch (err) {
      console.log('console err', err.response.data.message);
      renderNotification('danger', 'Error', err.response.data.message);
    }


  }

  async updateVerificationTable() {
    const { data } = await axios.get('/verificationRequests');
    const renderData = data.map(customer => {
      const { customerId, rating, upVotes, bankName } = customer;
      return (<tr key={customerId}>
        <td>{customerId}</td>
        <td>{web3.utils.toAscii(bankName)}</td>
        <td>{rating}</td>
        <td>{upVotes}</td>
        <td><button type="submit" className="custom-btn login-btn" onClick={this.onUpVoteClick.bind(this, customerId)}>Upvote</button></td>
      </tr>)
    });
    this.setState({ verificationTable: renderData });
    await this.updateVerifiedCustomers();
  }

  async updateVerifiedCustomers() {
    const { data } = await axios.get('/verifiedCustomers');
    const renderData = data.map(customer => {
      const { customerId, rating, upVotes } = customer;
      return (<tr key={customerId}>
        <td>{customerId}</td>
        <td>{rating}</td>
        <td>{upVotes}</td>
      </tr>)
    });
    this.setState({ verifiedTable: renderData });
  }

  onKycRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/addKycRequest', {
        customerId: this.state.customerId,
        customerDataHash: this.state.customerDataHash,
      });

      renderNotification('success', 'Success', response.data.message);
      await this.updateRequestRecords();
    } catch (err) {
      console.log('console err', err);
      renderNotification('danger', 'Error', err.response.data.message);
    }
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onVerifyClick = async (customerId, dataHash) => {
    try {
      const response = await axios.get(`/verifyCustomer?customerId=${customerId}&dataHash=${dataHash}`);
      renderNotification('success', 'Success', response.data.message);
      const state = this.state;
      state.bankRequests.filter(customerData => customerData.customerId !== customerId);
      this.setState(state);

      await this.updateRequestRecords();
      await this.updateVerificationTable();
    } catch (err) {
      renderNotification('danger', 'Error', err.response.data.message);
    }
  }

  renderBankRequests = () => {
    try {
      const records = this.state.bankRequests.map((customer) => {
        const { customerId, dataHash } = customer;
        return (
          <tr key={customerId}>
            <td>{customerId}</td>
            <td>{dataHash}</td>
            <td><button type="submit" className="custom-btn login-btn" onClick={this.onVerifyClick.bind(this, customerId, dataHash)}>Verify</button></td>
          </tr>
        )
      });
      this.setState({ requestTable: records });
    } catch (err) {
      console.log('Error while fetching bank`s requests', err);
      return [<tr></tr>]
    }
  }

  verificationTable = () => {
    try {
      const records = this.state.bankRequests.map((customer) => {
        const { customerId, dataHash } = customer;
        return (
          <tr key={customerId}>
            <td>{customerId}</td>
            <td>{dataHash}</td>
            <td><button type="submit" className="custom-btn login-btn" onClick={this.onVerifyClick.bind(this, customerId, dataHash)}>Verify</button></td>
          </tr>
        )
      });
      this.setState({ requestTable: records });
    } catch (err) {
      console.log('Error while fetching bank`s requests', err);
      return [<tr></tr>]
    }
  }


  render() {
    return (
      <div>
        <Header heading="Customer" />
        <div className="component-body-container">
          <h2>Add Customer KYC Request</h2>
          <div className="component-sub-cointainer">
            <form className="function-form" onSubmit={this.onKycRequestSubmit}>
              <label htmlFor="pvtKey" className="label-control">Customer Id: </label><br />
              <input id="customerId" type="text" className="input-control" name="customerId" onChange={this.inputChangedHandler} /><br /><br />
              <label htmlFor="pvtKey" className="label-control">Data Hash: </label><br />
              <input id="customerDataHash" type="text" className="input-control" name="customerDataHash" onChange={this.inputChangedHandler} /><br /><br />

              <button type="submit" className="custom-btn login-btn">Add Customer</button>
              {/* <pre>{this.state.addBankReceipt}</pre> */}
            </form>
          </div>
        </div>

        {/* Requests table */}
        <div className="table">
          <h2>My Requests</h2>
          {/* {this.renderBankRequests()} */}
          <table id='requests'>
            <tbody>
              <tr>
                <th key='customerId'>CustomerId</th>
                <th key='bank'>Requested Bank</th>
                <th key='dataHash'>dataHash</th>
                <th key='addCustomer'>addCustomer</th>
              </tr>
              {this.state.requestTable}
            </tbody>
          </table>
        </div>

        {/* Pending Verification table */}
        <div className="table">
          <h2>Pending Verification</h2>
          {/* {this.renderBankRequests()} */}
          <table id='requests'>
            <tbody>
              <tr>
                <th key='CustomerId'>CustomerId</th>
                <th key='bank'>Bank</th>
                <th key='rating'>Rating</th>
                <th key='upVotes'>UpVotes</th>
                <th key='Vote'>Approve</th>
              </tr>
              {this.state.verificationTable}
            </tbody>
          </table>
        </div>

        {/* Accepted Customers table */}
        <div className="table">
          <h2>Verified Customers</h2>
          {/* {this.renderBankRequests()} */}
          <table id='requests'>
            <tbody>
              <tr>
                <th key='CustomerId'>CustomerId</th>
                <th key='rating'>Rating</th>
                <th key='upVotes'>UpVotes</th>
              </tr>
              {this.state.verifiedTable}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Customer;