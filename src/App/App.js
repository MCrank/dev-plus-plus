import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import connection from '../helpers/data/connection';
import Auth from '../components/Auth/Auth';
import authRequests from '../helpers/data/authRequests';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import Profile from '../components/Profile/Profile';
import OutputForm from '../components/OutputForm/OutputForm';
import InputForm from '../components/InputForm/InputForm';
import Graph from '../components/Graph/Graph';

import './App.scss';

class App extends Component {
  state = {
    authed: false,
    gitHubUserName: '',
    gitHubAccessToken: '',
  };

  componentDidMount() {
    connection();

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const gitHubUserNameStorage = sessionStorage.getItem('gitHubUsername');
        const gitHubAccessTokenStorage = sessionStorage.getItem('gitHubAccessToken');
        this.setState({
          authed: true,
          gitHubUserName: gitHubUserNameStorage,
          gitHubAccessToken: gitHubAccessTokenStorage,
        });
      } else {
        this.setState({
          authed: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  isAuthenticated = (userName, accessToken) => {
    this.setState({
      authed: true,
      gitHubUserName: userName,
      gitHubAccessToken: accessToken,
    });
    sessionStorage.setItem('gitHubUsername', userName);
    sessionStorage.setItem('gitHubAccessToken', accessToken);
  };

  render() {
    const { gitHubUserName, gitHubAccessToken } = this.state;
    const logoutClickEvent = () => {
      authRequests.logoutUser();
      sessionStorage.clear();
      this.setState({
        authed: false,
        gitHubUserName: '',
        gitHubAccessToken: '',
      });
    };

    if (!this.state.authed) {
      return (
        <div className="App">
          <MyNavbar isAuthed={this.state.authed} logoutClickEvent={logoutClickEvent} />
          <Auth isAuthenticated={this.isAuthenticated} />
        </div>
      );
    }
    return (
      <div className="App">
        <MyNavbar isAuthed={this.state.authed} logoutClickEvent={logoutClickEvent} />
        <div className="container-fluid">
          <div className="main-output row justify-content-around py-3">
            <Profile gitHubUserName={gitHubUserName} gitHubAccessToken={gitHubAccessToken} />
            <div className="resource-area col-md-8">
              <InputForm />
              <OutputForm />
            </div>
          </div>
          <div className="graph-output row">
            <Graph />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
