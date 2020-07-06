import React, { Component } from "react";
import SearchBar from "../SearchBar";
import axios from "axios";
import uuid from "uuid";
import ListGroup from "react-bootstrap/ListGroup";

export class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pattern: "",
      result: [],
    };
  }

  handleChange = (event) => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // sends pattern to API to get array of matching users
  handleSearch = (event) => {
    let pattern = this.state.pattern;
    axios
      .get("/users/search", {
        params: {
          pattern: pattern,
        },
      })
      .then((res) => {
        this.setState({ result: res.data });
      });
  };

  render() {
    return (
      <div className="container">
        <h1 style={headerStyles}> Explore the world </h1>
        <SearchBar
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          search={this.state.search}
        />
        {this.state.result.length > 0 ? (
          <div className="container  align-self-center">
            <ListGroup>
              {this.state.result.map((user) => {
                const { id, username } = user;
                return (
                  <ListGroup.Item
                    key={uuid.v4}
                    action
                    onClick={() => console.log(user)}
                    variant="outline-success"
                    href={"/users/" + id}
                  >
                    {username}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: "Libre Baskerville , serif",
  margin: "50px 0px 20px 0px",
  textAlign: "center",
};

export default Explore;
