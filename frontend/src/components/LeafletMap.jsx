import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from "leaflet"

const pin = new Icon({
    iconUrl: "/images/pinIcon.svg",
    iconSize: [25, 25]
});

 let data = { posts: []};

class LeafletMap extends Component {
    constructor(props) {
        super(props);
        
    this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 3,
            activePost:  null,
            data: {}, 
        }
    }  
    
    async componentDidMount() {
        const url = "/trip/1";
        const response = await fetch(url);
        data = await response.json();
        this.setState({data: data.posts})

        console.log(data)
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

                    <Marker position={position} icon={pin}> 
                         <Popup>

                            </Popup>
                    </Marker>
                        
             
                    {/* {this.state.data.map(post => (
                        <Marker key={post.id} position={post.location_latitude, post.location_longitude} >
                            <Popup>

                            </Popup>
                        </Marker>
                    ))
                    } */}
                    
                </Map>
            </div>
        )
    }
}

export default LeafletMap
