import React, { Component } from "react";
import "../../App.css";
import Login from "../Login";

class Home extends Component {
  render() {
    return (
      <div>
        <div className="home-bg">
          <div className="container pt-5">
            <div
              className="row align-items-center justify-content-around align-self-center py-3"
              style={{ marginTop: "15%" }}
            >
              <div className="col-3 pr-5 mr-5">
                {!sessionStorage.getItem("authenticated") ? <Login /> : ""}
              </div>
              <div className="col-7 ml-5" style={textStyle}>
                A home for <br /> your
                <span style={{ color: "#9EB091" }}> memories </span>
              </div>
            </div>
          </div>
        </div>
        <div style={barStyle}>
          <img src="/images/bar.svg" alt="" />
          <div style={imgContainer}>
            <img src="/images/globeIllustration.svg" alt="" width="130%" />
          </div>
        </div>
        <div className="App" height="500px"></div>
      </div>
    );
  }
}

const imgContainer = {
  position: "absolute",
  height: "auto",
  width: "340px",
  borderRadius: "50px",
};

const textStyle = {
  textAlign: "right",
  fontFamily: "Libre Baskerville , serif",
  padding: "20px",
  fontSize: "50pt",
  color: "white",
  textShadow: "2px 2px #000000c0",
};

const barStyle = {
  position: "grid",
  marginTop: "-300px",
  bottom: "-200px",
};

export default Home;
