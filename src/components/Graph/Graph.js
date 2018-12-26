import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import githubRequests from '../../helpers/data/githubRequests';

import './Graph.scss';

const data = [
  { name: 'Page A', uv: 4000, amt: 2400 },
  { name: 'Page B', uv: 3000, amt: 2210 },
  { name: 'Page C', uv: 2000, amt: 2290 },
  { name: 'Page D', uv: 2780, amt: 2000 },
  { name: 'Page E', uv: 1890, amt: 2181 },
  { name: 'Page F', uv: 2390, amt: 2500 },
  { name: 'Page G', uv: 3490, amt: 2100 },
];

class Graph extends React.Component {
  state = {
    gitHubChartData: [],
  };

  static propTypes = {
    gitHubUserName: PropTypes.string,
    gitHubAccessToken: PropTypes.string,
  };

  componentDidMount() {
    const { gitHubUserName, gitHubAccessToken } = this.props;
    if (gitHubUserName && gitHubAccessToken) {
      const initialUrl = `https://api.github.com/users/${gitHubUserName}/events/public`;
      new Promise((resolve, reject) => {
        githubRequests.getGitHubCommitsChart(initialUrl, [], gitHubAccessToken, resolve, reject);
      })
        .then((gitHubChartData) => {
          this.setState({ gitHubChartData });
        })
        .catch(error => console.error('There was an error getting the github events', error));
    }
    // if (gitHubUserName && gitHubAccessToken) {
    //   const initialUrl = `https://api.github.com/users/${gitHubUserName}/events/public`;
    //   githubRequests
    //     .getGitHubCommitsChart(initialUrl, [], gitHubAccessToken)
    //     .then((gitHubChartData) => {
    //       this.setState({ gitHubChartData });
    //     })
    //     .catch(error => console.error('There was an error getting the github events', error));
    // }
  }

  render() {
    const { gitHubChartData } = this.state;
    return (
      <div className="Graph col">
        <h2>Graph goes here</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={gitHubChartData}
            margin={{
              top: 10,
              right: 30,
              left: 30,
              bottom: 10,
            }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="commits" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Graph;
