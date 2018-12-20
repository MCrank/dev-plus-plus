import React from 'react';
import { GithubLoginButton } from 'react-social-login-buttons';
import authRequests from '../../helpers/data/authRequests';
import './Auth.scss';

class Auth extends React.Component {
  githubAuthenticateUser = () => {
    authRequests
      .githubAuth()
      .then((results) => {
        // console.log(results);
        const userName = results.additionalUserInfo.username;
        const { accessToken } = results.credential;
        // console.log('AccessToken', accessToken);
        this.props.isAuthenticated(userName, accessToken);
      })
      .catch(error => console.error('There was an error with AuthRequest', error));
  };

  render() {
    return (
      <div className="Auth">
        <div className="d-flex justify-content-center mt-5">
          <GithubLoginButton onClick={this.githubAuthenticateUser} />
        </div>
      </div>
    );
  }
}

export default Auth;
