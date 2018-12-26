import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import connection from '../helpers/data/connection';
import Auth from '../components/Auth/Auth';
import authRequests from '../helpers/data/authRequests';
import articleRequests from '../helpers/data/articleRequests';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import Profile from '../components/Profile/Profile';
import OutputForm from '../components/OutputForm/OutputForm';
import InputForm from '../components/InputForm/InputForm';
import Graph from '../components/Graph/Graph';

import './App.scss';

class App extends Component {
  state = {
    authed: false,
    uid: '',
    gitHubUserName: '',
    gitHubAccessToken: '',
    resources: [],
    tutorials: [],
    blogs: [],
    podcasts: [],
  };

  componentDidMount() {
    connection();

    // Get all the articles for the logged on user and push them into seperate state based on 'type'
    this.getAllArticles();

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userId = sessionStorage.getItem('uid');
        const gitHubUserNameStorage = sessionStorage.getItem('gitHubUsername');
        const gitHubAccessTokenStorage = sessionStorage.getItem('gitHubAccessToken');
        this.setState({
          authed: true,
          uid: userId,
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
    const userId = authRequests.getCurrentUid();
    this.setState({
      authed: true,
      uid: userId,
      gitHubUserName: userName,
      gitHubAccessToken: accessToken,
    });
    sessionStorage.setItem('uid', userId);
    sessionStorage.setItem('gitHubUsername', userName);
    sessionStorage.setItem('gitHubAccessToken', accessToken);
  };

  formSubmitEvent = (newArticle) => {
    articleRequests
      .postRequest(newArticle)
      .then(() => {
        this.getAllArticles();
      })
      .catch(error => console.error('Error posting new Article', error));
  };

  // Get all of the articles and break them up into individual arrays based on type.
  getAllArticles = () => {
    articleRequests
      .getArticles(sessionStorage.getItem('uid'))
      .then((articles) => {
        const resources = [];
        const tutorials = [];
        const blogs = [];
        const podcasts = [];
        articles.forEach((article) => {
          switch (article.type) {
            case 'resource':
              resources.push(article);
              break;
            case 'tutorial':
              tutorials.push(article);
              break;
            case 'blog':
              blogs.push(article);
              break;
            case 'podcast':
              podcasts.push(article);
              break;
            default:
              break;
          }
        });
        // Now sort the arrays so completed is at the bottom
        tutorials.sort((a, b) => a.isCompleted - b.isCompleted);
        resources.sort((a, b) => a.isCompleted - b.isCompleted);
        blogs.sort((a, b) => a.isCompleted - b.isCompleted);
        podcasts.sort((a, b) => a.isCompleted - b.isCompleted);
        // Put each array by type in state
        this.setState({
          resources,
          tutorials,
          blogs,
          podcasts,
        });
      })
      .catch(error => console.error('Error getting artciles', error));
  };

  sortArticleArray = (arr) => {
    arr.sort((a, b) => b - a);
  };

  deleteArticle = (articleId) => {
    articleRequests
      .deleteArticle(articleId)
      .then(() => {
        this.getAllArticles();
      })
      .catch(error => console.error('There was an error deleteing the article', error));
  };

  completeArticle = (articleId, article) => {
    articleRequests
      .updateArticle(articleId, article)
      .then(() => {
        this.getAllArticles();
      })
      .catch(error => console.error('There was an error updating the article', error));
  };

  render() {
    const {
      gitHubUserName, gitHubAccessToken, resources, tutorials, blogs, podcasts,
    } = this.state;
    const logoutClickEvent = () => {
      authRequests.logoutUser();
      sessionStorage.clear();
      this.setState({
        authed: false,
        uid: '',
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
              <InputForm onSubmit={this.formSubmitEvent} />
              <OutputForm
                tutorials={tutorials}
                resources={resources}
                blogs={blogs}
                podcasts={podcasts}
                deleteSingleArticle={this.deleteArticle}
                updateSingleArticle={this.completeArticle}
              />
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
