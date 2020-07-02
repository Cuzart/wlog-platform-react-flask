import React, { Component } from "react";
import axios from "axios";
import TripImage from "./TripImage";
import Spinner from "./Spinner";
import Button from "react-bootstrap/Button";

class TripGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileId: this.props.match.params.id,
      tripData: [],
      isLoading: true,
    };
  }
  // fetching the data from the API
  getTripData() {
    axios
      .get("/profile/" + this.state.profileId)
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

  // requests sign out, clears session storage and redirect
  handleSignOut = () => {
    axios.get("/logout").then((res) => {
      sessionStorage.clear();
      if (res.data.statusCode === 0) {
        this.props.history.push("/");
        //success TODO
      }
    });
  };

  render() {
    return (
      <div className="container" style={gridStyle}>
        <Button variant="dark" onClick={() => this.handleSignOut()}>
          {" "}
          Sign Out{" "}
        </Button>
        <div className="row ">
          {!this.state.isLoading ? (
            <React.Fragment>
              {this.state.tripData.map((trip) => {
                const { id, title, description, thumbnail, country } = trip;
                return (
                  <div className="col-6 my-4 d-flex justify-content-center">
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
  marginTop: "100px",
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "20px",
};

export default TripGrid;
