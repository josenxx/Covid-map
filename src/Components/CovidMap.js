import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { CovidDataService } from '../service/CovidDataService';
import { MapUtils } from '../utils/MapUtils';
import CovidCard from './CovidCard';
import key from './config';
// const AnyReactComponent = ({ text }) => <div>{text}</div>;

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
          bootstrapURLKeys={{ key: key.SECRET_API_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onGoogleApiLoaded={
            () => {
              CovidDataService.getAllCountyCases()
                .then(response => {
                  this.setState({
                    points: MapUtils.convertCovidPoints(response.data)
                  });
                }).catch(error => {
                  console.error(error);
                })
            }
          }
          onChange={(changeEventObject) =>{
            this.setState({
              zoomLevel: changeEventObject.zoom,
              boundary: changeEventObject.bounds
            });
          }}
        >
          {this.renderCovidPoints()}
        </GoogleMapReact>
      </div>
    );
  }
  renderCovidPoints() {
    const result = []
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
            <CovidCard
            lat={point.coordinates.latitude}
            lng={point.coordinates.longitude}
            subTitle={point.province}
            title={point.county}
            confirmed={point.stats.confirmed}
            deaths={point.stats.deaths}
            />
          )
        } 
      }
    } else if (pointsLevel === "state") {
      for (const state in pointsToRender) {
        const point = pointsToRender[state];
        if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)) {
          result.push(
            <CovidCard
            lat={point.coordinates.latitude}
            lng={point.coordinates.longitude}
            subtitle={point.country}
            title={state}
            confirmed={point.confirmed}
            deaths={point.deaths}
            />
          )
        }
      }
    }
    return result;
  }
}

export default CovidMap;