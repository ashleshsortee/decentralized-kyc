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

      <div class="container left">

        <div class="row">
          <div class="container left">
            <h5 style={{ padding: "30px 0px 0px 10px" }}>Add Bank</h5>
            <form class="col s5" onSubmit={this.onAddBankSumbitted}>
              <input id="bankName" placeholder="Bank Name" type="text" class="validate" name="bankName" onChange={this.inputChangedHandler} /><br /><br />
              <input id="bankAddress" placeholder="Bank Address" type="text" className="input-control" name="bankAddress" onChange={this.inputChangedHandler} /><br /><br />
              <input id="regNumber" placeholder="Registration Number" type="text" className="input-control" name="regNumber" onChange={this.inputChangedHandler} /><br /><br />

              <button type="submit" className="custom-btn login-btn">Add Bank</button>
            </form>
          </div>
        </div>

        <div class="row">
          <div class="container left">
            <h5 style={{ padding: "30px 0px 0px 10px" }}>Remove Bank</h5>
            <form class="col s5" onSubmit={this.onRemoveBankSumbitted}>
              <input id="bankName" placeholder="Bank Address" type="text" className="input-control" name="bankAddress" onChange={this.inputChangedHandler} /><br /><br />

              <button type="submit" className="custom-btn login-btn">Remove Bank</button>
            </form>
          </div>
        </div >
      </div >

    )
  }
}

export default Admin;