import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import TexasMap from './TexasMap.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TexasMap />
      </div>
    );
  }
}

export default App;
