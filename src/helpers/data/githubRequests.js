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

// Should refactor the app to store state because between this and the GetGitHubCommitsCart
// the app will make double to API calls.  😢
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

const getGitHubCommitsChart = (url, events, accessToken, resolve, reject) => {
  axios
    .get(`${url}`, {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then((result) => {
      // Parse the link Header to get pagination info
      const link = parse(result.headers.link);
      // Build array of only 'PushEvents" < 60 days from Guthub Events
      const pushEvents = events.concat(
        result.data.filter(
          gitHubEvent => gitHubEvent.type === 'PushEvent'
            && moment(gitHubEvent.created_at).isSameOrAfter(moment().subtract(60, 'days')),
        ),
      );
      // If there is a 'Next" link in the header recursive call the function
      // passing the array back through and the Next page to get them
      if (link.next) {
        getGitHubCommitsChart(link.next.url, pushEvents, accessToken, resolve, reject);
      } else {
        // Create new Array of Objects for ReCharts format
        const pushEventsData = [];
        for (let i = 0; i < pushEvents.length; i += 1) {
          const element = pushEvents[i];
          const eventDate = moment(element.created_at).format('L');
          // This block will summarize the data by day
          const eventDateMatch = pushEventsData.find(x => x.date === eventDate);
          if (eventDateMatch) {
            eventDateMatch.commits += element.payload.commits.length;
          } else {
            pushEventsData.push({
              date: eventDate,
              commits: element.payload.commits.length,
              articleCount: 0,
            });
          }
        }
        // Sort the final results so they display in the chart properly
        pushEventsData.sort((a, b) => (moment(a.date, 'L').isAfter(moment(b.date, 'L')) ? 1 : -1));
        resolve(pushEventsData);
      }
    })
    .catch(error => reject(error));
};

export default { getGitHubUser, getGitHubCommits, getGitHubCommitsChart };
