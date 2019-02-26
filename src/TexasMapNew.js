import React, { Component } from 'react';
import MapboxMap from 'react-mapbox-wrapper'
import { Helpers } from 'react-mapbox-wrapper';
import { house } from './house.js'


const MBTOKEN ='pk.eyJ1IjoiY2hpYWJlcnJ5IiwiYSI6ImNqcWlnb2cwYzYwZnMzeHVsODNkN2VzbnkifQ.m51M9ZlZxX_bOacxb_xREA';

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
//       }
    }
  }
  };

  componentDidMount() {
    // const { lng, lat, zoom } = this.state;
    const map= this.reactMap.getMap();

    map.on('load', () => {
      console.log('LOADED')
      map.addSource('districts', {
        type: 'vector', 
        url: 'mapbox://chiaberry.cj584zqk'
      });
    })

  }

  getFilterExp() {
    const base = ['in', 'DIST_NBR']
    console.log(base.concat(this.state.districts));
    return base.concat(this.state.districts);    
  }

  // addMapLayer() {
  //   const map = this.reactMap.getMap();
  //        map.addLayer({
  //       id: 'districtsPick',
  //       source: 'districts',
  //       'source-layer': 'Texas_State_House_Districts-9q65q4',
  //       type: 'fill',
  //       paint: {
  //         "fill-outline-color": 'black',
  //         "fill-color": 'rgba(33, 98, 159, 0.5)'
  //       },
  //       filter: this.state.districts
  //       //filter: ['in', 'DIST_NBR', 49, 100, 10]
  //       });
  // }

  render() {
    console.log(this.state)
    const { districts } = this.state;
    return (
      <div>

        <MapboxMap
          accessToken={MBTOKEN}
          coordinates={{ lng: -100.1, lat: 31.3, }}
          ref={(reactMap)=> {this.reactMap = reactMap; }}
        />

        <div style= {divStyle} className="committees">
        <select name={'house'} onChange={evt=> {
          Helpers.removeGeoJSON(this.reactMap.getMap(), 'districtsPick')
          const answer = house.filter(obj => (obj.id===evt.target.value))
          console.log(answer)
          this.setState(
            {districts: ['in', 'DIST_NBR'].concat(answer[0].districts)},
            //drawGeoJSON(map, id, data, paint = {}, onClick, type = 'fill')
            Helpers.drawGeoJSON(
              this.reactMap.getMap(),
              'districtsPick', 
              {
                type: 'vector', 
                url: 'mapbox://chiaberry.cj584zqk'
              },
               ))
          // this.addMapLayer();
        }}>

        <option value={[]}>{''}</option>
        {house.map(com => (
          <option key={com.id} value={com.id}> {com.name}</option>))}

        </select>
        </div>

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
