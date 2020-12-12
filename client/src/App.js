import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'
import Login from './components/Login';
import Admin from './components/Admin';
import Customer from './components/Customer';
import Bank from './components/Bank';
import PrivateRoute, { logOut } from './components/private-route';

class KYC extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  handleLogout = () => {
    logOut();
    window.location.reload();
  }

  render() {
    return (
      <Router>
        <div>
          <ReactNotification />
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/bank">Bank</Link>
              </li>
              <li>
                <Link to="/customer">Customer</Link>
              </li>
              <li>
                <div>
                  <input type="button" value='Logout' onClick={this.handleLogout} /><br />
                </div>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/admin" component={Admin} />
            <PrivateRoute path="/bank" component={Bank} />
            <PrivateRoute path="/customer" component={Customer} />
          </Switch>
        </div>
      </Router >
    )
  }
}

export default KYC;