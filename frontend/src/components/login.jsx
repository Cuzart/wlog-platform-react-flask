import React from "react";

export class Login extends React.Component {
  render() {
    return (
      <div>
        <div>Login</div>
        <div>
          <div>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" name="username" placeholder="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" />
            </div>
          </div>
        </div>
        <div>
          <button type="button" className="btn">
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
