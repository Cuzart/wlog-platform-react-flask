import React, { Component } from "react";
import axios from "axios";
import uuid from "uuid";
import TripImage from "./TripImage";
import Spinner from "./Spinner";

class TripGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tripData: [],
      isLoading: true,
    };
  }

  // fetching user trips from the API
  getTripData() {
    axios
      .get("/users/" + this.props.userId + "/trips")
      .then((res) => {
        this.setState({
          tripData: res.data,
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
        <div className="row ">
          {!this.state.isLoading ? (
            <React.Fragment>
              {this.state.tripData.map((trip) => {
                const { id, title, description, thumbnail, country } = trip;
                return (
                  <div
                    key={uuid.v4()}
                    className="col-6 my-4 d-flex justify-content-center"
                  >
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
            <Spinner />
          )}
        </div>
      </div>
    );
  }
}

const gridStyle = {
  marginBottom: "80px",
  minHeight: "200px",
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "0px 0px 20px 20px",
};

export default TripGrid;
