import React from 'react';

import './InputForm.scss';

class InputForm extends React.Component {
  render() {
    return (
      <div className="InputForm">
        <h4>Add Resource</h4>
        <form className="row m-4 justify-content-center">
          <div className="form-group col-md-7">
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              placeholder="Cool Blog"
            />
            <br />
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput2"
              placeholder="https://coolblog.com"
            />
          </div>
          <div className="form-group col-md-1">
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="blogs"
                value="option1"
              />
              <label className="form-check-label" htmlFor="blogs">
                Tutorial
              </label>
            </div>
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                value="option1"
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                Blog
              </label>
            </div>
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                value="option1"
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                Resource
              </label>
            </div>
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                value="option1"
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                Podcast
              </label>
            </div>
          </div>
          <div className="form-group col-md-1 align-self-center">
            {/* <div class="form-group row align-items-center"> */}
            <button type="submit" className="submit-button btn btn-secondary">
              <i className="fas fa-plus fa-2x" />
              {/* <i className="far fa-plus-square fa-4x" /> */}
            </button>
            {/* </div> */}
          </div>
        </form>
      </div>
    );
  }
}

export default InputForm;
