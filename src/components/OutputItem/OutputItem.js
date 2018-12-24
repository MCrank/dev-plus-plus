import React from 'react';
import PropTypes from 'prop-types';
import articleRequests from '../../helpers/data/articleRequests';
import articleShape from '../../helpers/props/articleShape';

import './OutputItem.scss';

class OutputItem extends React.Component {
  static propTypes = {
    resource: articleShape,
    blog: articleShape,
    tutorial: articleShape,
    podcast: articleShape,
  };

  render() {
    let article = [];
    if (this.props.tutorial) {
      article = this.props.tutorial;
    } else if (this.props.resource) {
      article = this.props.resource;
    } else if (this.props.blog) {
      article = this.props.blog;
    } else if (this.props.podcast) {
      article = this.props.podcast;
    }
    return (
      <li className="output-item m-2 align-items-center">
        <span className="col-sm-4">{article.name}</span>
        <span className="col-sm-5">
          <a href={article.url} target="_blank" rel="noreferrer noopener">
            {article.url}
          </a>
        </span>
        <span className="col-sm-2">
          <button className="btn btn-default" onClick={this.deleteArticle}>
            <i className="far fa-trash-alt" />
          </button>
        </span>
        <div className="form-check align-self-center">
          <input type="checkbox" className="form-check-input" id="complete-check" />
          <label className="form-check-label" htmlFor="complete-check">
            Done!
          </label>
        </div>
      </li>
    );
  }
}

export default OutputItem;
