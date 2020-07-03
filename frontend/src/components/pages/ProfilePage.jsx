import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import TripGrid from "../TripGrid";
import Button from "react-bootstrap/Button";

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.id,
      userData: null,
      isLoading: true,
      userImg: "/images/user.svg",
      description: "Introduce yourself to the world ...",
    };
  }

  // fetching all trips of current user
  getTripData() {
    axios
      .get("/users/" + this.state.userId)
      .then((res) => {
        console.log(res.data);
        this.setState({
          userData: res.data,
          isLoading: false,
        });
        if (res.data.profilepicture !== null) {
          this.setState({ userImg: res.data.profilepicture });
        }
        if (res.data.description !== null) {
          this.setState({ description: res.data.description });
        }
      })

      .catch((error) => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.getTripData();
  }

  // requests sign out, clears session storage and redirect
  handleSignOut = () => {
    axios.get("/logout").then((res) => {
      sessionStorage.clear();
      if (res.data.statusCode === 0) {
        this.props.history.push("/");
        //success TODO
      }
    });
  };

  render() {
    return (
      <div className="container my-4">
        {/* logged in only features  */}
        {this.state.userId === sessionStorage.getItem("user") ? (
          <div className="row justify-content-end mt-5">
            <div className="col-1">
              <Button
                variant="outline-success"
                onClick={() => this.handleSignOut()}
              >
                Edit
              </Button>
            </div>
            <div className="col-2">
              <Button
                variant="outline-success"
                onClick={() => this.handleSignOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}

        {!this.state.isLoading ? (
          <React.Fragment>
            <div className="row align-items-center">
              <div className="col-3">
                <img src={this.state.userImg} alt="User" style={pictureStyle} />
              </div>
              <div className="col-3 align-self-center">
                <h1 style={headerStyle}>{this.state.userData.username}</h1>
                <h4>
                  {this.state.userData.name + " " + this.state.userData.surname}
                </h4>
              </div>
              <div className="col-5" style={descriptionStyle}>
                {this.state.description}
              </div>
            </div>
            <TripGrid userId={this.state.userId} />
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const headerStyle = {
  fontFamily: "Libre Baskerville , serif",
  margin: "20px 0px",
};

const pictureStyle = {
  borderRadius: "50%",
  height: "180px",
  width: "180px",
  margin: "50px",
};

const descriptionStyle = {
  height: "auto",
  minHeight: "50px",
  maxHeight: "200px",
  width: "400px",
  padding: "30px",

  backgroundColor: "white",
  borderRadius: "8px",
};

export default withRouter(ProfilePage);
