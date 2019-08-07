import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import TexasMap from './TexasMap.js';
// import TexasMap from './TexasMapOlder.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TexasMap map={"Texas_State_House_Districts-9q65q4"}/>
      </div>
    );
  }
}

export default App;
