import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/layout/Header";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import CreatePost from "./components/pages/CreatePost";
import AddPost from "./components/pages/AddPost";
import TripPage from "./components/pages/TripPage";
import Explore from "./components/pages/Explore";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./components/pages/ProfilePage";
import EditProfile from "./components/pages/EditProfile";
import Alert from "react-bootstrap/Alert";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      variant: "success",
      message: "Test",
    };
  }

  // toggle global alert for 3s
  onShowAlert = (variant, message) => {
    window.scrollTo(0, 0);
    this.setState({
      showAlert: true,
      variant: variant,
      message: message,
    });
    window.setTimeout(() => {
      this.setState({ showAlert: false });
    }, 3000);
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div id="alert">
            <Alert variant={this.state.variant} show={this.state.showAlert}>
              {this.state.message}
            </Alert>
          </div>
          <Switch>
            {/* use render instead of component to pass props */}
            <Route
              exact
              path="/"
              render={() => <Home showAlert={this.onShowAlert} />}
            />
            <Route
              path="/register"
              render={() => <Register showAlert={this.onShowAlert} />}
            />
            <ProtectedRoute
              path="/create"
              component={CreatePost}
              showAlert={this.onShowAlert}
            />
            <ProtectedRoute
              path="/add"
              component={AddPost}
              showAlert={this.onShowAlert}
            />
            <Route path="/explore" component={Explore} />
            <Route path="/trips/:id" component={TripPage} />
            <Route
              path="/users/:id"
              render={() => <ProfilePage showAlert={this.onShowAlert} />}
            />
            <ProtectedRoute
              path="/edit"
              component={EditProfile}
              showAlert={this.onShowAlert}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
