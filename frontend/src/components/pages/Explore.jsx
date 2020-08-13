import React, { Component } from 'react';
import SearchBar from '../SearchBar';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import LeafletMap from '../LeafletMap';
import Spinner from '../layout/Spinner';
import SlickGrid from '../SlickGrid';

export class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pattern: '',
      result: null,
      isLoading: true,
      activePost: { text: '', location_longitude: 0, location_latitude: 0 },
    };
  }

  handleChange = () => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // sends pattern to API to get array of matching users
  handleSearch = () => {
    let pattern = this.state.pattern;
    axios
      .get('/users/search', {
        params: {
          pattern: pattern,
        },
      })
      .then((res) => {
        this.setState({ result: res.data });
      });
  };

  // sets the clicked marker as activePost
  // to open the correct accordion and reset the center point
  handleActiveMarker = (post) => {
    this.setState({ activePost: post });
  };

  // fetches 15 latest posts
  getPostData = () => {
    axios.get('/posts').then((res) => {
      this.setState({
        posts: res.data,
        activePost: res.data[0],
        isLoading: false,
      });
    });
  };

  componentDidMount() {
    this.getPostData();
  }

  render() {
    return (
      <div className='container'>
        <h1 style={headerStyles}> Explore the world </h1>
        <SearchBar
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          search={this.state.search}
        />
        <div className='row justify-content-center'>
          <div className='col-5 align-self-center mb-3'>
            {this.state.result !== null ? (
              this.state.result.length > 0 ? (
                <ListGroup>
                  <ListGroup.Item key='results' variant='secondary'>
                    Search results
                  </ListGroup.Item>
                  {this.state.result.map((user) => {
                    const { id, username } = user;
                    return (
                      <ListGroup.Item
                        action
                        key={id}
                        variant='outline-success'
                        href={'/users/' + id}
                      >
                        <div style={{ fontWeight: 'bold' }} className='row align-content-between'>
                          <div className='col-10'> {username}</div>
                          <div className='col-1 ml-4'>
                            <i className='fas fa-map-pin'></i>
                          </div>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              ) : (
                <ListGroup>
                  <ListGroup.Item key='results' variant='info'>
                    No users for &quot;{this.state.pattern}&quot; found
                  </ListGroup.Item>
                </ListGroup>
              )
            ) : (
              ''
            )}
          </div>
        </div>

        {!this.state.isLoading ? (
          <div>
            <h4 style={caption}>Check out the latest trips</h4>
            <div className='mb-5 pb-5'>
              <SlickGrid />
            </div>
            <h4 style={caption}>Discover our community map</h4>
            <div className='container' style={map}>
              <LeafletMap
                activePost={this.state.activePost}
                posts={this.state.posts}
                isLoading={this.state.isLoading}
                handleActiveMarker={this.handleActiveMarker}
                zoom='2'
                toTrip={true}
              />
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: 'Libre Baskerville , serif',
  margin: '50px 0px 20px 0px',
  textAlign: 'center',
};

const caption = {
  margin: '40px auto',
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: '#4e564b',
  borderRadius: '10px',
  width: '400px',
  padding: '15px',
  color: '#f1f1f1',
};

const map = {
  marginBottom: '80px',
  height: '420px',
  backgroundColor: '#90CCCB',
  padding: '10px',
  borderRadius: '20px',
};

export default Explore;
