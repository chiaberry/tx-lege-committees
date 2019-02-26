import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { house } from './house.js'


mapboxgl.accessToken='pk.eyJ1IjoiY2hpYWJlcnJ5IiwiYSI6ImNqcWlnb2cwYzYwZnMzeHVsODNkN2VzbnkifQ.m51M9ZlZxX_bOacxb_xREA';

const mapStyle = {
  //border: '5px solid pink',
  height: 600,
  width: 640,
  margin: 20,
};

const divStyle = {
  margin: '40px',
  border: '5px solid pink'
};

class TexasMap extends Component {

  constructor(props){
    super(props);
    this.state = {
      lng: -100.1,
      lat: 31.3,
      zoom: 5,
      counties: [],
      districts: [],
    }
  };

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/outdoors-v9',
      // style: 'mapbox://styles/chiaberry/cjrliarm24c712tqknss4x6gf',
      center: [lng, lat],
      zoom
    });

    map.on('load', () => {
      map.addSource('districts', {
        type: 'vector', 
        url: 'mapbox://chiaberry.cj584zqk'
      });

    map.addLayer({
      id: 'districtsPick',
      source: 'districts',
      'source-layer': 'Texas_State_House_Districts-9q65q4',
      type: 'fill',
      paint: {
        "fill-outline-color": 'black',
        "fill-color": 'rgb(33, 98, 159)'
      },
      filter: ['in', 'DIST_NBR', 49, 100]
      });
    })

    map.on('move', () => {
      console.log(map.getCenter());
      console.log(typeof(this.state.districts))
    })
  }

  renderData(ctys) {
    return (
        {
         "type":"FeatureCollection",
          "features":this.state.counties })
  }

  render() {
    const { lng, lat, zoom } = this.state;
    return (
      <div>
        <div className="inline-block top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          className="absolute top right left bottom"
          style={mapStyle}
          ref={el => this.mapContainer = el}
        />
        <div style= {divStyle} className="committees">
        <select name={'house'} onChange={evt=> {
          this.setState({districts: parseInt(evt.target.value)});
          console.log(evt.target.value)
        }}>

        {house.map(com => (
          <option value={com.districts}> {com.name}</option>))}

        </select>
        </div>
      </div>
    );
  }
}

export default TexasMap;
