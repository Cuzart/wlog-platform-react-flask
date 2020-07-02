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
import TripGrid from "./components/TripGrid";
import Explore from "./components/pages/Explore";
import ProtectedRoute from "./components/ProtectedRoute";

const Authentification = {
  isAuthenticated: false,
  authenticate(id) {
    this.isAuthenticated = true;
    sessionStorage.setItem("authenticated", true);
    sessionStorage.setItem("user", id);
  },
  signout() {
    sessionStorage.removeItem("authenticated");
  },
  getAuth() {
    return sessionStorage.getItem("authenticated");
  },
};

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <ProtectedRoute path="/create" component={CreatePost} />
            <ProtectedRoute path="/add" component={AddPost} />
            <Route path="/trip/:id" component={TripPage} />
            <Route path="/profile/:id" component={TripGrid} />
            <Route path="/explore" component={Explore} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
