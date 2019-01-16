import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken='';

const mapStyle = {
  //border: '5px solid pink',
  height: 600,
  width: 800,
};

class TexasMap extends Component {

  constructor(props){
    super(props);
    this.state = {
      lng: -97.7,
      lat: 30.27,
      zoom: 5
    }
  };

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    console.log(this.state);

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [lng, lat],
      zoom
    });

    map.on('move', () => {
      console.log(map.getCenter());
    })
  }

  render() {
        const { lng, lat, zoom } = this.state;
    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          className="absolute top right left bottom"
          style={mapStyle}
          ref={el => this.mapContainer = el}
        />
      </div>
    );
  }
}

export default TexasMap;
