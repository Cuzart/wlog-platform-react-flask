import React, { Component } from "react";
import Avatar from "react-avatar-edit";
import Button from "react-bootstrap/Button";
import axios from "axios";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
      src: null,
    };
  }
  onClose = () => {
    this.setState({ preview: null });
  };

  onCrop = (preview) => {
    this.setState({ preview });
  };

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
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

  onSave = () => {
    const fd = new FormData();
    let blob = this.dataURItoBlob(this.state.preview);
    var file = new File([blob], "preview.png", { type: "image/png" });
    fd.append("profileImg", file);
    console.log(file);
    axios.post("/images", fd).then((res) => {
      console.log(res.data);
    });
  };

  render() {
    return (
      <div>
        <div className="container">
          <h1 style={headerStyles}> Edit your profile </h1>
          <div className="row justify-content-around align-items-center">
            <Avatar
              width={390}
              height={295}
              onCrop={this.onCrop}
              onClose={this.onClose}
              src={this.state.src}
            />
            <img src={this.state.preview} alt="" width="180px" height="180px" />
          </div>
        </div>
        <Button variant="outline-dark" onClick={this.onSave}>
          Test
        </Button>
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: "Libre Baskerville , serif",
  margin: "50px 0px 50px 0px",
  textAlign: "center",
};

export default EditProfile;
