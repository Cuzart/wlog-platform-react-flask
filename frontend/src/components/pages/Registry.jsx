import React from "react";
//import axios from "axios";

class Registry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      name: "",
      surname: "",
      changed: false,
    };
  }

  // sends state object to REST API
  handleSubmit = (event) => {
    event.preventDefault();
    let user = this.state;
    console.log(user);
    //axios.post("api:5000/registry", user).then((res) => console.log(res));
  };

  // updates state object when form is changed
  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
    this.setState({ changed: true });
  };

  // register form
  render() {
    return (
      <div>
        <div>Registry</div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input
              type="text"
              placeholder="E-Mail"
              name="email"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="surname">Surname</label>
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

export default Registry;
