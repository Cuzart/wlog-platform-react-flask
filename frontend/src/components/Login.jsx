import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import axios from "axios";

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
    axios.post("/login", login).then((res) => console.log(res));
  };

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    return (
      <div style={loginForm}>
        <div style={captionStyle}>login</div>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button variant="dark" type="submit">
            Login
          </Button>
        </Form>
      </div>
    );
  }
}

const captionStyle = {
  fontFamily: "Libre Baskerville , serif",
  padding: "20px",
  fontSize: "x-large",
  color: "#4e564b",
};
const loginForm = {
  position: "absolute",
  height: "300px",
  width: "225px",
  marginTop: "175px",
  marginLeft: "155px",
  background: "#9EB091",
  borderRadius: "8%",
  textAlign: "center",
};

export default Login;
