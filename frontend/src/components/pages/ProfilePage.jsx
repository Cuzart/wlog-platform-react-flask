import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import TripGrid from "../TripGrid";
//import LeafletMap from "../LeafletMap";
import SaveChangesModal from "../layout/SaveChangesModal";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.id,
      userData: null,
      userImg: "/images/user.svg",
      description: "Introduce yourself to the world ...",
      activeTab: "trips",
      isLoading: true,
      toggleModal: false,
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
  // shows modal for create
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    return (
      <div className="container my-4">
        {/* logged in only features  */}
        {this.state.userId === sessionStorage.getItem("user") ? (
          <div className="row justify-content-end mt-5 mr-4">
            <Button
              variant="outline-success"
              onClick={() => this.toggleModal()}
            >
              Create <i class="fas fa-plus-circle"></i>
            </Button>
            <div className="mx-3">
              <Button
                variant="outline-success"
                onClick={() => this.handleSignOut()}
              >
                Edit <i class="fas fa-user-edit"></i>
              </Button>
            </div>
            <div className="mr-5">
              <Button
                variant="outline-dark"
                onClick={() => this.handleSignOut()}
              >
                Sign Out <i class="fas fa-sign-out-alt"></i>
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
              <div className="col-4 align-self-center">
                <h1 style={headerStyle}>{this.state.userData.username}</h1>
                <h4>
                  {this.state.userData.name + " " + this.state.userData.surname}
                </h4>
                <div className="pt-1">
                  <Button active={true} variant="outline-light">
                    <span role="img" aria-labelledby="Clap">
                      27 Claps 👏🏼
                    </span>
                  </Button>
                </div>
              </div>
              <div className="col-4" style={descriptionStyle}>
                {this.state.description}
              </div>
            </div>
            <div className="pt-1 mt-5">
              <Tabs
                justify="true"
                variant="tabs"
                className="tab"
                activeKey={this.state.activeTab}
                onSelect={(k) => this.setState({ activeTab: k })}
              >
                <Tab eventKey="trips" title="Trips" a>
                  <TripGrid userId={this.state.userId} />
                </Tab>
                <Tab eventKey="posts" title="Posts">
                  {/* <LeafletMap /> */}
                </Tab>
              </Tabs>
            </div>
          </React.Fragment>
        ) : (
          ""
        )}
        <SaveChangesModal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          onSubmit={() => this.handleSubmit()}
          heading={"What do you want to create?"}
        />
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
