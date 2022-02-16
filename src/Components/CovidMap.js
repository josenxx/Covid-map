import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { CovidDataService } from '../Service/CovidDataService';
import { MapUtils } from '../utils/MapUtils';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class CovidMap extends Component {
  static defaultProps = {
    center: {
      lat: 40,
      lng: -96,
    },
    zoom: 11
  };
  state = {
    points: {},
    zoomLevel: 11,
    boundary: {}
  }
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDM3jT_kT5RONg3vJ-6lfd-Z1W4F5nyswU" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onGoogleApiLoaded={
            () => {
              CovidDataService.getAllCountyCases()
                .then(resoponse => {
                  this.setState({
                    points: MapUtils.convertCovidPoints(resoponse.data)
                  });
                    
                }).catch(error => {
                  console.error(error)
                })
                
            }
          }
          onChange={(changeEventObject) =>{
            this.setState({
              zoomLevel: changeEventObject.zoom,
              boundary: changeEventObject.bounds
            })
          }}
        >
          {this.renderCovidPoints()}
        </GoogleMapReact>
      </div>
    );
  }
  renderCovidPoints() {
    const result = [];
    const zoomLevel = this.state.zoomLevel;
    let pointsLevel = 'county'
    if (zoomLevel < 1 || zoomLevel > 20) {
      return result;
    } else if (zoomLevel > 4 && zoomLevel <= 9) {
      pointsLevel = 'state';
    } else if (zoomLevel >= 1 && zoomLevel <= 4) {
      pointsLevel = 'nation';
    }
    const pointsToRender = this.state.points[pointsLevel];
    if (! pointsToRender) {
      return result;
    }
    if (pointsLevel === "county") {
      for (const point of pointsToRender) {
        if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)) {
          result.push(
             <AnyReactComponent 
              lat={point.coordinates.latitude}
              lng={point.coordinates.longtitude}
              text={point.county}
             />
          )
        }
      }
    }
    return result;
  }
}

export default CovidMap;