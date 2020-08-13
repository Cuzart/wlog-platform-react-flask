import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import Spinner from "./layout/Spinner"
import '../App.css';

const pin = new Icon({
  iconUrl: '/images/pinIcon.svg',
  iconSize: [25, 25],
});

class LeafletMap extends Component {
  render() {
    const position = [
      this.props.activePost.location_latitude,
      this.props.activePost.location_longitude,
    ];
    const { isLoading, posts } = this.props;

    return (
      <div className='container'>
        <Map
          center={position}
          scrollWheelZoom={false}
          zoom={this.props.zoom}
          maxZoom={14}
          minZoom={1.5}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
            url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
          />
          {!isLoading ? (
            this.props.polyline !== undefined ? (
              <Polyline color='#ff7070' positions={this.props.polyline}></Polyline>
            ) : (
              ''
            )
          ) : (
            ''
          )}

          {/* renders markers and polyline on map when data is loaded otherwise a it renders a spinner */}
          {!isLoading ? (
            posts.map((post) => {
              const {
                id,
                location_latitude,
                location_longitude,
                created_at,
                subtitle,
                trip_id,
              } = post;

              const date = created_at.substring(5, 16);
              return (
                <Marker
                  key={id}
                  position={[location_latitude, location_longitude]}
                  icon={pin}
                  onClick={() => {
                    this.props.handleActiveMarker(post);
                  }}
                >
                  <Popup key={id}>
                    <h5>{subtitle}</h5>
                    {this.props.toTrip ? (
                      <a href={'/trips/' + trip_id}>See the trip</a>
                    ) : (
                      <p> {date}</p>
                    )}
                  </Popup>
                </Marker>
              );
            })
          ) : (
            <Spinner />
          )}
        </Map>
      </div>
    );
  }
}

export default LeafletMap;
