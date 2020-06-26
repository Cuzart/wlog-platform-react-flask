import React, { Component } from "react";
import axios from "axios";
import TripImage from "./TripImage";
import Spinner from "react-bootstrap/Spinner";

class TripGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tripData: [],
      isLoading: true,
    };
  }
  // fetching the data from the API
  getTripData() {
    axios
      .get("/profile/1")
      .then((res) => {
        this.setState({
          tripData: res.data.trips,
          isLoading: false,
        });
      })
      .catch((error) => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.getTripData();
  }

  render() {
    return (
      <div className="container" style={gridStyle}>
        <h1> Trips </h1>
        <div className="row">
          {!this.state.isLoading ? (
            <React.Fragment>
              {this.state.tripData.map((trip) => {
                const { id, title, description, thumbnail, country } = trip;
                return (
                  <div className="col-md-6">
                    <TripImage
                      title={title}
                      description={description}
                      thumbnailUrl={thumbnail}
                      country={country}
                      tripId={id}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          ) : (
            <Spinner className="spinner" animation="border" size="lg" />
          )}
        </div>
      </div>
    );
  }
}

const gridStyle = {
  marginTop: "100px",
};

export default TripGrid;
