import React, { Component } from 'react';
// import mapboxgl from 'mapbox-gl';
import ReactMapGL from 'react-map-gl';
import { house } from './house.js'
import './App.css';


const MBTOKEN = process.env.REACT_APP_MAPBOX_KEY


const divStyle = {
  margin: '40px',
  border: '5px solid pink'
};

class TexasMap extends Component {

  constructor(props){
    super(props);
    this.state = {
      viewport: {
        width: 640,
        height: 600,
        longitude: -100.1,
        latitude: 31.3,
        zoom: 5
      },
      counties: [],
      districts: [],
      mapStyle: {
        "version": 8,
        "name": "default",
        sources: {
          'districts': {
            "type": 'vector', 
            "url": 'mapbox://chiaberry.cj584zqk'
          }
        },
         layers: [
          {
            id: 'districtsPick',
            source: 'districts',
            'source-layer': 'Texas_State_House_Districts-9q65q4',
            type: 'fill',
            paint: {
              "fill-outline-color": 'black',
              "fill-color": 'rgba(33, 98, 159, 0.5)'
            },
            filter: ['in', 'DIST_NBR', '49']
          }
        ]
    }
  }
  };

  componentDidMount() {
    const map= this.reactMap.getMap();

    map.on('load', () => {
      console.log('LOADED')
      map.addSource('districts', {
        type: 'vector', 
        url: 'mapbox://chiaberry.cj584zqk'
      });
    })

    // map.on('move', () => {
    //   console.log(map.getCenter());
    // })
  }

  getFilterExp() {
    const base = ['in', 'DIST_NBR']
    console.log(base.concat(this.state.districts));
    return base.concat(this.state.districts);    
  }

  removeMapLayer() {
    const map = this.reactMap.getMap();
    console.log(map.getLayer('districtsPick'))
    map.removeLayer('districtsPick');
  }

  addMapLayer() {
    const map = this.reactMap.getMap();
         map.addLayer({
        id: 'districtsPick',
        source: 'districts',
        'source-layer': 'Texas_State_House_Districts-9q65q4',
        type: 'fill',
        paint: {
          "fill-outline-color": 'black',
          "fill-color": 'rgba(44, 98, 159, 0.5)'
        },
        filter: this.state.districts
        //filter: ['in', 'DIST_NBR', 49, 100, 10]
        });
  }

  renderData(ctys) {
    return (
        {
         "type":"FeatureCollection",
          "features":this.state.counties })
  }

  render() {
    console.log(this.state)
    const { districts } = this.state;
    return (
      <div>
        <div className="left">
          <div className="committees">
            <select name={'house'} onChange={evt=> {
              this.removeMapLayer();
              const answer = house.filter(obj => (obj.id===evt.target.value))
              this.setState({districts: ['in', 'DIST_NBR'].concat(answer[0].districts)}, this.addMapLayer)
            }}>
              <option value={[]}>{''}</option>
              {house.map(com => (
                <option key={com.id} value={com.id}> {com.name}</option>))}

            </select>
          </div>
        </div>
        <ReactMapGL
          ref={(reactMap)=> {this.reactMap = reactMap; }}
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
          mapboxApiAccessToken={MBTOKEN}
          onLoad={()=>console.log('loaded ', this.state.mapStyle)}
          mapStyle={'mapbox://styles/mapbox/outdoors-v9'}
        />

        <div> 
          <ul>
            {this.state.districts.map(d => (
            <li>{d}</li>))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TexasMap;
