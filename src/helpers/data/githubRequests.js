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
      let commitCount = 0;
      const pushEvents = result.data.filter(event => event.type === 'PushEvent');
      pushEvents.forEach((pushEvent) => {
        commitCount += pushEvent.payload.commits.length;
        // pushEvent.payload.commits.forEach((commit) => {
        //   if (commit.distinct === true) {
        //     console.log(pushEvent.payload.commits.length);
        //     commitCount += pushEvent.payload.commits.length;
        //   }
        // });
      });
      // const commitCount = result.data.filter(event => event.type === 'PushEvent').length;
      resolve(commitCount);
    })
    .catch(error => reject(error));
});
export default { getGitHubUser, getGitHubCommits };
