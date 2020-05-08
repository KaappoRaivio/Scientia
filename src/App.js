import React from 'react';
import './App.css';

import Instruments from "./components/instruments"



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {heading: 0};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Instruments />
      </div>  
    );
  }
}

export default App;
