import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

class TripForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        title: "",
        country: "",
        description: "",
      },
      tripErrors: {
        titleError: "",
        countryError: "",
        descriptionError: "",
      },
    };
  }

  validateInput = () => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    const data = { ...this.state.data, [nam]: val };
    this.setState(() => ({ data }));
    let tripErrors = this.state.tripErrors;
    switch (nam) {
      case "title":
        tripErrors.titleError = val.length > 0 ? "" : "required";
        break;
      case "country":
        tripErrors.countryError = val.length > 0 ? "" : "required";
        break;
      case "description":
        tripErrors.descriptionError = val.length > 0 ? "" : "required";
        break;
      default:
        break;
    }
  };
  render() {
    const { tripErrors } = this.state;
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
                  className={tripErrors.titleError.length > 0 ? "error" : null}
                  name="title"
                  type="text"
                  onChange={(e) => {
                    this.props.handleChange(e);
                    this.validateInput();
                  }}
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
                  className={
                    tripErrors.countryError.length > 0 ? "error" : null
                  }
                  name="country"
                  onChange={(e) => {
                    this.props.handleChange(e);
                    this.validateInput();
                  }}
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
                  className={
                    tripErrors.descriptionError.length > 0 ? "error" : null
                  }
                  as="textarea"
                  name="description"
                  onChange={(e) => {
                    this.props.handleChange(e);
                    this.validateInput();
                  }}
                  rows="3"
                />
              </Col>
            </FormGroup>
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

export default TripForm;
