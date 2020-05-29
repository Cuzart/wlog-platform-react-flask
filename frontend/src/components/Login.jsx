import React from "react";
import axios from "axios";

export class Login extends React.Component {
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
      <div style={loginForm}>
        <div style={captionStyle}>login</div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input type="text" name="username" placeholder="username" />
          </div>
          <div>
            <input type="password" name="password" placeholder="password" />
          </div>
          <div>
            <button type="button" className="btn">
              Login
            </button>
          </div>
        </form>
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
  marginTop: "275px",
  marginLeft: "155px",
  background: "#9EB091",
  borderRadius: "8%",
  textAlign: "center",
};

export default Login;
