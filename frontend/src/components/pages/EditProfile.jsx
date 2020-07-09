import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Avatar from "react-avatar-edit";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import SaveChangesModal from "../layout/SaveChangesModal";

const user = sessionStorage.getItem("user");
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldDescription: null,
      description: null,
      preview: null,
      src: null,
      showModal: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDescription();
  }

  // fetching user description
  getDescription = () => {
    axios.get("/users/" + user).then((res) => {
      this.setState({ oldDescription: res.data.description, isLoading: false });
    });
  };

  // show Modal
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleChange = () => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // delete preview when editor is closed
  onClose = () => {
    this.setState({ preview: null });
  };

  // set preview when avatar is cropped
  onCrop = (preview) => {
    this.setState({ preview });
  };

  // converts base64/URLEncoded data component to raw binary (blob)
  dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  // updates the edited profile in the database
  onSave = () => {
    if (this.state.preview !== null) {
      const fd = new FormData();
      let blob = this.dataURItoBlob(this.state.preview);
      let file = new File([blob], "preview.png", { type: "image/png" });
      fd.append("profileImg", file);
      axios.post("/images", fd).then((res) => {
        console.log(res.data);
      });
    }
    if (this.state.description !== null) {
      console.log(this.state.description);
      axios
        .patch("/users/" + user, { description: this.state.description })
        .then((res) => {
          console.log(res.data);
        });
    }
    this.setState({ showModal: false });
    this.props.history.push("/users/" + user);
    window.location.reload();
  };

  render() {
    return (
      <div className="container py-4">
        <div className="row align-items-center">
          <div className="col text-center">
            <Button
              variant="outline-own"
              onClick={() => {
                this.props.history.push(
                  "/users/" + sessionStorage.getItem("user")
                );
              }}
            >
              Back
            </Button>
          </div>
          <div className="col">
            <h1 style={headerStyles}> Edit your profile </h1>
          </div>
          <div className="col text-center">
            <Button
              variant="outline-ownLight"
              onClick={() => this.toggleModal()}
            >
              Save
            </Button>
          </div>
        </div>

        {!this.state.isLoading ? (
          <div className="row mt-3 pb-4 justify-content-center ">
            <div className="col-6">
              <h5 style={{ fontWeight: "bold" }}> Edit your description</h5>
              <div style={descriptionStyle}>
                <Form.Control
                  defaultValue={
                    this.state.oldDescription === null
                      ? "Introduce yourself to the world ..."
                      : this.state.oldDescription
                  }
                  maxLength="235"
                  minLength="5"
                  as="textarea"
                  name="description"
                  onChange={this.handleChange}
                  rows="6"
                ></Form.Control>
              </div>
              <h5 style={{ fontWeight: "bold" }}>
                Choose a new profile picture
              </h5>
              <Avatar
                label="Choose file"
                width={400}
                height={300}
                onCrop={this.onCrop}
                onClose={this.onClose}
                src={this.state.src}
              />
            </div>
            <div className="col-3 text-center align-self-end mb-5">
              <h5 style={{ fontWeight: "bold" }}>preview</h5>
              <img
                src={this.state.preview}
                alt=""
                width="180px"
                height="180px"
              />
            </div>
          </div>
        ) : (
          ""
        )}

        <SaveChangesModal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          onSubmit={() => this.onSave()}
          heading={"Are you sure you are done?"}
        />
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: "Libre Baskerville , serif",
  margin: "50px 0px 50px 0px",
  textAlign: "center",
};

const descriptionStyle = {
  height: "auto",
  minHeight: "50px",
  maxHeight: "200px",
  width: "400px",
  margin: "30px 0px",
  borderRadius: "8px",
};

export default withRouter(EditProfile);
