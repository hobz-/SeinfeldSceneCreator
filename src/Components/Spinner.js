import React, { Component } from 'react';
import GeorgeHead from './resources/costanza_logo.jpg';
import './resources/Spinner.css';

class Spinner extends Component {
  render() {
    return(
      <img style={this.props.style} src={GeorgeHead} className="App-logo" alt="logo" />
    )
  }
}

export default Spinner;
