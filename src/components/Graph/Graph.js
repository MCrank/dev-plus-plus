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
    opacity: {
      articleCount: 1,
      commits: 1,
    },
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
          this.setState({ gitHubChartData });
        })
        .catch(error => console.error('There was an error getting the github events', error));
    }
  }

  handleMouseEnter(o) {
    const { dataKey } = o;
    const { opacity } = this.state;

    this.setState({
      opacity: { ...opacity, [dataKey]: 0.1 },
    });
  }

  handleMouseLeave(o) {
    const { dataKey } = o;
    const { opacity } = this.state;

    this.setState({
      opacity: { ...opacity, [dataKey]: 1 },
    });
  }

  render() {
    const { gitHubChartData, opacity } = this.state;

    return (
      <div className="graph col">
        <div className="col-md-4">
          <h3 className="graph-title">Profile Metrics</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={gitHubChartData}
            height={250}
            margin={{
              top: 30,
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
            <Legend
              verticalAlign="top"
              onMouseEnter={this.handleMouseEnter.bind(this)}
              onMouseLeave={this.handleMouseLeave.bind(this)}
              wrapperStyle={{
                marginBottom: '5px',
              }}
            />
            <Tooltip />
            <Area
              type="monotone"
              name="Artciles Completed"
              dataKey="articleCount"
              strokeOpacity={opacity.commits}
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
            <Area
              type="monotone"
              name="Commits"
              dataKey="commits"
              strokeOpacity={opacity.articleCount}
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Graph;
