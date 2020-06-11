import React from "react";
import axios from "axios";
import "../../App.css";

const emailRegex = RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/);
const usernameRegex = RegExp(/[a-zA-Z0-9.\-_]{3,20}/);

//tests if a form is valid
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  //validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  //validate if form is filled out
  //make sure no empty can be send if button is pushed
  Object.values(rest).forEach((val) => {
    val.length === 0 && (valid = false);
  });

  return valid;
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      name: "",
      surname: "",
      formErrors: {
        username: "",
        email: "",
        password: "",
        name: "",
        surname: "",
      },
    };
  }

  // sends state object to REST API
  //if one form is invalid nothing will be send
  handleSubmit = (event) => {
    event.preventDefault();

    //this.state.formErrors
    if (formValid(this.state)) {
      let user = this.state;
      //console.log(`${this.state.username}`);
      console.log("test");
      console.log(user);
      axios.post("/register", user).then((res) => console.log(res));
    } else {
      console.error("form invalid");
    }
  };

  // updates state object when form is changed
  //testing invalid form on specific regulations
  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });

    let formErrors = this.state.formErrors;

    switch (nam) {
      case "username":
        formErrors.username = usernameRegex.test(val)
          ? ""
          : "usernames have to be 3-20 characters ";
        break;

      case "email":
        formErrors.email =
          emailRegex.test(val) && val.length > 0 ? "" : "invalid email";
        break;

      case "password":
        formErrors.password =
          val.length > 6 ? "" : "passwords needs 6 characters minimum";
        break;

      case "name":
        formErrors.name =
          val.length <= 50 && val.length >= 2 ? "" : "2-50 characters allowed";
        break;

      case "surname":
        formErrors.surname =
          val.length <= 50 && val.length >= 2 ? "" : "2-50 characters allowed";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [nam]: val }, () => console.log(this.state));
  };

  // register form
  render() {
    const { formErrors } = this.state;
    return (
      <div style={registerForm}>
        <div style={captionStyle}>Register</div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              className={formErrors.username.length > 0 ? "error" : null}
              type="text"
              placeholder="username"
              name="username"
              onChange={this.handleChange}
            />
            <div>
              {formErrors.username.length > 0 && (
                <span style={errorMessage}>{formErrors.username}</span>
              )}
            </div>
          </div>
          <div />
          <div>
            <input
              className={formErrors.email.length > 0 ? "error" : null}
              type="text"
              placeholder="e-mail"
              name="email"
              onChange={this.handleChange}
            />
            <div>
              {formErrors.email.length > 0 && (
                <span style={errorMessage}>{formErrors.email}</span>
              )}
            </div>
          </div>
          <div>
            <input
              className={formErrors.password.length > 0 ? "error" : null}
              type="password"
              placeholder="password"
              name="password"
              onChange={this.handleChange}
            />
            <div>
              {formErrors.password.length > 0 && (
                <span style={errorMessage}>{formErrors.password}</span>
              )}
            </div>
          </div>
          <div>
            <input
              className={formErrors.name.length > 0 ? "error" : null}
              type="text"
              placeholder="name"
              name="name"
              onChange={this.handleChange}
            />
            <div>
              {formErrors.name.length > 0 && (
                <span style={errorMessage}>{formErrors.name}</span>
              )}
            </div>
          </div>
          <div>
            <input
              className={formErrors.surname.length > 0 ? "error" : null}
              type="text"
              placeholder="surname"
              name="surname"
              onChange={this.handleChange}
            />
            <div>
              {formErrors.surname.length > 0 && (
                <span style={errorMessage}>{formErrors.surname}</span>
              )}
            </div>
          </div>
          <div>
            <button type="submit"> Register</button>
          </div>
        </form>
      </div>
    );
  }
}

const registerForm = {
  position: "fixed",
  height: "350px",
  width: "275px",
  top: "50%",
  left: "50%",
  // half the height and width to center
  marginTop: "-175px",
  marginLeft: "-138px",
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

const errorMessage = {
  color: "#c45c5c",
  fontFamily: "Segoe UI , serif",
  fontWeight: "bold",
  fontSize: "0.7em",
  display: "relative",
};

export default Register;
