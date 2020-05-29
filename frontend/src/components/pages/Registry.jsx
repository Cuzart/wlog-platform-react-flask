import React from "react";
import axios from "axios";

class Registry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      name: "",
      surname: "",
    };
  }

  // sends state object to REST API
  handleSubmit = (event) => {
    event.preventDefault();
    let user = this.state;
    console.log(user);
    axios.post("/registry", user).then((res) => console.log(res));
  };

  // updates state object when form is changed
  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  // register form
  render() {
    return (
      <div style={registryForm}>
        <div style={captionStyle}>Registry</div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="E-Mail"
              name="email"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Surname"
              name="surname"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <button type="submit"> Register</button>
          </div>
        </form>
      </div>
    );
  }
}

const registryForm = {
  position: "fixed",
  height: "300px",
  width: "225px",
  top: "50%",
  left: "50%",
  // half the height and width to center
  marginTop: "-150px",
  marginLeft: "-112px",
  background: "#9EB091",
  borderRadius: "8%",
  textAlign: "center",
};
const captionStyle = {
  fontFamily: "Libre Baskerville , serif",
  padding: "20px",
  fontSize: "x-large",
  color: "#4e564b",
};

export default Registry;
