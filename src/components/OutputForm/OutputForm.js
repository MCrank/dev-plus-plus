import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  TabContent, TabPane, Nav, NavItem, NavLink, Row, Col,
} from 'reactstrap';

import articleShape from '../../helpers/props/articleShape';
import OutputItem from '../OutputItem/OutputItem';

import './OutputForm.scss';

class OutputForm extends React.Component {
  static propTypes = {
    blogs: PropTypes.arrayOf(articleShape),
    podcasts: PropTypes.arrayOf(articleShape),
    tutorials: PropTypes.arrayOf(articleShape),
    resources: PropTypes.arrayOf(articleShape),
  };

  state = {
    activeTab: 'tutorials',
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  render() {
    const {
      resources, blogs, tutorials, podcasts,
    } = this.props;

    // Hydrate our articles
    const blogItems = blogs.map(blog => <OutputItem key={blog.id} blog={blog} />);
    const podcastItems = podcasts.map(podcast => <OutputItem key={podcast.id} podcast={podcast} />);
    const tutorialItems = tutorials.map(tutorial => (
      <OutputItem key={tutorial.id} tutorial={tutorial} />
    ));
    const resourceItems = resources.map(resource => (
      <OutputItem key={resource.id} resource={resource} />
    ));

    return (
      <div className="OutputForm">
        <h4>Output Form Goes Here</h4>
        <div className="container">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'tutorials' })}
                onClick={() => {
                  this.toggle('tutorials');
                }}
              >
                Tutorials
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'blogs' })}
                onClick={() => {
                  this.toggle('blogs');
                }}
              >
                Blogs
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'resources' })}
                onClick={() => {
                  this.toggle('resources');
                }}
              >
                Resources
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'podcasts' })}
                onClick={() => {
                  this.toggle('podcasts');
                }}
              >
                Podcasts
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="tutorials">
              <Row>
                <Col sm="12">
                  <ul>{tutorialItems}</ul>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="blogs">
              <Row>
                <Col sm="12">
                  <ul>{blogItems}</ul>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="resources">
              <Row>
                <Col sm="12">
                  <ul>{resourceItems}</ul>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="podcasts">
              <Row>
                <Col sm="12">
                  <ul>{podcastItems}</ul>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}

export default OutputForm;
