import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import articleShape from '../../helpers/props/articleShape';

import './OutputItem.scss';

class OutputItem extends React.Component {
  static propTypes = {
    resource: articleShape,
    blog: articleShape,
    tutorial: articleShape,
    podcast: articleShape,
    deleteSingleArticle: PropTypes.func,
    updateSingleArticle: PropTypes.func,
  };

  getArticleType = () => {
    // let article = [];
    if (this.props.tutorial) {
      return this.props.tutorial;
    }
    if (this.props.resource) {
      return this.props.resource;
    }
    if (this.props.blog) {
      return this.props.blog;
    }
    if (this.props.podcast) {
      return this.props.podcast;
    }
    return null;
  };

  deleteArticle = (event) => {
    event.preventDefault();
    const article = this.getArticleType();
    const { deleteSingleArticle } = this.props;
    deleteSingleArticle(article.id);
  };

  completeArticle = (event) => {
    event.preventDefault();
    const article = this.getArticleType();
    const { updateSingleArticle } = this.props;
    if (article.isCompleted) {
      article.isCompleted = false;
      article.completedDate = 0;
    } else {
      article.isCompleted = true;
      article.completedDate = moment().unix();
    }
    updateSingleArticle(article.id, article);
  };

  render() {
    const article = this.getArticleType();
    return (
      <li className="output-item my-2 align-items-center py-1">
        <span className="col-md-4">{article.name}</span>
        <span className="col-md-6">
          <a href={article.url} target="_blank" rel="noreferrer noopener">
            {article.url}
          </a>
        </span>
        <span className="col-md-1">
          <button className="del-button" type="button" onClick={this.deleteArticle}>
            <i className="far fa-trash-alt fa-lg" />
          </button>
        </span>
        <div className="col-md-1 form-check align-self-center">
          <input
            type="checkbox"
            className="form-check-input"
            id="complete-check"
            checked={article.isCompleted}
            onChange={this.completeArticle}
          />
          <label className="form-check-label" htmlFor="complete-check">
            Done!
          </label>
        </div>
      </li>
    );
  }
}

export default OutputItem;
