import React, { Component } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { withRouter } from "react-router-dom";
import SaveChangesModal from "../layout/SaveChangesModal";
import PostForm from "../PostForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Spinner from "../Spinner";

export class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: "",
      location: "",
      locationObject: { label: "" },
      tripId: "1",
      showModal: false,
      trips: [],
      isLoading: true,
    };
  }

  // fetching all trips of current user
  getTripData() {
    axios
      .get("/profile/1")
      .then((res) => {
        this.setState({
          trips: res.data.trips,
          isLoading: false,
        });
      })

      .catch((error) => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.getTripData();
  }

  // Updates state when form is changed
  handleChange = (event) => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // leaflet-geosearch asynchronous API call to get a result{x: longitude, y: latitude, label: adress}
  handleLocationApi = async (event) => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: this.state.location });
    if (results.length > 0) {
      this.setState({ locationObject: results[0] });
    }
  };

  // adds a post to a existing trip
  handleSubmit = (event) => {
    this.setState({ showModal: false });
    // calls for each image in active editor /uploadImg
    window.tinymce.activeEditor.uploadImages((success) => {
      let post = {
        trip_id: this.state.tripId,
        post: {
          subtitle: this.state.caption,
          location_label: this.state.locationObject.label,
          location_longitude: this.state.locationObject.x,
          location_latitude: this.state.locationObject.y,
          text: window.tinymce.activeEditor.getContent(),
        },
      };
      console.log(post);
      // sending to API and give feedback
      axios.post("/createPost", post).then((res) => {
        //check if successfully created
        console.log(res.data);
        this.props.history.push("/profile");
      });
    });
  };

  // Shows modal on submit
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    return (
      <div as={Row} className="container" style={formStyle}>
        {!this.state.isLoading ? (
          <React.Fragment>
            <Col>
              <PostForm
                heading="Add a blog entry"
                handleChange={this.handleChange}
                handleEditorChange={this.handleEditorChange}
                handleLocationApi={this.handleLocationApi}
                locationObject={this.state.locationObject}
                trips={this.state.trips}
              />
              <div style={btnLayout}>
                <Button
                  variant="dark"
                  type="submit"
                  onClick={this.toggleModal}
                  size="lg"
                >
                  Done
                </Button>
              </div>
            </Col>
            <div>
              <SaveChangesModal
                show={this.state.showModal}
                onHide={() => this.setState({ showModal: false })}
                onSubmit={() => this.handleSubmit()}
                heading={"Are you sure you are done?"}
                content={
                  "If you are happy with your blog entry you can press save otherwise just go back and keep on editing"
                }
              />
            </div>
          </React.Fragment>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}
const formStyle = {
  paddingBottom: "100px",
  paddingTop: "50px",
};

const btnLayout = {
  marginTop: "50px",
  textAlign: "right",
  padding: "0px 90px",
};

export default withRouter(CreatePost);
