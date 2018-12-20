import Axios from 'axios';
import apiKeys from '../apiKeys';

const gitHubApiUrl = apiKeys.githubApi.apiUrl;

const getGitHubUser = (userName, accessToken) => new Promise((resolve, reject) => {
  Axios.get(`${gitHubApiUrl}/user`, { headers: { Authorization: `token ${accessToken}` } })
    .then((result) => {
      resolve(result.data);
    })
    .catch(error => reject(error));
});

export default { getGitHubUser };
