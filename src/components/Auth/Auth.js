import React from 'react';
import { GithubLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import authRequests from '../../helpers/data/authRequests';
import './Auth.scss';

class Auth extends React.Component {
  githubAuthenticateUser = () => {
    authRequests
      .githubAuth()
      .then(() => {
        this.props.isAuthenticated();
      })
      .catch(error => console.error('There was an error with AuthRequest', error));
  };

  googleAuthenticateUser = () => {
    authRequests
      .googleAuth()
      .then(() => {
        this.props.isAuthenticated();
      })
      .catch(error => console.error('There was an error with AuthRequest', error));
  };

  render() {
    return (
      <div className="Auth">
        <div className="d-flex justify-content-center mt-5">
          <GithubLoginButton onClick={this.githubAuthenticateUser} />
          <GoogleLoginButton onClick={this.googleAuthenticateUser} />
        </div>
      </div>
    );
  }
}

export default Auth;
