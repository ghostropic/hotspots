import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
  width: '60%',
  height: '60%'
};

export class MapContainer extends Component {

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }
 
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }
  
  render() {
    const { currentLat, currentLon, hotspots, google } = this.props
    const { activeMarker, showingInfoWindow, selectedPlace } = this.state
    return (
      <Map
        onClick={this.onMapClicked}
        google={google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
         lat: currentLat,
         lng: currentLon
        }}>
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}>
            <div>
              <h1>{selectedPlace.name}</h1>
            </div>
        </InfoWindow>
        <Marker
          onClick={this.onMarkerClick}
          title={'Current Location'}
          name={'Home'}
          position={{lat: currentLat, lng: currentLon}} 
        />
        {hotspots.map(hotspot => 
          <Marker
            onClick={this.onMarkerClick}
            key={hotspot.doitt_id} 
            position={{lat: hotspot.latitude, lng: hotspot.longitude}}
            icon={{url: 'http://maps.google.com/mapfiles/ms/icons/blue.png'}}
              />)}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API
})(MapContainer);