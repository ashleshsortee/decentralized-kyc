import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import renderNotification from '../utils/notification-handler';

const getSession = () => {
  const jwt = Cookies.get('userToken')
  let session;
  try {
    if (jwt) {
      const base64Url = jwt.split('.')[1]
      const base64 = base64Url.replace('-', '+').replace('_', '/')
      session = JSON.parse(window.atob(base64));
    }
  } catch (error) {
    console.log('Error while fetching session details', error);
  }

  return session
}

export const logOut = () => {
  Cookies.remove('userToken');
  renderNotification('default', 'Info', 'Logged out!');
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {

      return getSession() ? (
        <Component {...props} />
      ) : (
          <Redirect
            to="/login"
          />
        )
    }
    }
  />
);

export default PrivateRoute;