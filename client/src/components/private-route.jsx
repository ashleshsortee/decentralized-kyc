import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import renderNotification from '../utils/notification-handler';

export const getSession = () => {
  const jwt = Cookies.get('userToken');
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

  return session;
}

export const logOut = () => {
  Cookies.remove('userToken');
  renderNotification('default', 'Info', 'Logged out!');
}

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route {...rest} render={props => {
    const currentUserSession = getSession();
    if (!currentUserSession) {
      return <Redirect to={{ pathname: '/login' }} />
    }
    const { payload: { role: currentUserRole } } = currentUserSession;

    if (roles && roles.indexOf(currentUserRole) === -1) {
      return <Redirect to={{ pathname: '/customer' }} />
    }

    return <Component {...props} />
  }} />
);

export default PrivateRoute;