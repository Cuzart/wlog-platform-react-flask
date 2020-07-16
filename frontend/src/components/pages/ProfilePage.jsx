import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import TripGrid from '../TripGrid';
import LeafletMap from '../LeafletMap';
import CreateModal from '../layout/CreateModal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.id,
      userData: null,
      userImg: '/images/user.svg',
      description: 'Introduce yourself to the world ...',
      posts: [],
      activeTab: 'trips',
      isLoading: true,
      toggleModal: false,
      activePost: { text: '', location_longitude: 0, location_latitude: 0 },
      claps: '',
    };
  }

  componentDidMount() {
    this.getUserData();
  }
  // fetching data of current user
  getUserData() {
    axios
      .get('/users/' + this.state.userId)
      .then((res) => {
        this.setState({
          userData: res.data,
        });

        // check if a pic / description exist otherwise set default
        if (res.data.profilepicture !== null) {
          this.setState({ userImg: res.data.profilepicture });
        }
        if (res.data.description !== null) {
          this.setState({ description: res.data.description });
        }

        // fetch all claps of user
        axios.get('/users/' + this.state.userId + '/claps').then((res) => {
          this.setState({ claps: res.data.claps });
        });

        // then fetch all the posts
        axios.get('/users/' + this.state.userId + '/posts').then((res) => {
          this.setState({
            posts: res.data,
            activePost: res.data[0],
            isLoading: false,
          });
        });
      })

      .catch(() => this.setState({ isLoading: false }));
  }

  // requests sign out, clears session storage and redirect
  handleSignOut = () => {
    axios.get('/logout').then((res) => {
      sessionStorage.clear();
      if (res.data.statusCode === 0) {
        this.props.history.push('/');
        this.props.showAlert('success', 'Successfully signed out. See you soon!');
      }
    });
  };

  // recenters map to active marker
  handleActiveMarker = (post) => {
    this.setState({ activePost: post });
  };

  // shows modal for create
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    return (
      <div className='container my-4'>
        {/* logged in only profile actions */}
        {this.state.userId === sessionStorage.getItem('user') ? (
          <div className='row justify-content-end mt-5 mr-2' style={{ paddingBottom: '-30px' }}>
            <Button variant='outline-ownLight' onClick={() => this.toggleModal()}>
              Create <i className='fas fa-plus-circle'></i>
            </Button>
            <div className='mx-3'>
              <Button
                variant='outline-ownLight'
                onClick={() => {
                  this.props.history.push('/edit');
                  window.location.reload();
                }}
              >
                Edit <i className='fas fa-user-edit'></i>
              </Button>
            </div>
            <div className='mr-5'>
              <Button variant='outline-own' onClick={() => this.handleSignOut()}>
                Sign Out <i className='fas fa-sign-out-alt'></i>
              </Button>
            </div>
          </div>
        ) : (
          ''
        )}

        {!this.state.isLoading ? (
          <React.Fragment>
            <div className='row align-items-center'>
              <div className='col-3 ml-4'>
                <img src={this.state.userImg} alt='User' style={pictureStyle} />
              </div>
              <div className='col-4 align-self-center '>
                <h1 style={headerStyle}> {this.state.userData.username}</h1>
                <h4>{this.state.userData.name + ' ' + this.state.userData.surname}</h4>
                <div className='pt-1'>
                  <Button
                    disabled='true'
                    active='true'
                    variant='dark'
                    onClick={() => console.log(this.state.claps)}
                  >
                    <span role='img' aria-labelledby='Clap'>
                      {this.state.claps} Claps 👏🏼
                    </span>
                  </Button>
                </div>
              </div>
              <div className='col-4' style={descriptionStyle}>
                {this.state.description}
              </div>
            </div>
            <div className='pt-1 mt-5'>
              <Tabs
                mountOnEnter={true}
                fill={true}
                variant='tabs'
                className='tab'
                activeKey={this.state.activeTab}
                onSelect={(k) => this.setState({ activeTab: k })}
              >
                <Tab eventKey='trips' title='Trips'>
                  <TripGrid userId={this.state.userId} />
                </Tab>
                <Tab eventKey='posts' title='Posts'>
                  <div style={profileMap}>
                    {this.state.posts.length > 0 ? (
                      <LeafletMap
                        activePost={this.state.activePost}
                        posts={this.state.posts}
                        isLoading={this.state.isLoading}
                        handleActiveMarker={this.handleActiveMarker}
                        zoom='2'
                        toTrip={true}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
        <CreateModal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        />
      </div>
    );
  }
}

const headerStyle = {
  fontFamily: 'Libre Baskerville , serif',
  margin: '20px 0px',
};

const pictureStyle = {
  borderRadius: '50%',
  height: '200px',
  width: '200px',
  margin: '50px',
  border: '10px solid #ddd',
};

const descriptionStyle = {
  height: 'auto',
  minHeight: '50px',
  maxHeight: '200px',
  width: '400px',
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '8px',
};

const profileMap = {
  marginBottom: '80px',
  minHeight: '200px',
  height: 'auto',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '0px 0px 20px 20px',
};

export default withRouter(ProfilePage);
