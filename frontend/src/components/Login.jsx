import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import "./../App.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      toggleAlert: false,
    };
  }

  // requests if credentials are registered
  handleLogin = (event) => {
    event.preventDefault();
    let login = this.state;
    axios.post("/login", login).then((res) => {
      // if yes a session storage is set and user will be redirected
      if (res.data.statusCode === 0) {
        sessionStorage.setItem("authenticated", true);
        sessionStorage.setItem("user", res.data.user_id);
        this.props.history.push("/users/" + res.data.user_id);
        window.location.reload();
        //otherwise there will be an error message
      } else {
        this.setState({ toggleAlert: true });
      }
    });
  };

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    return (
      <div className="container">
        <div style={captionStyle}>login</div>
        <Form onSubmit={this.handleLogin}>
          <FormGroup as={Row}>
            <Form.Label column sm={3}>
              Username
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                name="username"
                type="text"
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup as={Row}>
            <Form.Label column sm={3}>
              Password
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                name="password"
                type="password"
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
          {this.state.toggleAlert ? (
            <Alert variant="danger">Check your username or password.</Alert>
          ) : (
            <div />
          )}
          <div style={btnLayout}>
            <Button variant="dark" type="submit" size="lg">
              Login
            </Button>
            <br />
            <NavLink exact id="logRegLink" className="nav-link" to="/register">
              New here ? Register Now
            </NavLink>
          </div>
        </Form>
      </div>
    );
  }
}

const captionStyle = {
  fontFamily: "Libre Baskerville , serif",
  padding: "20px",
  fontSize: "34px",
  color: "#4e564b",
  textAlign: "center",
};

const btnLayout = {
  textAlign: "center",
  marginBottom: "25px",
  marginTop: "10px",
};

export default withRouter(Login);
