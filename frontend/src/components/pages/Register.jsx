import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import FormGroup from 'react-bootstrap/FormGroup';
import Alert from 'react-bootstrap/Alert';
import '../../App.css';

const emailRegex = RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
const usernameRegex = RegExp(/[a-zA-Z0-9.\-_]{3,20}/);

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        email: '',
        password: '',
        name: '',
        surname: '',
      },
      formErrors: {
        username: '',
        email: '',
        password: '',
        password2: '',
        name: '',
        surname: '',
      },

      toggleAlert: false,
      alertContent: '',
    };
  }

  //tests if a form is valid
  validateForm = () => {
    let valid = true;

    //validate form errors being empty
    Object.values(this.state.formErrors).forEach((val) => {
      val.length > 0 && (valid = false);
    });

    //validate if form is filled out
    //make sure no empty can be send if button is pushed
    Object.values(this.state.user).forEach((val) => {
      val.length === 0 && (valid = false);
    });
    return valid;
  };

  // sends state object to REST API
  //if one form is invalid nothing will be send
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validateForm()) {
      let user = this.state.user;
      axios.post('/register', user).then((res) => {
        switch (res.data.statusCode) {
          case 0:
            this.props.history.push('/');
            this.props.showAlert('success', 'You have been registered successfully!');
            break;
          case 1:
            this.setState({
              toggleAlert: true,
              alertContent: 'Username is not available',
            });
            break;
          default:
            this.setState({
              toggleAlert: true,
              alertContent: 'An error occured',
            });
        }
      });

      this.setState({ toggleAlert: false });
    } else {
      this.setState({
        toggleAlert: true,
        alertContent: 'Form is invalid',
      });
    }
  };

  // updates state object when form is changed
  //testing invalid form on specific regulations
  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    const user = { ...this.state.user, [nam]: val };
    this.setState(() => ({ user }));

    let formErrors = this.state.formErrors;

    switch (nam) {
      case 'username':
        formErrors.username = usernameRegex.test(val)
          ? ''
          : 'usernames have to be 3-20 characters ';
        break;

      case 'email':
        formErrors.email = emailRegex.test(val) && val.length > 0 ? '' : 'invalid email';
        break;

      case 'password':
        formErrors.password = val.length >= 6 ? '' : 'passwords needs 6 characters minimum';
        break;

      case 'password2':
        formErrors.password2 = this.state.user.password === val ? '' : 'passwords need to be equal';
        break;

      case 'name':
        formErrors.name = val.length <= 50 && val.length >= 2 ? '' : '2-50 characters allowed';
        break;

      case 'surname':
        formErrors.surname = val.length <= 50 && val.length >= 2 ? '' : '2-50 characters allowed';
        break;
      default:
        break;
    }
    // this.setState({ formErrors, [nam]: val });
    const test = { ...this.state.formErrors, [nam]: val };
    this.setState(() => ({ test }));
  };

  // register form
  render() {
    const { formErrors } = this.state;
    return (
      <div style={bg}>
        <div className='container' style={registerForm}>
          <div style={captionStyle}>Create an account</div>
          <Form onSubmit={this.handleSubmit} id='formFont'>
            <Form.Row>
              <FormGroup as={Col} sm='6'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  className={formErrors.username.length > 0 ? "error" : null}
                  type="text"
                  aria-label="Username"
                  name="username"
                  onChange={this.handleChange}
                />
                <div data-testid="usernameError">
                  {formErrors.username.length > 0 && (
                    <span style={errorMessage}>{formErrors.username}</span>
                  )}
                </div>
              </FormGroup>
              <FormGroup as={Col} sm='6'>
                <Form.Label>E-Mail</Form.Label>
                <Form.Control
                  className={formErrors.email.length > 0 ? "error" : null}
                  type="text"
                  aria-label="E-Mail"
                  name="email"
                  onChange={this.handleChange}
                />
                <div data-testid="emailError">
                  {formErrors.email.length > 0 && (
                    <span style={errorMessage}>{formErrors.email}</span>
                  )}
                </div>
              </FormGroup>
            </Form.Row>
            <Form.Row>
              <FormGroup as={Col} sm='6'>
                <Form.Label>Password</Form.Label>

                <Form.Control
                  className={formErrors.password.length > 0 ? "error" : null}
                  type="password"
                  aria-label="password"
                  name="password"
                  onChange={this.handleChange}
                />

                <div data-testid="passwordError">
                  {formErrors.password.length > 0 && (
                    <span style={errorMessage}>{formErrors.password}</span>
                  )}
                </div>
              </FormGroup>
              <FormGroup as={Col} sm="6">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  className={formErrors.password2.length > 0 ? 'error' : null}
                  type='password'
                  name='password2'
                  onChange={this.handleChange}
                />
                <div>
                  {formErrors.password2.length > 0 && (
                    <span style={errorMessage}>{formErrors.password2}</span>
                  )}
                </div>
              </FormGroup>
            </Form.Row>
            <Form.Row>
              <FormGroup as={Col} sm='6'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  className={formErrors.name.length > 0 ? "error" : null}
                  type="text"
                  aria-label="name"
                  name="name"
                  onChange={this.handleChange}
                />
                <div data-testid="nameError">
                  {formErrors.name.length > 0 && (
                    <span style={errorMessage}>{formErrors.name}</span>
                  )}
                </div>
              </FormGroup>
              <FormGroup as={Col} sm='6'>
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  className={formErrors.surname.length > 0 ? "error" : null}
                  type="text"
                  aria-label="surname"
                  name="surname"
                  onChange={this.handleChange}
                />
                <div data-testid="surnameError">
                  {formErrors.surname.length > 0 && (
                    <span style={errorMessage}>{formErrors.surname}</span>
                  )}
                </div>
              </FormGroup>
            </Form.Row>
            <Form.Group>
              <Form.Check required label='I agree to the Terms And Conditions' />
            </Form.Group>
            <div>
              {this.state.toggleAlert ? (
                <Alert variant='danger'>{this.state.alertContent}</Alert>
              ) : (
                <div />
              )}
              <div className='col py-3 justify-content-between w-100 text-center'>
                <Button variant='outline-own' type='submit' size='lg'>
                  Register
                </Button>
                <NavLink exact id='logRegLink' className='nav-link' to='/'>
                  Already have an account ? Follow me.
                </NavLink>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const registerForm = {
  position: 'absolute',
  minHeight: '550px',
  height: 'auto',
  width: '600px',
  top: '50%',
  left: '50%',
  padding: '30px',
  // half the height and width to center
  marginTop: '-230px',
  marginLeft: '-290px',
  background: '#f1f1f1ec',
  borderRadius: '15px',
  textAlign: 'left',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.1)',
};

const captionStyle = {
  fontFamily: 'Libre Baskerville , serif',
  paddingBottom: '30px',
  fontSize: '34px',
  color: '#4e564b',
};

const errorMessage = {
  color: '#c45c5c',
  textAlign: 'right',
  fontWeight: 'bold',
  fontSize: '0.7em',
};

const bg = {
  backgroundImage: ' url(/images/bg.jpg)',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  height: '100vh',
};

export default withRouter(Register);
