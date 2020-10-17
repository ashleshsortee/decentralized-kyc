import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Login from './Login';
import Bank from './Bank';

class KYC extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/Admin">Admin</Link>
              </li>
              <li>
                <Link to="/Bank">Bank</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/bank">
              <Bank />
            </Route>
          </Switch>
        </div>
      </Router >
    )
  }
}

export default KYC;