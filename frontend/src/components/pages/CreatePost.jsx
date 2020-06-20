import React, { Component } from "react";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import TripForm from "../TripForm";
import PostForm from "../PostForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SaveChangesModal from "../layout/SaveChangesModal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import TripImage from "../TripImage";

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
      //content: null,
      location: "",
      locationObject: { label: "" },
      showModal: false,
    };
  }
  // show Modal
  toggleModal = () => {
   this.setState({ showModal: !this.state.showModal });
  }; 

  // // If editor is changed
  // handleEditorChange = (content, editor) => {
  //   this.setState({ content });
  // };
  
  // Updates state when form is changed
  handleChange = (event) => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // leaflet-geosearch asynchronous API call to get a result{x: longitude, y: latitude, label: adress}
  handleLocationApi = async (event) => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ 'query': this.state.location });
    if (results.length > 0) {
      this.setState({ locationObject: results[0] })
    }
  }

  // updates thumbnail and its url in state when new file is selected
  handleFileSelect = (event) => {
    this.setState({
      thumbnail: window.event.target.files[0],
      thumbnailUrl: URL.createObjectURL(window.event.target.files[0]),
      fileFormLabel: window.event.target.files[0].name,
    });
  };

  // submitting a entire trip with a post as callback pipeline
  handleSubmit = (event) => {
    window.event.preventDefault();
    this.setState({ showModal: false });
    const fd = new FormData();
    fd.append("thumbnail", this.state.thumbnail);
    // submits the thumbnail
    axios.post("/uploadImg", fd).then((res) => {
      let trip = { "title": this.state.title, "country": this.state.country, "description": this.state.description }
      // submits the trip form
      axios.post("/createTrip", trip).then((res) => {
        // calls for each image in editor /uploadImg
        window.tinymce.activeEditor.uploadImages((success) => {
          let post = {
            "trip_id": res.trip_id,
            "post": {
              "subtitle": this.state.caption,
              "location_label": this.state.locationObject.label,
              "location_longitude": this.state.locationObject.x,
              "location_latitude": this.state.locationObject.y,
              "text": window.tinymce.activeEditor.getContent(),
            }
          }
          // submits post with editor content
          axios.post('/createPost', post).then((res) => {
              // Todo
              console.log("Redirect to /profile")
          });
        });
      })
    });
    
    
  };

  render() {
    return (
      <div as={Row} className="container" style={formStyle}>
        <Col>
          <TripForm
            handleChange={this.handleChange}
            handleFileSelect={this.handleFileSelect}
            fileFormLabel={this.state.fileFormLabel}
          />
          < hr style={hrStyle} />
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
            <Button variant="dark" type="submit" onClick={this.toggleModal} size="lg">
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
      </div>
    );
  }
}
const formStyle = {
  paddingBottom: "100px",
  paddingTop: "50px",
};
const previewStyle = {
  position: "absolute",
  top: "5%",
  left: "58%",
};
const btnLayout = {
  marginTop: "50px",
  textAlign: "right",
  padding: "0px 90px"
}
const hrStyle = {
  margin: "30px 0px",
};

export default CreatePost;
