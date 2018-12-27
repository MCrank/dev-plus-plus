import React from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import articleShape from '../../helpers/props/articleShape';
import githubRequests from '../../helpers/data/githubRequests';

import './Graph.scss';

class Graph extends React.Component {
  state = {
    gitHubChartData: [],
  };

  static propTypes = {
    blogs: PropTypes.arrayOf(articleShape),
    podcasts: PropTypes.arrayOf(articleShape),
    tutorials: PropTypes.arrayOf(articleShape),
    resources: PropTypes.arrayOf(articleShape),
    gitHubUserName: PropTypes.string,
    gitHubAccessToken: PropTypes.string,
  };

  componentDidMount() {
    const {
      gitHubUserName, gitHubAccessToken, blogs, podcasts, tutorials, resources,
    } = this.props;

    if (gitHubUserName && gitHubAccessToken) {
      const initialUrl = `https://api.github.com/users/${gitHubUserName}/events/public`;
      new Promise((resolve, reject) => {
        githubRequests.getGitHubCommitsChart(initialUrl, [], gitHubAccessToken, resolve, reject);
      })
        .then((gitHubChartData) => {
          const sixty = moment().subtract(60, 'days');
          [...blogs, ...tutorials, ...podcasts, ...resources].forEach((x) => {
            const eventDate = moment.unix(x.completedDate).format('L');
            const o = gitHubChartData.find(y => y.date === eventDate);

            if (x.isCompleted && moment(eventDate, 'L').isAfter(sixty)) {
              if (o) {
                o.articleCount += 1;
              } else {
                gitHubChartData.push({
                  date: eventDate,
                  commits: 0,
                  articleCount: 1,
                });
              }
            }
          });
          this.setState({ gitHubChartData });
        })
        .catch(error => console.error('There was an error getting the github events', error));
    }
  }

  render() {
    const { gitHubChartData } = this.state;
    return (
      <div className="Graph col">
        <h2>Graph goes here</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={gitHubChartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend />
            <Tooltip />
            <Area
              type="monotone"
              name="Commits"
              dataKey="commits"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              name="Artciles Completed"
              dataKey="articleCount"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Graph;
