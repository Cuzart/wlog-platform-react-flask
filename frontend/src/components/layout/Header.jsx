import React from "react";
import { NavLink } from "react-router-dom";
//import styled from "styled-components";
import "../../App.css";

function Header() {
  return (
    <div>
      <header id="navbar">
        <NavLink exact to="/" activeClassName="nav-link-active">
          HOME
        </NavLink>
        <NavLink to="/feed" activeClassName="nav-link-active">
          EXPLORE
        </NavLink>
        <NavLink exact to="/" activeClassName="nav-link-active">
          <img src="/images/wlogLogo.png" alt="logo"></img>
        </NavLink>
        <NavLink
          exact
          className="nav-link"
          activeClassName="nav-link-active"
          to="/registry"
        >
          REGISTRY
        </NavLink>
        <NavLink
          exact
          className="nav-link"
          activeClassName="nav-link-active"
          to="/profile"
        >
          PROFILE
        </NavLink>
      </header>
      <footer style={footerStyle}></footer>
    </div>
  );
}

const footerStyle = {
  position: "fixed",
  left: "0",
  bottom: "0",
  width: "100%",
  height: "40px",
  marginTop: "40px",
  background: "#9EB091",
  textAlign: "center",
};

export default Header;
