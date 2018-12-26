import axios from 'axios';
import parse from 'parse-link-header';
import moment from 'moment';
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
        // Loop through each event and grab the length of the commit array
        commitCount += pushEvent.payload.commits.length;
      });
      resolve(commitCount);
    })
    .catch(error => reject(error));
});

// const getGitHubCommitsChart = (url, events, accessToken) => new Promise((resolve, reject) => {
//   axios
//     .get(`${url}`, {
//       headers: { Authorization: `token ${accessToken}` },
//     })
//     .then((result) => {
//       const link = parse(result.headers.link);
//       const pushEvents = events.concat(
//         result.data.filter(
//           gitHubEvent => gitHubEvent.type === 'PushEvent'
//               && moment(gitHubEvent.created_at).isSameOrAfter(moment().subtract(60, 'days')),
//         ),
//       );
//       if (link.next) {
//         getGitHubCommitsChart(link.next.url, pushEvents, accessToken);
//       } else {
//         //   const pushEventsData = [];
//         //   for (let i = 0; i < pushEvents.length; i += 1) {
//         //     const element = pushEvents[i];
//         //     pushEventsData.push({
//         //       date: moment(element.created_at).format('l'),
//         //       commits: element.payload.commits.length,
//         //     });
//         //   }
//         return Promise.resolve(pushEvents);
//       }
//       // resolve(pushEvents);
//     })
//     .catch(error => reject(error));
// });

const getGitHubCommitsChart = (url, events, accessToken, resolve, reject) => {
  axios
    .get(`${url}`, {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then((result) => {
      const link = parse(result.headers.link);
      const pushEvents = events.concat(
        result.data.filter(
          gitHubEvent => gitHubEvent.type === 'PushEvent'
            && moment(gitHubEvent.created_at).isSameOrAfter(moment().subtract(60, 'days')),
        ),
      );
      if (link.next) {
        getGitHubCommitsChart(link.next.url, pushEvents, accessToken, resolve, reject);
      } else {
        const pushEventsData = [];
        for (let i = 0; i < pushEvents.length; i += 1) {
          const element = pushEvents[i];
          pushEventsData.push({
            date: moment(element.created_at).format('l'),
            commits: element.payload.commits.length,
          });
        }
        resolve(pushEventsData);
      }
    })
    .catch(error => reject(error));
};

export default { getGitHubUser, getGitHubCommits, getGitHubCommitsChart };
