import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import axios from "axios";


class TripForm extends Component {
  // File Upload as Form Data to DB
  handleFileUpload = (event) => {
    const fd = new FormData();
    fd.append("thumbnail", this.state.thumbnail);
    axios.post("/upload", fd).then((res) => {
      console.log(res);
    });
  };

  render() {
    return (
      <div>
        <div className="container">
          <h1 style={headerStyles}> Create an individual trip </h1> <br />
          <Form>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Title
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  name="title"
                  type="text"
                  onChange={this.props.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Thumbnail
              </Form.Label>
              <Col sm={5}>
                <Form.File
                  id="formfile"
                  accept="image/png, image/jpeg"
                  onChange={this.props.handleFileSelect}
                  label={this.props.fileFormLabel}
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
                  onChange={this.props.handleChange}
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
                  onChange={this.props.handleChange}
                  rows="3"
                />
              </Col>
            </FormGroup>
            <hr style={hrStyle} />
          </Form>
        </div>
      </div>
    );
  }
}
const headerStyles = {
  fontFamily: "Libre Baskerville , serif",
  margin: "35px 0px",
};

const hrStyle = {
  margin: "60px 0px",
};


export default TripForm;
