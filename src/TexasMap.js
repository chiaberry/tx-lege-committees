import React, { Component } from 'react';
// import mapboxgl from 'mapbox-gl';
import ReactMapGL from 'react-map-gl';
import { house, houseMembers } from './house.js'
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './App.css';


const MBTOKEN = process.env.REACT_APP_MAPBOX_KEY

const styles = theme => ({
  root: {
    display: 'flex',
  },
  layout: {
    width: 'auto',
    margin: 20,
  },
  committees: {
    maxHeight: 250,
    overflow: 'scroll'
  },
});

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
      comName: '',
      mapStyle: {
        "version": 8,
        "name": "default",
        sources: {
          'districts': {
            "type": 'vector', 
            "url": 'mapbox://chiaberry.cj584zqk'
            // "url": 'mapbox://styles/chiaberry/cjrliarm24c712tqknss4x6gf'
          }
        },
         layers: [
          {
            id: 'districtsPick',
            source: 'districts',
            // 'source-layer': 'Texas_State_House_Districts-9q65q4',
            'source-layer': this.props.map,
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

    map.addLayer({
      id: 'districtsNumber',
      source: 'districts',
      'source-layer': 'DIST_NBR',
      type: 'symbol',
      'symbol-placement': 'point', 
      // filter: this.state.districts
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
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.layout}>
          <Toolbar>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Texas Legislative Committee Map
            </Typography>
          </Toolbar>
        <Grid container spacing={24}>
          <Grid item xs={4}>

            <Paper>
            <Typography> Choose a House Committee</Typography>
            <div className={classes.committees}>
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
            </Paper>
            <Paper>
              <p> 
                {this.state.com !== 0 && <a 
                  href={`https://house.texas.gov/committees/committee/?committee=${this.state.com}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                {this.state.comName}
                </a>}
              </p>

              <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">District</TableCell>
                  <TableCell align="left">Representative</TableCell>
                  <TableCell align="center">Party</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.districts.slice(2).map(row => {
                  if (!houseMembers[row]) {
                    console.log(row)
                  }
                  return (<TableRow key={row}>
                    <TableCell align="center">{row}</TableCell>
                    <TableCell align="left">{houseMembers[row][1]}</TableCell>
                    <TableCell align="center">{houseMembers[row][0]}</TableCell>
                  </TableRow>)
                })}
              </TableBody>
            </Table>
            </Paper>
          </Grid>
        <Grid item xs={8}>
          <ReactMapGL
            ref={(reactMap)=> {this.reactMap = reactMap; }}
            {...this.state.viewport}
            onViewportChange={(viewport) => this.setState({viewport})}
            mapboxApiAccessToken={MBTOKEN}
            onLoad={()=>console.log('loaded ', this.state.mapStyle)}
            // mapStyle={'mapbox://styles/mapbox/streets-v8'}
            mapStyle={'mapbox://styles/chiaberry/cjrliarm24c712tqknss4x6gf'}
          />
        </Grid>
        </Grid>
      </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TexasMap);
