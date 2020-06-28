import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class SearchBar extends Component {
  render() {
    return (
      <div>
        <Form>
          <div style={testStyle}>
            <Form.Control
              placeholder="Search for users..."
              name="search"
              type="text"
              onChange={() => this.props.handleChange()}
            />
            <Button variant="dark" onClick={() => this.props.handleSearch()}>
              <i className="fa fa-search"></i>
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

const testStyle = {
  display: "flex",
  flexDirection: "row",
  padding: "50px 200px",
};

export default SearchBar;
