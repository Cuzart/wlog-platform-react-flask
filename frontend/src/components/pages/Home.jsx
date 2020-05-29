import React, { Component } from "react";
import "../../App.css";
import Login from "../Login";

class Home extends Component {
  render() {
    return (
      <div>
        <div className="home-bg">
          <Login />;
        </div>
      </div>
    );
  }
}

export default Home;
