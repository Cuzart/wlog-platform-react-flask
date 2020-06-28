import React, { Component } from "react";
import SearchBar from "../SearchBar";

export class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  handleChange = (event) => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };
  handleSearch = () => {
    console.log(this.state.search);
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
