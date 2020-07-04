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
import Alert from 'react-bootstrap/Alert';


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
      note: "",
      alertContent: "",
      visible: false,
    };
  }
  // show Modal
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

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

  // updates thumbnail and its url in state when new file is selected
  handleFileSelect = (event) => {
    this.setState({
      thumbnail: window.event.target.files[0],
      thumbnailUrl: URL.createObjectURL(window.event.target.files[0]),
      fileFormLabel: window.event.target.files[0].name,
    });
  };

  // shows success alert and dismisses it after 3 seconds, then forwards to profile 
  onShowAlert = (tripId)=>{
    this.setState({visible:true},()=>{
      window.setTimeout(()=>{
        this.setState({visible:false});
        this.props.history.push("/trips/" + tripId);
        window.location.reload();
      },3000) 
    });
    //this.props.history.push("/trips/" + tripId);
  }
  

  // submitting a entire trip with a post as callback pipeline
  handleSubmit = (event) => {
    window.event.preventDefault();
    this.setState({ showModal: false });
    const fd = new FormData();
    if(this.state.title.length>0 &&
       this.state.country.length>0 &&
       this.state.description.length>0 &&
       this.state.caption.length>0 &&
       this.state.location.length>0 
      ){
    fd.append("thumbnail", this.state.thumbnail);
    // submits the thumbnail
    axios.post("/images", fd).then((res) => {
      let trip = {
        title: this.state.title,
        country: this.state.country,
        description: this.state.description,
      };
      if (res.data.statusCode  !== 0){
        this.setState({
          note: "Error",
          alertContent: "Please add a valid thumbnail.",
          variant: "danger"
        });
      }else {
      // submits the trip form
      axios.post("/trips", trip).then((res) => {
        // calls for each image in active editor /uploadImg
        console.log(res);
        let tripId = res.data.trip_id;
        window.tinymce.activeEditor.uploadImages((success) => {
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
          switch(res.data.statusCode) {
            case 0:
              this.setState({
                note: "Success",
                alertContent: "You created a Trip! Congrats. You'll be forwarded to your profile.",
                variant: "success"
              });
              window.scrollTo(0, 0);
              this.onShowAlert();
              break;
              case 1:
              this.setState({
                note: "Error",
                alertContent: "Did you miss some attributes?",
                variant: "danger"
              });
              window.scrollTo(0, 0);
              break;
              case 2:
              this.setState({
                note: "Error",
                alertContent: "Please add a thumbnail.",
                variant: "danger"
              });
              window.scrollTo(0, 0);
              break;
              case 3:
              this.setState({
                note: "Success",
                alertContent: "Something went wrong. Could not save trip. Sorry!",
                variant: "danger"
              });
              window.scrollTo(0, 0);
              break;
              default:
              break;
            }
          // submits post with editor content
          axios.post("/posts", post).then((res) => {
            //check if successfully created
            console.log(res.data);
            switch(res.data.statusCode) {
              case 0:
                this.setState({
                  note: "Success",
                  alertContent: "You created a post! Congrats. You'll be forwarded to your profile.",
                  variant: "success"
                });
                window.scrollTo(0, 0);
                this.onShowAlert(post.trip_id);
                break;
                case 1:
                this.setState({
                  note: "Error",
                  alertContent: "Did you miss some attributes?",
                  variant: "danger"
                });
                window.scrollTo(0, 0);
                break;
                case 2:
                this.setState({
                  note: "Error",
                  alertContent: "No valid trip found.",
                  variant: "danger"
                });
                window.scrollTo(0, 0);
                break;
                case 3:
                this.setState({
                  note: "Success",
                  alertContent: "Something went wrong. Could not save post. Sorry!",
                  variant: "danger"
                });
                window.scrollTo(0, 0);
                break;
                default:
                break;
            }
            //this.props.history.push("/profile");
            //this.props.history.push("/trips/" + tripId);
          });
        });
      });
    }
    });
  }else{
    console.log("something went wrong")
    this.setState({
      note: "Error",
      alertContent: "Did you miss some attributes?",
      variant: "danger"
    });
    console.log(this.state)
  }
  };

  render() {
    return (
      <div>
        <Alert variant={this.state.variant} style={alertStyle}>
          <Alert.Heading>{this.state.note}</Alert.Heading>
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
  padding: "0px 90px",
};
const hrStyle = {
  margin: "30px 0px",
};

const alertStyle = {
  textAlign: "center",
  fontWeight: "bold",
}
export default withRouter(CreatePost);
