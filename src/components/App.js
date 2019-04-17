import React, { Component } from 'react'
import Search from './Search'

import MapContainer from './map';

class App extends Component {

  state = {
    currentLat: 0,
    currentLon: 0,
    hotspots: []
  }
  
  getDistance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0
    }
    else {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
      if (dist > 1) {
        dist = 1
      }
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit==="K") { dist = dist * 1.609344 }
      if (unit==="N") { dist = dist * 0.8684 }
      return dist
    }
  }

  getAddressUrl = (query) => {
    const encoded_address = encodeURIComponent(`${query}`)
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded_address}&key=${process.env.REACT_APP_GOOGLE_API}`
  }

  formatHotspotUrl = (zip) => {
    const urlBase = 'https://data.cityofnewyork.us/resource/24t3-xqyv.json'
    return `${urlBase}?zip=${zip}`
  }

  formatAddressData = (responseJSON) => {
    const lat = responseJSON.results[0].geometry.location.lat
    const lon = responseJSON.results[0].geometry.location.lng
    const zip = responseJSON.results[0].formatted_address.match(/[0-9]{5}(?:-[0-9]{4})?/)[0]
    return {lat, lon, zip}
  }

  handleAddressResults = async (query) => {
    const geocodeUrl = this.getAddressUrl(query)
    const responseJSON = await (await fetch(geocodeUrl)).json()
    if (responseJSON.status === 'ZERO_RESULTS') { return console.log('ZERO_RESULTS') }

    const {lat, lon, zip} = this.formatAddressData(responseJSON)
    const hotspotUrl = this.formatHotspotUrl(zip)
    const hotspotResponse = await (await fetch(hotspotUrl)).json()

    const coordinates = hotspotResponse
    .map((hotspot) => {
      const dist = this.getDistance(lat, lon, hotspot.latitude, hotspot.longitude )
      return {dist, ...hotspot}
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0,5)

    this.setState({
      currentLat: lat,
      currentLon: lon,
      hotspots: coordinates
    })
  }

  render() {
    const { hotspots, currentLat, currentLon } = this.state
    return (
      <div className="App">
        <Search handleSearchResults={this.handleSearchResults} handleAddressResults={this.handleAddressResults} />
        {hotspots.length !== 0 
        ? <MapContainer 
          currentLat={currentLat}
          currentLon={currentLon}
          hotspots={hotspots
          } /> : <p>Enter Address in the search bar above.</p>}
      </div>
    )
  }
}

export default App
