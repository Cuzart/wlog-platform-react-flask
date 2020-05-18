import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Registry from "./components/pages/Registry";
import "./App.css";
import Login from "./components/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Header />
            <Route exact path="/" component={Login} />
            <Route path="/registry" component={Registry} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
