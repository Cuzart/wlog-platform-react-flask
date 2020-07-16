import React from 'react';
import { Redirect } from 'react-router-dom';

class ProtectedRoute extends React.Component {
  render() {
    const Component = this.props.component;
    const isAuthenticated = sessionStorage.getItem('authenticated');

    return isAuthenticated ? (
      <Component showAlert={this.props.showAlert} />
    ) : (
      <Redirect to={{ pathname: '/' }} />
    );
  }
}

export default ProtectedRoute;
