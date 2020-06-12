import React, { Component } from "react";
import TripForm from "../TripForm";
import PostForm from "../PostForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class CreatePost extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div as={Row} className="container" style={formStyle}>
        <Col>
          <TripForm />
          <PostForm heading="add your first blog entry" />
        </Col>
      </div>
    );
  }
}
const formStyle = {
  paddingBottom: "150px",
  paddingTop: "80px",
};

export default CreatePost;
