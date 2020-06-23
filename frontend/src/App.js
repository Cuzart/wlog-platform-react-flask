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
            <Route exact path="/map" component={TripPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
