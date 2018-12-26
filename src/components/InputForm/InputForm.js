import React from 'react';
import PropTypes from 'prop-types';
import './InputForm.scss';
import authRequests from '../../helpers/data/authRequests';

const defaultArticle = {
  name: '',
  url: '',
  type: '',
  isCompleted: false,
  completedDate: 0,
  uid: '',
};
class InputForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  state = {
    newArticle: defaultArticle,
    radioChecked: false,
  };

  formFieldStringState = (value, event) => {
    const tempArticle = { ...this.state.newArticle };
    tempArticle[value] = event.target.value;
    this.setState({ newArticle: tempArticle });
  };

  // Don't think I need this one since I don't have any numbers
  // other than date but that is being calculated by moment
  formFieldNumberState = (value, event) => {
    event.preventDefault();
    const tempArticle = { ...this.state.newArticle };
    tempArticle[value] = event.target.value * 1;
    this.setState({ newArticle: tempArticle });
  };

  nameChange = event => this.formFieldStringState('name', event);

  urlChange = event => this.formFieldStringState('url', event);

  typeChange = (event) => {
    this.setState({ radioChecked: event.target.value });
    this.formFieldStringState('type', event);
  };

  formSubmit = (event) => {
    event.preventDefault();
    const { onSubmit } = this.props;
    const newArticle = { ...this.state.newArticle };
    newArticle.uid = authRequests.getCurrentUid();
    onSubmit(newArticle);
    this.setState({ newArticle: defaultArticle, radioChecked: false });
  };

  render() {
    const { newArticle, radioChecked } = this.state;
    return (
      <div className="InputForm">
        <h4>Add Resource</h4>
        <form className="row m-4 justify-content-center" onSubmit={this.formSubmit}>
          <div className="form-group col-md-7">
            {/* <label htmlFor="name">Name:</label> */}
            <div className="input-group">
              <span className="input-group-prepend input-group-text">Name:</span>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Cool Blog"
                value={newArticle.name}
                onChange={this.nameChange}
              />
            </div>
            <br />
            {/* <label htmlFor="url">URL:</label> */}
            <div className="input-group">
              <span className="input-group-prepend input-group-text">Link:</span>
              <input
                type="text"
                className="form-control"
                id="url"
                placeholder="https://coolblog.com"
                value={newArticle.url}
                onChange={this.urlChange}
              />
            </div>
          </div>
          <div className="form-group col-md-1 align-self-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="articleRadios"
                id="tutorials"
                value="tutorial"
                checked={radioChecked === 'tutorial'}
                onChange={this.typeChange}
              />
              <label className="form-check-label" htmlFor="tutorials">
                Tutorial
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="articleRadios"
                id="blogs"
                value="blog"
                checked={radioChecked === 'blog'}
                onChange={this.typeChange}
              />
              <label className="form-check-label" htmlFor="blogs">
                Blog
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="articleRadios"
                id="resources"
                value="resource"
                checked={radioChecked === 'resource'}
                onChange={this.typeChange}
              />
              <label className="form-check-label" htmlFor="resources">
                Resource
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="articleRadios"
                id="podcasts"
                value="podcast"
                checked={radioChecked === 'podcast'}
                onChange={this.typeChange}
              />
              <label className="form-check-label" htmlFor="podcasts">
                Podcast
              </label>
            </div>
          </div>
          <div className="form-group col-md-1 align-self-center">
            <button type="submit" className="submit-button btn btn-secondary">
              <i className="fas fa-plus fa-2x" />
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default InputForm;
