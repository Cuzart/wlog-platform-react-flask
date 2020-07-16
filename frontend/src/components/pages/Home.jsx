import React, { Component } from 'react';
import '../../App.css';
import Login from '../Login';
import Button from 'react-bootstrap/Button';
import InfoContent from '../InfoContent';

class Home extends Component {
  render() {
    return (
      <div>
        <div className='home-bg'>
          <div className='container pt-5'>
            <div
              className='row align-items-center justify-content-around align-self-center py-3'
              style={{ marginTop: '15%' }}
            >
              <div className='col-3 pr-5 mr-5'>
                {!sessionStorage.getItem('authenticated') ? (
                  <Login showAlert={this.props.showAlert} />
                ) : (
                  <div className='ml-5 pl-5'>
                    <Button
                      variant='outline-light'
                      onClick={() => window.$('html, body').animate({ scrollTop: 960 }, '50')}
                    >
                      <span style={{ fontSize: '30px', fontWeight: 'bold' }}>
                        learn
                        <br />
                        <i className='fas fa-chevron-down' style={{ fontSize: '100px' }}></i>
                        <br />
                        more
                      </span>
                    </Button>
                  </div>
                )}
              </div>
              <div className='col-7 ml-5' style={textStyle}>
                A home for <br /> your
                <span style={{ color: '#9EB091' }}> memories </span>
              </div>
            </div>
          </div>
        </div>
        <InfoContent />
      </div>
    );
  }
}

const textStyle = {
  textAlign: 'right',
  fontFamily: 'Libre Baskerville , serif',
  padding: '20px',
  fontSize: '50pt',
  color: 'white',
  textShadow: '2px 2px #000000c0',
};

export default Home;
