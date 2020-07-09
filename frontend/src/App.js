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

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/register" component={Register} />
            <ProtectedRoute path="/create" component={CreatePost} />
            <ProtectedRoute path="/add" component={AddPost} />
            <Route path="/trips/:id" component={TripPage} />
            <Route path="/users/:id" component={ProfilePage} />
            <ProtectedRoute path="/edit" component={EditProfile} />
          </Switch>
        </div>
        {/* custom styling for bs-buttons */}
        <style>
          {`
            .btn-outline-own {
              color: #4e564b;
              border-color: #4e564b;
              border-width: medium;
              font-weight: bold;
            }
            .btn-outline-own:hover {
              color: white;
              background-color:  #4e564b;
            }
            
            .btn-outline-ownLight {
              color: #20752f;
              border-color: #20752f;
              font-weight: bold;
              border-width: medium;
            }
            .btn-outline-ownLight:hover {
              color: white;
              background-color:  #20752f;
            }
            .btn.btn-ownLight:active {
              color: white;
              background-color: #20752f; 
            }
          `}
        </style>
      </Router>
    );
  }
}

export default App;
