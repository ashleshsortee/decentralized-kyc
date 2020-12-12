import React, { Component } from 'react';
import Header from '../Header';
import axios from 'axios';
import renderNotification from '../utils/notification-handler';

class Admin extends Component {

  constructor() {
    super();
    this.state = {
      bankName: null,
      bankAddress: null,
      regNumber: null,
      addBankReceipt: null,
      removeBankReceipt: null,
    }
  }

  onAddBankSumbitted = async (e) => {
    // Add Bank
    e.preventDefault();
    try {
      const response = await axios.post('/addBank', {
        bankName: this.state.bankName,
        bankAddress: this.state.bankAddress,
        regNumber: this.state.regNumber
      });

      renderNotification('success', 'Success', response.data.message);
    } catch (err) {
      console.log('console err', err);
      renderNotification('danger', 'Error', err.response.data.message);
    }
  }

  onRemoveBankSumbitted = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/removeBank', {
        bankAddress: this.state.bankAddress,
      });
      renderNotification('success', 'Success', response.data.message);
    } catch (err) {
      renderNotification('danger', 'Error', err.response.data.message);
    }
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div>
        <Header heading="BANK" />
        <div className="component-body-container">
          <h2>Add Bank</h2>
          <div className="component-sub-cointainer">
            <form className="function-form" onSubmit={this.onAddBankSumbitted}>
              <label htmlFor="pvtKey" className="label-control">Bank Name: </label><br />
              <input id="bankName" type="text" className="input-control" name="bankName" onChange={this.inputChangedHandler} /><br /><br />
              <label htmlFor="pvtKey" className="label-control">Bank Address: </label><br />
              <input id="bankAddress" type="text" className="input-control" name="bankAddress" onChange={this.inputChangedHandler} /><br /><br />
              <label htmlFor="pvtKey" className="label-control">Registration Number: </label><br />
              <input id="regNumber" type="text" className="input-control" name="regNumber" onChange={this.inputChangedHandler} /><br /><br />


              <button type="submit" className="custom-btn login-btn">Add Bank</button>
            </form>
          </div>

          <div className="component-sub-cointainer">
            <h2>Remove Bank</h2>
            <form className="function-form" onSubmit={this.onRemoveBankSumbitted}>
              <label htmlFor="pvtKey" className="label-control">Bank Address: </label><br />
              <input id="bankName" type="text" className="input-control" name="bankAddress" onChange={this.inputChangedHandler} /><br /><br />

              <button type="submit" className="custom-btn login-btn">Remove Bank</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Admin;