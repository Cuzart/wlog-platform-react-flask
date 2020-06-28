import React from "react";
import { NavLink } from "react-router-dom";
import "../../App.css";

function Header() {
  return (
    <div>
      <header id="navbar">
        <NavLink
          exact
          to="/"
          className="nav-link"
          activeClassName="nav-link-active"
        >
          HOME
        </NavLink>
        <NavLink
          to="/explore"
          className="nav-link"
          activeClassName="nav-link-active"
        >
          EXPLORE
        </NavLink>
        <NavLink
          exact
          to="/"
          className="nav-link"
          activeClassName="nav-link-active"
        >
          <img
            src="/images/wlogLogo.svg"
            alt="Link to wlog home"
            style={{ width: "50%" }}
          ></img>
        </NavLink>
        <NavLink
          exact
          className="nav-link"
          activeClassName="nav-link-active"
          to="/create"
        >
          CREATE
        </NavLink>
        {!sessionStorage.getItem("authenticated") ? (
          <NavLink
            exact
            className="nav-link"
            activeClassName="nav-link-active"
            to="/register"
          >
            REGISTER
          </NavLink>
        ) : (
          <NavLink
            exact
            className="nav-link"
            activeClassName="nav-link-active"
            to="/profile"
          >
            PROFILE
          </NavLink>
        )}
      </header>
      <footer style={footerStyle}></footer>
    </div>
  );
}

let footerStyle = {
  visibility: "hidden",
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
