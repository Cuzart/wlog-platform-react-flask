import React from "react";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: "",
      password: "",
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    let login = this.state;
    console.log(login);
    //axios.post("/login", login).then((res) => console.log(res));
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
        <Form onSubmit={this.handleSubmit}>
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
          <div style={btnLayout}>
            <Button variant="dark" type="submit" size="lg" >
              Login
            </Button>
            <NavLink
              exact
              className="nav-link"
              to="/register"
              style={{ color: "#4e564b" }}
            >
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
  textAlign: "center"
};

const btnLayout = {
  textAlign: "center",
  marginBottom : "25px",
  marginTop : "10px",
}

export default Login;
