import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/layout/Header";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import PostForm from "./components/PostForm";
import TripForm from "./components/TripForm";
import CreatePost from "./components/pages/CreatePost";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/editor" component={PostForm} />
            <Route exact path="/blog" component={TripForm} />
            <Route exact path="/create" component={CreatePost} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
