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

import './Graph.scss';

class Graph extends React.Component {
  state = {
    opacity: {
      articleCount: 1,
      commits: 1,
    },
  };

  static propTypes = {
    loadChartData: PropTypes.func,
    gitHubChartData: PropTypes.array,
  };

  componentDidMount() {
    // Boo on this until I can research a better way to make sure my article
    // arrays are getting populated before loadChartData() is run
    setTimeout(this.props.loadChartData, 300);
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
    const { opacity } = this.state;
    const { gitHubChartData } = this.props;

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
              name="Articles Completed"
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
