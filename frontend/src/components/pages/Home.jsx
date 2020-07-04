import React, { Component } from "react";
import "../../App.css";
import Login from "../Login";

class Home extends Component {
  render() {
    return (
      <div>
        <div className="home-bg">
          <div className="container">
            {!sessionStorage.getItem("authenticated") ? (
              <div style={loginForm}>
                <Login />
              </div>
            ) : (
              <div style={imgContainer}>
                <img src="/images/globeIllustration.svg" alt="" width="130%" />
              </div>
            )}
          </div>
          <div style={textStyle}>
            A home for <br /> your{" "}
            <span style={{ color: "#9EB091" }}> memories </span>
          </div>
        </div>
        <div style={barStyle}>
          <img src="/images/bar.svg" alt="" />
        </div>
        <div className="App" height="500px"></div>
      </div>
    );
  }
}

const loginForm = {
  position: "absolute",
  height: "auto",
  width: "340px",
  top: "43%",
  background: "#9EB091",
  borderRadius: "50px",
  textAlign: "left",
};

const imgContainer = {
  position: "absolute",
  height: "auto",
  width: "340px",
  top: "120%",

  borderRadius: "50px",
};

const textStyle = {
  position: "absolute",
  textAlign: "right",
  top: "45%",
  left: "50%",
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
