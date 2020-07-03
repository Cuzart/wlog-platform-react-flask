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
      visibleSuccessAlert: false
    };
  }

  //shows success alert and dismisses it after 3 seconds, then sends to login 
  onShowAlert = ()=>{
    this.setState({visibleSuccessAlert:true},()=>{
      window.setTimeout(()=>{
        this.setState({visibleSuccessAlert:false});
        this.props.history.push("/profile");
        window.location.reload();
      },3000)
    });
  }

  handleLogin = (event) => {
    event.preventDefault();
    let login = this.state;
    axios.post("/login", login).then((res) => {
      if (res.data.statusCode === 0) {
        this.setState({ toggleAlert: false });
        sessionStorage.setItem("authenticated", true);
        sessionStorage.setItem("user", login.username);
        //this.props.history.push("/profile");
        //window.location.reload();
        this.onShowAlert();
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
      <div className="base-container">
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
              <Alert variant="danger">username or password not correct.</Alert>
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
        <Alert variant="success" style={successAlertStyle}
        show={this.state.visibleSuccessAlert}>You're logged in. Welcome! You'll be forwarded.
        </Alert>
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

const successAlertStyle = {
  textAlign: "center",
  fontWeight: "bold",
  position: "absolute",
  width: "450%",
  top: "-64%",
  left:"-60%"
}

export default withRouter(Login);
