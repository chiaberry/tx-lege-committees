import React, { Component } from 'react';
// import mapboxgl from 'mapbox-gl';
import ReactMapGL from 'react-map-gl';
import { house } from './house.js'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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
      com: 0,
      comName: 'Test 123',
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
    this.removeMapLayer = this.removeMapLayer.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  }

  removeMapLayer() {
    const map = this.reactMap.getMap();
    console.log(map.getLayer('districtsPick'))
    map.removeLayer('districtsPick');
  }

  addMapLayer() {
    console.log(this.state)
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
    });
  }

  handleChange(committee) {
    console.log(committee)
    this.removeMapLayer();
    const answer = house.filter(obj => (obj.id === committee.id))
    this.setState(
      { 
        districts: ['in', 'DIST_NBR'].concat(answer[0].districts),
        comName: answer[0].name,
        com: answer[0].id
      }, 
      this.addMapLayer);
  }

  render() {
    const { districts } = this.state;
    return (
      <div>
        <CssBaseline />
        <Grid container spacing={24}>
          <Grid item xs={4}>
          <div className="committees">


          <List dense>
            {house.map(com => (
                <ListItem
                  key={com.id}
                  onClick={() => this.handleChange(com)}
                  selected={com.id === this.state.com}
                >
                  <ListItemText primary={com.name} />
                </ListItem>
              ))}
          </List>

          </div>
            <div> 
            <ul>
              <span>{this.state.comName}</span>
              {this.state.districts.slice(2).map(d => (
              <li>{d}</li>))}
            </ul>
            </div>
          </Grid>
        <Grid item xs={8}>
          <ReactMapGL
            ref={(reactMap)=> {this.reactMap = reactMap; }}
            {...this.state.viewport}
            onViewportChange={(viewport) => this.setState({viewport})}
            mapboxApiAccessToken={MBTOKEN}
            onLoad={()=>console.log('loaded ', this.state.mapStyle)}
            mapStyle={'mapbox://styles/mapbox/outdoors-v9'}
          />
        </Grid>
        </Grid>
      </div>
    );
  }
}

export default TexasMap;
