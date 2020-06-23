import React, { Component } from "react";
import "../../App.css";
import LeafletMap from "../LeafletMap";
import Accordion from "react-bootstrap/Accordion";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import axios from "axios";
let polyline = [];

export class TripPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePost: { text: "", location_longitude: 0, location_latitude: 0 },
      tripData: [],
      isLoading: true,
    };
  }

  // sets the clicked marker as activePost
  // to open the correct accordion and reset the center point
  handleActiveMarker = (post) => {
    this.setState({ activePost: post });
  };

  // fetching the data from the API
  getTripData() {
    axios
      .get("/trip/1")
      .then((res) => {
        this.setState({
          tripData: res.data,
          isLoading: false,
          activePost: res.data.posts[0],
        });
        polyline = [];
        // creating a array of every post location point
        res.data.posts.map((point) => {
          const { location_latitude, location_longitude } = point;
          polyline.push([location_longitude, location_latitude]);
          return 0;
        });
      })

      .catch((error) => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.getTripData();
  }

  render() {
    return (
      <div className="container" style={containerStyle}>
        <h1 style={headerStyle}>{this.state.tripData.title}</h1>
        <h5 style={{ fontStyle: "italic" }}>{this.state.tripData.country}</h5>
        <div style={descriptionStyle}>{this.state.tripData.description}</div>

        {!this.state.isLoading ? (
          <React.Fragment>
            <LeafletMap
              activePost={this.state.activePost}
              tripData={this.state.tripData}
              isLoading={this.state.isLoading}
              polyline={polyline}
              handleActiveMarker={this.handleActiveMarker}
            />
            <Accordion
              defaultActiveKey={this.state.tripData.posts[0].id}
              activeKey={this.state.activePost.id}
            >
              {this.state.tripData.posts.map((post) => {
                const { id, location_label, subtitle, text } = post;
                return (
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey={id}
                      onClick={() => {
                        this.setState({ activePost: post });
                      }}
                    >
                      <h4>{subtitle}</h4>
                      <p>{location_label}</p>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={id}>
                      <Card.Body>{text}</Card.Body>
                    </Accordion.Collapse>
                  </Card>
                );
              })}
            </Accordion>
          </React.Fragment>
        ) : (
          <Spinner className="spinner" animation="border" size="lg" />
        )}
      </div>
    );
  }
}

const containerStyle = {
  margin: "50px 150px",
};

const headerStyle = {
  fontFamily: "Libre Baskerville , serif",
  margin: "20px 0px",
};

const descriptionStyle = {
  height: "auto",
  minHeight: "200px",
  maxHeight: "400px",
  width: "400px",
  marginTop: "25px",
  padding: "20px",
  marginBottom: "20%",
  backgroundColor: "white",
  borderRadius: "8px",
};

export default TripPage;
