import React, { Component } from "react";
import SearchBar from "../SearchBar";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";

export class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pattern: "",
      result: [],
    };
  }

  handleChange = () => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // sends pattern to API to get array of matching users
  handleSearch = () => {
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

  // fetches 15 latest posts
  // getPostData = () => {
  //   axios.get("/posts").then((res) => {
  //     this.setState({
  //       posts: res.data,
  //       activePost: res.data[0],
  //       isLoading: false,
  //     });
  //   });
  // };

  render() {
    return (
      <div className="container">
        <h1 style={headerStyles}> Explore the world </h1>
        <SearchBar
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          search={this.state.search}
        />
        <div className="row justify-content-center">
          <div className="col-5 align-self-center">
            {this.state.result.length > 0 ? (
              <ListGroup>
                <ListGroup.Item key="results" variant="secondary">
                  Search results
                </ListGroup.Item>
                {this.state.result.map((user) => {
                  const { id, username } = user;
                  return (
                    <ListGroup.Item
                      key={id}
                      action
                      onClick={() => console.log(user)}
                      variant="outline-success"
                      href={"/users/" + id}
                    >
                      <div
                        style={{ fontWeight: "bold" }}
                        className="row align-content-between"
                      >
                        <div className="col-10"> {username}</div>
                        <div className="col-1 ml-4">
                          <i className="fas fa-map-pin"></i>
                        </div>
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* <div className="container-fluid" style={map}>
          <LeafletMap
            activePost={this.state.activePost}
            posts={this.state.posts}
            isLoading={this.state.isLoading}
            handleActiveMarker={this.handleActiveMarker}
            zoom="2"
            toTrip={true}
          />
        </div> */}
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: "Libre Baskerville , serif",
  margin: "50px 0px 20px 0px",
  textAlign: "center",
};

// const map = {
//   marginBottom: "80px",
//   height: "400px",
//   backgroundColor: "white",
//   padding: "40px",
//   borderRadius: "0px 0px 20px 20px",
// };

export default Explore;
