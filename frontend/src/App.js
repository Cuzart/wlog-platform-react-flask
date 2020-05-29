import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/layout/Header";
import Registry from "./components/pages/Registry";
import Home from "./components/pages/Home";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/registry" component={Registry} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
