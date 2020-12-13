import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Login from './components/Login';
import Admin from './components/Admin';
import Customer from './components/Customer';
import Bank from './components/Bank';
import PrivateRoute, { logOut, getSession } from './components/private-route';
import { Role } from './utils/utils';

class KYC extends Component {

  constructor() {
    super();
    this.state = {
      currentUser: null,
      isAdmin: false
    };
  }

  componentDidMount() {
    const currentUserSession = getSession();
    if (currentUserSession) {
      const { payload: { publicAddress, role: currentUserRole } } = currentUserSession;

      this.setState({
        currentUser: publicAddress,
        isAdmin: currentUserRole === 'admin'
      });
    }
  }
  handleLogout = () => {
    logOut();
    window.location.reload();
  }

  render() {
    return (
      <Router>

        <div >

          <ReactNotification />
          <nav style={{ padding: '0px 30px 0px 30px' }}>
            <div class="nav-wrapper" >
              <a href="#" class="brand-logo left">KYC DAPP</a>
              <ul class="right hide-on-med-and-down 10" >
                {
                  !this.state.currentUser &&
                  <li><Link to="/login">Login</Link></li>
                }
                {this.state.currentUser &&
                  <div>
                    {
                      this.state.isAdmin &&
                      <li> <Link to="/admin">Admin</Link> </li>
                    }
                    <li> <Link to="/bank">Bank</Link></li>
                    <li><Link to="/customer">Customer</Link></li>
                    <li >
                      <div >
                        <input class="test" type="button" value='Logout' onClick={this.handleLogout} /><br />
                      </div>
                    </li>
                  </div>
                }
              </ul>
            </div>
          </nav>

          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
            <PrivateRoute path="/bank" component={Bank} />
            <PrivateRoute path="/customer" component={Customer} />
          </Switch>
        </div>
      </Router >
    )
  }
}

export default KYC;