import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

class LeafletMap extends Component {
    //const [activePost,setActivePost] = React.useState(null);
        state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 3,
            activePost:  null,
    }
    
    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <div className="container">
                <Map center={position} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
                        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                    {/* {tripData.posts.map(post => (
                        <Marker key={postId} position={location.latitude, location.longitude} onClick={() => {
                            setActive(post)
                        }}>
                            <Popup>

                            </Popup>
                        </Marker>
                    ))} */}
                </Map>
            </div>
        )
    }
}

export default LeafletMap
