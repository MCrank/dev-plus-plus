import axios from 'axios';
import apiKeys from '../apiKeys';

const gitHubApiUrl = apiKeys.githubApi.apiUrl;

const getGitHubUser = (userName, accessToken) => new Promise((resolve, reject) => {
  axios
    .get(`${gitHubApiUrl}/user`, { headers: { Authorization: `token ${accessToken}` } })
    .then((result) => {
      resolve(result.data);
    })
    .catch(error => reject(error));
});

const getGitHubCommits = (userName, accessToken) => new Promise((resolve, reject) => {
  axios
    .get(`${gitHubApiUrl}/users/${userName}/events/public`, {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then((result) => {
      const commitCount = result.data.filter(event => event.type === 'PushEvent').length;
      resolve(commitCount);
    })
    .catch(error => reject(error));
});
export default { getGitHubUser, getGitHubCommits };
