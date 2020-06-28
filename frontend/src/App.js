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

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/create" component={CreatePost} />
            <Route exact path="/add" component={AddPost} />
            <Route exact path="/trip/:id" component={TripPage} />
            <Route exact path="/profile/:id" component={TripGrid} />
            <Route exact path="/explore" component={Explore} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
