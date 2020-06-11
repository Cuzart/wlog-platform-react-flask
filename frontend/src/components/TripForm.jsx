import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import axios from "axios";

class TripForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      thumbnail: null,
      country: "",
      description: "",
    };
  }

  // updates thumbnail in state when new file is selected
  handleFileSelect = (event) => {
    this.setState({
      thumbnail: event.target.files[0],
    });
    // document
    //   .getElementById("frame")
    //   .setAttribute("src", URL.createObjectURL(event.target.files[0]));
  };

  // File Upload
  handleFileUpload = (event) => {
    const fd = new FormData();
    fd.append("image", this.state.thumbnail, this.state.thumbnail.name);
    axios.post("url", fd).then((res) => {
      console.log(res);
    });
  };

  // Updates state when form is changed
  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };
  //Submitting the Form
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.thumbnail);
  };

  render() {
    return (
      <div>
        <div className="container">
          <h1 style={headerStyles}> Create an individual trip </h1> <br />
          <Form onSubmit={this.handleSubmit}>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Title
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  name="title"
                  type="text"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Thumbnail
              </Form.Label>
              <Col sm={5}>
                <Form.File
                  accept="image/png, image/jpeg"
                  onChange={this.handleFileSelect}
                  label="4:3 format"
                  custom
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Country
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  name="country"
                  onChange={this.handleChange}
                  type="text"
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row} style={{ paddingBottom: "40px" }}>
              <Form.Label column sm={1}>
                Description
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  as="textarea"
                  name="description"
                  onChange={this.handleChange}
                  rows="3"
                />
              </Col>
            </FormGroup>
            <Button variant="dark" type="submit">
              Test Image Upload
            </Button>
            <hr />
          </Form>
        </div>
        {/* <Col>
          <img
            style={previewStyle}
            id="frame"
            alt="thumbnail-preview"
            src=""
            width="400px"
            height="300px"
          />
        </Col> */}
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: "Libre Baskerville , serif",
  margin: "35px 0px",
};
// const previewStyle = {
//   visibility: "hidden",
//   padding: "50px",
//   left: "60%",
//   marginTop: "340px",
// };

export default TripForm;
