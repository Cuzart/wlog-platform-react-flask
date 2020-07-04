import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import uuid from "uuid";
import Spinner from "react-bootstrap/Spinner";
import "../App.css";

const pin = new Icon({
  iconUrl: "/images/pinIcon.svg",
  iconSize: [25, 25],
});

class LeafletMap extends Component {
  render() {
    const position = [
      this.props.activePost.location_latitude,
      this.props.activePost.location_longitude,
    ];
    const { isLoading, tripData } = this.props;

    return (
      <div className="container">
        <Map center={position} zoom="8" maxZoom={14} minZoom={2}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          {/* renders markers and polyline on map when data is loaded otherwise a it renders a spinner */}
          {!isLoading ? (
            tripData.posts.map((post) => {
              const {
                location_latitude,
                location_longitude,
                location_label,
                subtitle,
              } = post;

              return (
                <React.Fragment key={uuid.v4}>
                  <Polyline
                    color="#ff7070"
                    positions={this.props.polyline}
                  ></Polyline>
                  <Marker
                    position={[location_latitude, location_longitude]}
                    icon={pin}
                    onClick={() => {
                      this.props.handleActiveMarker(post);
                    }}
                  >
                    <Popup>
                      <h5>{subtitle}</h5>
                      <p>{location_label}</p>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })
          ) : (
            <Spinner className="spinner" animation="border" size="lg" />
          )}
        </Map>
      </div>
    );
  }
}

export default LeafletMap;
