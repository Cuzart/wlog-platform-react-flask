import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import uuid from "uuid";
import "../../App.css";
import LeafletMap from "../LeafletMap";
import Spinner from "../Spinner";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
let polyline = [];

export class TripPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: this.props.match.params.id,
      activePost: { text: "", location_longitude: 0, location_latitude: 0 },
      tripData: [],
      isLoading: true,
      liked: false,
      likedMessage: "Clap 👏🏼",
    };
  }

  // sets the clicked marker as activePost
  // to open the correct accordion and reset the center point
  handleActiveMarker = (post) => {
    this.setState({ activePost: post });
  };

  handleLike = () => {
    if (!this.state.liked) {
      this.setState({
        liked: true,
        likedMessage: "Thank you!",
      });
    } else {
      this.setState({
        liked: false,
        likedMessage: "Clap 👏🏼",
      });
    }
  };

  // fetching the data from the API
  getTripData() {
    axios
      .get("/trips/" + this.state.tripId)
      .then((res) => {
        this.setState({
          tripData: res.data,
          isLoading: false,
          activePost: res.data.posts[0],
          userId: res.data.user_id,
        });

        polyline = [];
        // creating a array of every post location point
        res.data.posts.map((point) => {
          const { location_latitude, location_longitude } = point;
          polyline.push([location_latitude, location_longitude]);
          return 0;
        });
      })

      .catch(() => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.getTripData();
  }

  render() {
    return (
      <div className="container" style={containerStyle}>
        <div
          className="row align-content-center justify-content-between"
          style={rowStyle}
        >
          <div className="col">
            <h1 style={headerStyle}>{this.state.tripData.title}</h1>
            <h5 style={{ fontStyle: "italic" }}>
              {this.state.tripData.country}
            </h5>
          </div>

          <div className="mr-4">
            <Button
              active={this.state.liked}
              variant="outline-info"
              onClick={() => this.handleLike()}
            >
              {this.state.likedMessage}
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-4 mr-2">
            <div style={descriptionStyle}>
              {this.state.tripData.description}
              <div style={author}>
                <Button
                  onClick={() =>
                    this.props.history.push("/users/" + this.state.userId)
                  }
                  variant="light"
                >
                  by {this.state.tripData.author}
                </Button>
              </div>
            </div>
          </div>
          <div className="col-7 pr-0 ml-5 mt-4" style={leafletContainer}>
            <LeafletMap
              activePost={this.state.activePost}
              posts={this.state.tripData.posts}
              isLoading={this.state.isLoading}
              polyline={polyline}
              handleActiveMarker={this.handleActiveMarker}
              zoom="8"
              toTrip={false}
            />
          </div>
        </div>

        {/* render after data is loaded */}
        {!this.state.isLoading ? (
          <React.Fragment>
            <h2 style={headerStyle}>Posts</h2>
            <Accordion
              defaultActiveKey={this.state.tripData.posts[0].id}
              activeKey={this.state.activePost.id}
            >
              {this.state.tripData.posts.map((post) => {
                const { id, location_label, subtitle, text } = post;
                return (
                  <Card key={uuid.v4()}>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey={id}
                      onClick={() => {
                        this.setState({ activePost: post });
                      }}
                    >
                      <h4>{subtitle}</h4>
                      <p style={{ fontStyle: "italic" }}>{location_label}</p>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={id}>
                      <Card.Body dangerouslySetInnerHTML={{ __html: text }} />
                    </Accordion.Collapse>
                  </Card>
                );
              })}
            </Accordion>
          </React.Fragment>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

const rowStyle = {
  alignItems: "center",
  paddingRight: "50px",
};

const containerStyle = {
  margin: "32px 150px",
};

const headerStyle = {
  fontFamily: "Libre Baskerville , serif",
  margin: "20px 0px",
};

const author = {
  position: "absolute",
  bottom: "0",
  right: "0",
  padding: "20px",
};

const descriptionStyle = {
  position: "relative",
  height: "auto",
  minHeight: "200px",
  maxHeight: "400px",
  width: "400px",
  marginTop: "25px",
  padding: "20px",
  paddingBottom: "70px",
  marginBottom: "20%",
  backgroundColor: "white",
  borderRadius: "8px",
};

const leafletContainer = {
  width: "600px",
  position: "relative",
};

export default withRouter(TripPage);
