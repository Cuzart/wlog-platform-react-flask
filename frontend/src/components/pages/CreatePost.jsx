import React, { Component } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { withRouter } from "react-router-dom";
import TripForm from "../TripForm";
import PostForm from "../PostForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SaveChangesModal from "../layout/SaveChangesModal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import TripImage from "../TripImage";
import Alert from "react-bootstrap/Alert";

export class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      thumbnail: null,
      thumbnailUrl: null,
      fileFormLabel: "4:3 format",
      country: "",
      description: "",
      caption: "",
      location: "",
      locationObject: { label: "" },
      showModal: false,
      variant: "",
      alertContent: "",
    };
  }
  // show Modal
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  // Updates state when form is changed
  handleChange = () => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // leaflet-geosearch asynchronous API call to get a result{x: longitude, y: latitude, label: adress}
  handleLocationApi = async () => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: this.state.location });
    if (results.length > 0) {
      this.setState({ locationObject: results[0] });
    }
  };

  // updates thumbnail and its url in state when new file is selected
  handleFileSelect = () => {
    this.setState({
      thumbnail: window.event.target.files[0],
      thumbnailUrl: URL.createObjectURL(window.event.target.files[0]),
      fileFormLabel: window.event.target.files[0].name,
    });
  };

  // submitting a entire trip with a post as callback pipeline
  handleSubmit = () => {
    window.event.preventDefault();
    this.setState({ showModal: false });
    const fd = new FormData();
    fd.append("thumbnail", this.state.thumbnail);
    // checks if form is filled
    if (
      this.state.title.length > 0 &&
      this.state.country.length > 0 &&
      this.state.description.length > 0 &&
      this.state.caption.length > 0 &&
      this.state.location.length > 0
    ) {
      // submits the thumbnail
      axios.post("/images", fd).then((res) => {
        let trip = {
          title: this.state.title,
          country: this.state.country,
          description: this.state.description,
        };
        if (res.data.statusCode !== 0) {
          this.setState({
            alertContent: "Please add a valid thumbnail.",
            variant: "danger",
          });
        } else {
          // submits the trip form
          axios.post("/trips", trip).then((res) => {
            // calls for each image in active editor /uploadImg
            let tripId = res.data.trip_id;
            window.tinymce.activeEditor.uploadImages(() => {
              let post = {
                trip_id: tripId,
                post: {
                  subtitle: this.state.caption,
                  location_label: this.state.locationObject.label,
                  location_longitude: this.state.locationObject.x,
                  location_latitude: this.state.locationObject.y,
                  text: window.tinymce.activeEditor.getContent(),
                },
              };
              // error handling trips
              switch (res.data.statusCode) {
                case 1:
                  this.setState({
                    alertContent: "Did you miss some attributes?",
                    variant: "danger",
                  });
                  break;
                case 3:
                  this.setState({
                    alertContent:
                      "Something went wrong. The trip could not be saved.",
                    variant: "danger",
                  });
                  break;
                default:
                  break;
              }
              // submits post with editor content
              axios.post("/posts", post).then((res) => {
                // error handling in total
                switch (res.data.statusCode) {
                  case 0:
                    this.props.showAlert(
                      "success",
                      "Successfully created a new trip"
                    );
                    // close alerts
                    this.props.history.push(
                      "/users/" + sessionStorage.getItem("user")
                    );

                    break;
                  case 1:
                    this.setState({
                      alertContent: "Did you miss some attributes?",
                      variant: "danger",
                    });
                    break;
                  case 2:
                    this.setState({
                      alertContent: "No valid trip found.",
                      variant: "danger",
                    });
                    break;
                  case 3:
                    this.setState({
                      alertContent:
                        "Something went wrong. Could not save post. Sorry!",
                      variant: "danger",
                    });
                    break;
                  default:
                    break;
                }
              });
            });
          });
        }
      });
    } else {
      this.setState({
        alertContent: "Did you miss some attributes?",
        variant: "danger",
      });
    }
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <div>
        <Alert variant={this.state.variant} style={alertStyle}>
          {this.state.alertContent}
        </Alert>
        <div as={Row} className="container" style={formStyle}>
          <Col>
            <TripForm
              handleChange={this.handleChange}
              handleFileSelect={this.handleFileSelect}
              fileFormLabel={this.state.fileFormLabel}
            />
            <hr style={hrStyle} />
            <PostForm
              heading="add your first blog entry"
              handleChange={this.handleChange}
              handleEditorChange={this.handleEditorChange}
              handleLocationApi={this.handleLocationApi}
              locationObject={this.state.locationObject}
            />
            <div style={previewStyle}>
              <TripImage
                title={this.state.title}
                description={this.state.description}
                thumbnailUrl={this.state.thumbnailUrl}
                country={this.state.country}
              />
            </div>
            <div style={btnLayout}>
              <Button
                variant="outline-ownLight"
                type="submit"
                onClick={this.toggleModal}
                size="lg"
              >
                Save
              </Button>
            </div>
          </Col>
          <div>
            <SaveChangesModal
              show={this.state.showModal}
              onHide={() => this.setState({ showModal: false })}
              onSubmit={() => this.handleSubmit()}
              heading={"Are you sure you are done?"}
            />
          </div>
        </div>
      </div>
    );
  }
}

const formStyle = {
  paddingBottom: "100px",
};
const previewStyle = {
  position: "absolute",
  top: "5%",
  left: "58%",
};
const btnLayout = {
  marginTop: "50px",
  textAlign: "center",
};
const hrStyle = {
  margin: "30px 0px",
};

const alertStyle = {
  textAlign: "center",
  fontWeight: "bold",
};
export default withRouter(CreatePost);
