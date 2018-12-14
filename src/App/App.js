import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <button className="btn btn-info"> Hello Button</button>
        <Button
          tag="a"
          color="success"
          size="large"
          href="http://reactstrap.github.io"
          target="_blank"
        >
          View Reactstrap Docs
        </Button>
      </div>
    );
  }
}

export default App;
