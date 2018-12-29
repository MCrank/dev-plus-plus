import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import moment from 'moment';

import connection from '../helpers/data/connection';
import Auth from '../components/Auth/Auth';
import authRequests from '../helpers/data/authRequests';
import articleRequests from '../helpers/data/articleRequests';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import Profile from '../components/Profile/Profile';
import OutputForm from '../components/OutputForm/OutputForm';
import InputForm from '../components/InputForm/InputForm';
import Graph from '../components/Graph/Graph';
import githubRequests from '../helpers/data/githubRequests';

import './App.scss';

class App extends Component {
  state = {
    authed: false,
    uid: '',
    gitHubUserName: '',
    gitHubAccessToken: '',
    activeTab: 'tutorial',
    resources: [],
    tutorials: [],
    blogs: [],
    podcasts: [],
    gitHubChartData: [],
    gitHubCommitCount: 0,
  };

  componentDidMount() {
    connection();

    // Get all the articles for the logged on user and push them into seperate state based on 'type'
    if (localStorage.getItem('uid')) {
      this.getAllArticles();
    }

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userId = localStorage.getItem('uid');
        const gitHubUserNameStorage = localStorage.getItem('gitHubUsername');
        const gitHubAccessTokenStorage = localStorage.getItem('gitHubAccessToken');
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
    this.setState({ authed: false });
  }

  isAuthenticated = (userName, accessToken) => {
    const userId = authRequests.getCurrentUid();
    this.setState({
      authed: true,
      uid: userId,
      gitHubUserName: userName,
      gitHubAccessToken: accessToken,
    });
    localStorage.setItem('uid', userId);
    localStorage.setItem('gitHubUsername', userName);
    localStorage.setItem('gitHubAccessToken', accessToken);
    this.getAllArticles();
  };

  toggleTab = (tab) => {
    const currentTab = this.state.activeTab;
    if (currentTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  formSubmitEvent = (newArticle) => {
    articleRequests
      .postRequest(newArticle)
      .then(() => {
        this.getAllArticles();
        this.toggleTab(newArticle.type);
      })
      .catch(error => console.error('Error posting new Article', error));
  };

  // Get all of the articles and break them up into individual arrays based on type.
  getAllArticles = () => {
    articleRequests
      .getArticles(localStorage.getItem('uid'))
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

  loadChartData = () => {
    const {
      blogs, tutorials, podcasts, resources, gitHubAccessToken, gitHubUserName,
    } = this.state;

    // Go get github commits (Paginate to get what Guthub will give me)
    const initialUrl = `https://api.github.com/users/${gitHubUserName}/events/public`;
    new Promise((resolve, reject) => {
      githubRequests.getGitHubCommitsChart(initialUrl, [], gitHubAccessToken, resolve, reject);
    })
      .then((gitHubChartData) => {
        // Okay got the commits now lets grab the last 60 days of completed articles from state
        const sixty = moment().subtract(60, 'days');
        [...blogs, ...tutorials, ...podcasts, ...resources].forEach((article) => {
          const eventDate = moment.unix(article.completedDate).format('L');
          const chartDateExists = gitHubChartData.find(y => y.date === eventDate);
          // Check if the article is complete and falls after our sixt day window
          if (article.isCompleted && moment(eventDate, 'L').isAfter(sixty)) {
            // If there is already a date just increment article count
            if (chartDateExists) {
              chartDateExists.articleCount += 1;
            } else {
              // Article not complete so leave count alone
              gitHubChartData.push({
                date: eventDate,
                commits: 0,
                articleCount: 1,
              });
            }
          }
        });
        const fiveDays = moment().subtract(5, 'days');
        let commitCounter = 0;
        gitHubChartData.forEach((chartObject) => {
          if (moment(chartObject.date).isAfter(fiveDays)) {
            commitCounter += chartObject.commits;
          }
        });
        this.setState({ gitHubCommitCount: commitCounter });
        this.setState({ gitHubChartData });
      })
      .catch(error => console.error('There was an error getting the github events', error));
  };

  render() {
    const {
      gitHubUserName,
      gitHubAccessToken,
      resources,
      tutorials,
      blogs,
      podcasts,
      activeTab,
      gitHubChartData,
      gitHubCommitCount,
    } = this.state;

    const logoutClickEvent = () => {
      authRequests.logoutUser();
      localStorage.clear();
      this.setState({
        authed: false,
        uid: '',
        gitHubUserName: '',
        gitHubAccessToken: '',
        resources: [],
        tutorials: [],
        blogs: [],
        podcasts: [],
        gitHubChartData: [],
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
            <Profile
              gitHubUserName={gitHubUserName}
              gitHubAccessToken={gitHubAccessToken}
              gitHubCommitCount={gitHubCommitCount}
            />
            <div className="resource-area col-md-8">
              <InputForm onSubmit={this.formSubmitEvent} />
              <hr />
              <OutputForm
                getAllArticles={this.getAllArticles}
                tutorials={tutorials}
                resources={resources}
                blogs={blogs}
                podcasts={podcasts}
                activeTab={activeTab}
                toggleTab={this.toggleTab}
                deleteSingleArticle={this.deleteArticle}
                updateSingleArticle={this.completeArticle}
              />
            </div>
          </div>
          <hr />
          <div className="graph-output row">
            <Graph loadChartData={this.loadChartData} gitHubChartData={gitHubChartData} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
