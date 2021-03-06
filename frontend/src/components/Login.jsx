import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormGroup from 'react-bootstrap/FormGroup';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import './../App.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      toggleAlert: false,
    };
  }

  // requests login at API and sets sessionStorage
  handleLogin = (event) => {
    event.preventDefault();
    let login = this.state;
    axios.post('/login', login).then((res) => {
      // if yes a session storage is set and user will be redirected
      if (res.data.statusCode === 0) {
        this.setState({ toggleAlert: false });
        sessionStorage.setItem('authenticated', true);
        sessionStorage.setItem('user', res.data.user_id);
        this.props.history.push('/users/' + res.data.user_id);
        this.props.showAlert('success', 'Welcome you have successfully logged in! ');
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
      <div>
        <div style={loginForm}>
          <div style={alertStyle}></div>
          <div className='container'>
            <div style={captionStyle}>login</div>
            <Form onSubmit={this.handleLogin} id='formFont'>
              <FormGroup as={Row}>
                <Form.Label column sm={3}>
                  Username
                </Form.Label>
                <Col sm={9}>
                  <Form.Control name='username' type='text' onChange={this.handleChange} />
                </Col>
              </FormGroup>
              <FormGroup as={Row}>
                <Form.Label column sm={3}>
                  Password
                </Form.Label>
                <Col sm={9}>
                  <Form.Control name='password' type='password' onChange={this.handleChange} />
                </Col>
              </FormGroup>

              <Alert variant='danger' style={{ textAlign: 'center' }} show={this.state.toggleAlert}>
                Check your username or password.
              </Alert>

              <div style={btnLayout}>
                <Button variant='outline-own' type='submit' size='lg'>
                  Login
                </Button>
                <br />
                <NavLink exact id='logRegLink' className='nav-link' to='/register'>
                  New here ? Register Now
                </NavLink>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const captionStyle = {
  fontFamily: 'Libre Baskerville , serif',
  padding: '20px',
  fontSize: '34px',
  color: '#4e564b',
  textAlign: 'center',
};

const btnLayout = {
  textAlign: 'center',
  marginBottom: '25px',
  marginTop: '10px',
};
const loginForm = {
  height: 'auto',
  width: '340px',
  background: '#9EB091',
  borderRadius: '50px',
  textAlign: 'left',
  padding: '5px',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.1)',
};

const alertStyle = {
  position: 'absolute',
  height: '50px',
  width: '400px',
  alignContent: 'center',
};

export default withRouter(Login);
