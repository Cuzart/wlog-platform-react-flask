import React, { Component } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { withRouter } from 'react-router-dom';
import SaveChangesModal from '../layout/SaveChangesModal';
import PostForm from '../PostForm';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Spinner from '../Spinner';

export class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
      location: '',
      locationObject: { label: '' },
      tripId: '',
      showModal: false,
      toggleAlert: false,
      trips: [],
      isLoading: true,
    };
  }

  // fetching all trips of current user
  getTripData() {
    axios
      .get('/users/' + sessionStorage.getItem('user') + '/trips')
      .then((res) => {
        this.setState({
          trips: res.data,
          isLoading: false,
          tripId: res.data[0].id,
        });
      })

      .catch(() => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.getTripData();
  }

  // Updates state when form is changed
  handleChange = () => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    this.setState({ [nam]: val });
  };

  // leaflet-geosearch asynchronous API call to get a result{x: longitude, y: latitude, label: adress}
  handleLocationApi = async () => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: this.state.location });
    if (results.length > 0) {
      this.setState({ locationObject: results[0] });
    }
  };

  // adds a post to a existing trip
  handleSubmit = () => {
    this.setState({ showModal: false });
    // calls for each image in active editor /uploadImg
    window.tinymce.activeEditor.uploadImages(() => {
      let post = {
        trip_id: this.state.tripId,
        post: {
          subtitle: this.state.caption,
          location_label: this.state.locationObject.label,
          location_longitude: this.state.locationObject.x,
          location_latitude: this.state.locationObject.y,
          text: window.tinymce.activeEditor.getContent(),
        },
      };
      // sending to API and give feedback
      axios.post('/posts', post).then((res) => {
        if (res.data.statusCode === 0) {
          this.props.showAlert('success', 'Successfully added a new post');
          this.props.history.push('/users/' + sessionStorage.getItem('user'));
        } else {
          this.setState({ toggleAlert: true });
        }
      });
    });
    window.$('html, body').animate({ scrollTop: 0 }, '50');
  };

  // Shows modal on submit
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    return (
      <div>
        <Alert variant='danger' id='alert' show={this.state.toggleAlert}>
          Something went wrong. Please check your inputs.
        </Alert>

        <div as={Row} className='container' style={formStyle}>
          {!this.state.isLoading ? (
            <React.Fragment>
              <Col>
                <PostForm
                  heading='Add a blog entry'
                  handleChange={this.handleChange}
                  handleEditorChange={this.handleEditorChange}
                  handleLocationApi={this.handleLocationApi}
                  locationObject={this.state.locationObject}
                  trips={this.state.trips}
                />
                <div style={btnLayout}>
                  <Button
                    variant='outline-ownLight'
                    type='submit'
                    onClick={this.toggleModal}
                    size='lg'
                  >
                    Save
                  </Button>
                </div>
              </Col>
              <div>
                <SaveChangesModal
                  show={this.state.showModal}
                  onHide={() => this.setState({ showModal: false })}
                  onSubmit={() => this.handleSubmit()}
                  heading={'Are you sure you are done?'}
                />
              </div>
            </React.Fragment>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }
}
const formStyle = {
  paddingBottom: '100px',
  paddingTop: '50px',
};

const btnLayout = {
  marginTop: '50px',
  textAlign: 'center',
};

export default withRouter(CreatePost);
