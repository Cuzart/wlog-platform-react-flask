import React from "react";
import { NavLink, withRouter } from "react-router-dom";

import "../../App.css";
import CreateModal from "./CreateModal";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  // toggles create modal
  handleModalToggle = () => {
    this.setState({ showModal: true });
  };

  render() {
    // if path is /add or /create the create link style is active
    // necessary because it doesn't redirect to a path but toggles a modal
    const {
      location: { pathname },
    } = this.props;
    const linkClass = ["/add", "/create"].includes(pathname)
      ? "nav-link-active"
      : "nav-link";

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
              style={{ width: "126px" }}
            ></img>
          </NavLink>
          <div
            id="createLink"
            className={linkClass}
            onClick={() => this.handleModalToggle()}
          >
            CREATE
          </div>
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
              to={"/users/" + sessionStorage.getItem("user")}
            >
              PROFILE
            </NavLink>
          )}
        </header>
        <CreateModal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        />
      </div>
    );
  }
}

export default withRouter(Header);
