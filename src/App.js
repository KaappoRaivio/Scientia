import React from 'react';
import './flat-remix.css';
import './App.css';



import Instruments from "./components/instruments"



class App extends React.Component {

  render() {

    return (
        <div className="instruments">
          <Instruments />
        </div>
    );
  }
}

export default App;
